package com.kafka.monitor.dto;

public record LabEvent(
		String type,
		long sequence,
		String payload,
		int partition,
		long offset,
		String consumerId) {
}
