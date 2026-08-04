package com.kafka.producer.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.TopicDescription;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartitionInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Service
public class EventProducerService {

	private static final String TOPIC = "events";
	private static final int PARTITION_COUNT = 3;
	private static final int TIMEOUT_SEC = 10;

	private final KafkaTemplate<String, String> kafkaTemplate;
	private final MonitorReporter monitorReporter;
	private final String bootstrapServers;

	private final AtomicLong sequence = new AtomicLong(0);

	public EventProducerService(
			KafkaTemplate<String, String> kafkaTemplate,
			MonitorReporter monitorReporter,
			@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
		this.kafkaTemplate = kafkaTemplate;
		this.monitorReporter = monitorReporter;
		this.bootstrapServers = bootstrapServers;
	}

	public synchronized ProducedEvent produce() {
		long n = sequence.incrementAndGet();
		int partition = (int) ((n - 1) % PARTITION_COUNT);
		String key = String.valueOf(n);
		String payload = "event " + n;

		try {
			SendResult<String, String> result = kafkaTemplate
					.send(TOPIC, partition, key, payload)
					.get();
			RecordMetadata meta = result.getRecordMetadata();
			monitorReporter.reportProduced(n, payload, meta.partition(), meta.offset());
			return new ProducedEvent(n, payload, TOPIC, meta.partition(), meta.offset());
		} catch (Exception e) {
			throw new IllegalStateException("서버 문제인 듯", e);
		}
	}

	public synchronized void reset() {
		sequence.set(0);
		deleteTopic();
	}

	public List<PartitionLeader> topology() {
		try (AdminClient admin = adminClient()) {
			Set<String> topics = admin.listTopics().names().get(TIMEOUT_SEC, TimeUnit.SECONDS);
			if (!topics.contains(TOPIC)) {
				return List.of();
			}

			TopicDescription desc = admin.describeTopics(List.of(TOPIC))
					.allTopicNames()
					.get(TIMEOUT_SEC, TimeUnit.SECONDS)
					.get(TOPIC);

			var leaders = new ArrayList<PartitionLeader>();
			for (TopicPartitionInfo p : desc.partitions()) {
				int leader = p.leader() != null ? p.leader().id() : -1;
				leaders.add(new PartitionLeader(p.partition(), leader));
			}
			leaders.sort((a, b) -> a.partition() - b.partition());
			return leaders;
		} catch (Exception e) {
			throw new IllegalStateException("서버 문제인 듯", e);
		}
	}

	private void deleteTopic() {
		try (AdminClient admin = adminClient()) {
			Set<String> topics = admin.listTopics().names().get(TIMEOUT_SEC, TimeUnit.SECONDS);
			if (!topics.contains(TOPIC)) {
				return;
			}

			admin.deleteTopics(Set.of(TOPIC)).all().get(TIMEOUT_SEC, TimeUnit.SECONDS);
		} catch (Exception e) {
			throw new IllegalStateException("서버 문제인 듯", e);
		}
	}

	private AdminClient adminClient() {
		return AdminClient.create(Map.of(
				AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers));
	}

	public record ProducedEvent(
			long sequence,
			String payload,
			String topic,
			int partition,
			long offset) {
	}

	public record PartitionLeader(int partition, int leader) {
	}
}

