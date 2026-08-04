package com.kafka.monitor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kafka.monitor.dto.LabEvent;

@RestController
@RequestMapping("/api")
public class EventController {

	@PostMapping("/events")
	public ResponseEntity<Void> receive(@RequestBody LabEvent event) {
		System.out.println(
				"monitor event type=" + event.type()
						+ " sequence=" + event.sequence()
						+ " payload=" + event.payload()
						+ " partition=" + event.partition()
						+ " offset=" + event.offset()
						+ " consumerId=" + event.consumerId());
		return ResponseEntity.ok().build();
	}
}
