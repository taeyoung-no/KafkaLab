package com.kafka.monitor.service;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.kafka.monitor.dto.LabEvent;

@Service
public class EventBroadcaster {

	private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

	public SseEmitter subscribe() {
		var emitter = new SseEmitter(0L);
		emitters.add(emitter);
		emitter.onCompletion(() -> emitters.remove(emitter));
		emitter.onTimeout(() -> emitters.remove(emitter));
		emitter.onError(e -> emitters.remove(emitter));
		return emitter;
	}

	public void publish(LabEvent event) {
		for (SseEmitter emitter : emitters) {
			try {
				emitter.send(SseEmitter.event().data(event));
			} catch (IOException e) {
				emitters.remove(emitter);
				emitter.completeWithError(e);
			}
		}
	}
}
