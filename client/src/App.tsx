import { useCallback, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { TopologyView } from './components/TopologyView'
import { DISPLAY_HOLD_MS, PARTITION_COUNT } from './mockData'
import type { LabMessage } from './types'

function App() {
  const [messages, setMessages] = useState<LabMessage[]>([])
  const [rrIndex, setRrIndex] = useState(0)
  const offsetByPartition = useRef<number[]>(
    Array.from({ length: PARTITION_COUNT }, () => 0),
  )
  const seq = useRef(0)

  const handleProduce = useCallback(() => {
    const partitionId = rrIndex % PARTITION_COUNT
    const offset = offsetByPartition.current[partitionId]
    offsetByPartition.current[partitionId] = offset + 1
    seq.current += 1

    const id = `msg-${seq.current}`
    const message: LabMessage = {
      id,
      payload: `event ${seq.current}`,
      partitionId,
      offset,
      stage: 'partition',
    }

    setMessages((prev) => [...prev, message])
    setRrIndex((i) => i + 1)

    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, stage: 'consumed' } : m,
        ),
      )
    }, DISPLAY_HOLD_MS)
  }, [rrIndex])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <TopologyView messages={messages} onProduce={handleProduce} />
    </div>
  )
}

export default App
