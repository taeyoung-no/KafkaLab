package com.kafka.consumer.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EventConsumerService {

	private final MonitorReporter monitorReporter;

	public EventConsumerService(MonitorReporter monitorReporter) {
		this.monitorReporter = monitorReporter;
	}

	@KafkaListener(topics = "events", groupId = "lab-consumer")
	public void onMessage(ConsumerRecord<String, String> record) {
		System.out.println(
				"consumed partition=" + record.partition()
						+ " offset=" + record.offset()
						+ " key=" + record.key()
						+ " value=" + record.value());

		long sequence = parseSequence(record.key());
		monitorReporter.reportConsumed(
				sequence,
				record.value(),
				record.partition(),
				record.offset());
	}

	private static long parseSequence(String key) {
		try {
			return Long.parseLong(key);
		} catch (NumberFormatException e) {
			return -1L;
		}
	}
}
