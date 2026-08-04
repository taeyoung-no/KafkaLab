import { useCallback, useEffect, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { TopologyView } from './components/TopologyView'
import { CONSUMED_DISPLAY_DELAY_MS } from './constants'
import type { LabMessage, MonitorEvent } from './types'

function App() {
  const [messages, setMessages] = useState<LabMessage[]>([])
  const [producing, setProducing] = useState(false)
  const consumeTimers = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const source = new EventSource('/api/stream')

    source.onmessage = (msg) => {
      let event: MonitorEvent
      try {
        event = JSON.parse(msg.data) as MonitorEvent
      } catch {
        return
      }

      const id = String(event.sequence)

      if (event.type === 'PRODUCED') {
        setMessages((prev) => {
          if (prev.some((m) => m.id === id)) {
            return prev
          }
          return [
            ...prev,
            {
              id,
              payload: event.payload,
              partitionId: event.partition,
              offset: event.offset,
              stage: 'partition',
            },
          ]
        })
        return
      }

      if (event.type === 'CONSUMED') {
        const prevTimer = consumeTimers.current.get(id)
        if (prevTimer !== undefined) {
          window.clearTimeout(prevTimer)
        }

        const timer = window.setTimeout(() => {
          consumeTimers.current.delete(id)
          setMessages((prev) => {
            const existing = prev.find((m) => m.id === id)
            if (existing) {
              return prev.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      stage: 'consumed',
                      consumerId: event.consumerId ?? undefined,
                      partitionId: event.partition,
                      offset: event.offset,
                      payload: event.payload,
                    }
                  : m,
              )
            }
            // CONSUMED가 PRODUCED보다 먼저 도착한 경우
            return [
              ...prev,
              {
                id,
                payload: event.payload,
                partitionId: event.partition,
                offset: event.offset,
                stage: 'consumed',
                consumerId: event.consumerId ?? undefined,
              },
            ]
          })
        }, CONSUMED_DISPLAY_DELAY_MS)

        consumeTimers.current.set(id, timer)
      }
    }

    source.onerror = () => {
      // EventSource reconnects automatically
    }

    return () => {
      source.close()
      for (const timer of consumeTimers.current.values()) {
        window.clearTimeout(timer)
      }
      consumeTimers.current.clear()
    }
  }, [])

  const handleProduce = useCallback(async () => {
    if (producing) {
      return
    }
    setProducing(true)
    try {
      const res = await fetch('/api/produce')
      if (!res.ok) {
        console.error('produce failed', res.status)
      }
    } catch (e) {
      console.error('produce failed', e)
    } finally {
      setProducing(false)
    }
  }, [producing])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <TopologyView
        messages={messages}
        onProduce={handleProduce}
        producing={producing}
      />
    </div>
  )
}

export default App
