package com.kafka.consumer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class MonitorReporter {

	private final RestClient restClient;
	private final String consumerId;

	public MonitorReporter(
			@Value("${monitor.url}") String monitorUrl,
			@Value("${consumer.id}") String consumerId) {
		this.restClient = RestClient.builder().baseUrl(monitorUrl).build();
		this.consumerId = consumerId;
	}

	public void reportConsumed(long sequence, String payload, int partition, long offset) {
		try {
			restClient.post()
					.uri("/api/events")
					.body(new LabEvent("CONSUMED", sequence, payload, partition, offset, consumerId))
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
