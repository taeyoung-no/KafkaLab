package com.kafka.producer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class MonitorReporter {

	private final RestClient restClient;

	public MonitorReporter(@Value("${monitor.url}") String monitorUrl) {
		this.restClient = RestClient.builder().baseUrl(monitorUrl).build();
	}

	public void reportProduced(long sequence, String payload, int partition, long offset) {
		try {
			restClient.post()
					.uri("/api/events")
					.body(new LabEvent("PRODUCED", sequence, payload, partition, offset, null))
					.retrieve()
					.toBodilessEntity();
		} catch (Exception e) {
			System.err.println("[MonitorReporter] " + e.getMessage());
		}
	}

	public record LabEvent(
			String type,
			long sequence,
			String payload,
			int partition,
			long offset,
			String consumerId) {
	}
}
