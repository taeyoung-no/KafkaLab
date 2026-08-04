package com.kafka.monitor.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.kafka.monitor.dto.LabEvent;
import com.kafka.monitor.service.EventBroadcaster;

@RestController
@RequestMapping("/api")
public class EventController {

	private final EventBroadcaster eventBroadcaster;

	public EventController(EventBroadcaster eventBroadcaster) {
		this.eventBroadcaster = eventBroadcaster;
	}

	@PostMapping("/events")
	public ResponseEntity<Void> receive(@RequestBody LabEvent event) {
		System.out.println(
				"monitor event type=" + event.type()
						+ " sequence=" + event.sequence()
						+ " payload=" + event.payload()
						+ " partition=" + event.partition()
						+ " offset=" + event.offset()
						+ " consumerId=" + event.consumerId());
		eventBroadcaster.publish(event);
		return ResponseEntity.ok().build();
	}

	@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter stream() {
		return eventBroadcaster.subscribe();
	}
}
