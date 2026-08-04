package com.kafka.consumer.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EventConsumerService {

	@KafkaListener(topics = "events", groupId = "lab-consumer")
	public void onMessage(ConsumerRecord<String, String> record) {
		System.out.println(
				"consumed partition=" + record.partition()
						+ " offset=" + record.offset()
						+ " key=" + record.key()
						+ " value=" + record.value());
	}
}
