package com.kafka.producer.service;

import java.util.concurrent.atomic.AtomicLong;

import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Service
public class EventProducerService {

	private static final String TOPIC = "events";

	private final KafkaTemplate<String, String> kafkaTemplate;
	private final AtomicLong sequence = new AtomicLong(0);

	public EventProducerService(KafkaTemplate<String, String> kafkaTemplate) {
		this.kafkaTemplate = kafkaTemplate;
	}

	public ProducedEvent produce() {
		long n = sequence.incrementAndGet();
		String key = String.valueOf(n);
		String payload = "event " + n;

		try {
			SendResult<String, String> result = kafkaTemplate.send(TOPIC, key, payload).get();
			RecordMetadata meta = result.getRecordMetadata();
			return new ProducedEvent(n, payload, TOPIC, meta.partition(), meta.offset());
		} catch (Exception e) {
			throw new IllegalStateException("서버 문제인 듯" + TOPIC, e);
		}
	}

	public record ProducedEvent(
			long sequence,
			String payload,
			String topic,
			int partition,
			long offset) {
	}
}
