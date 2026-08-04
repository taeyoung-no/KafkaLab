package com.kafka.producer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kafka.producer.service.EventProducerService;
import com.kafka.producer.service.EventProducerService.PartitionLeader;
import com.kafka.producer.service.EventProducerService.ProducedEvent;

@RestController
@RequestMapping("/api")
public class ProduceController {

	private final EventProducerService eventProducerService;

	public ProduceController(EventProducerService eventProducerService) {
		this.eventProducerService = eventProducerService;
	}

	@GetMapping("/produce")
	public ResponseEntity<ProducedEvent> produce() {
		return ResponseEntity.ok(eventProducerService.produce());
	}

	@PostMapping("/reset")
	public ResponseEntity<Void> reset() {
		eventProducerService.reset();
		return ResponseEntity.ok().build();
	}

	@GetMapping("/topology")
	public ResponseEntity<List<PartitionLeader>> topology() {
		return ResponseEntity.ok(eventProducerService.topology());
	}
}
