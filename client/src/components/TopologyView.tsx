import { useState } from 'react'
import type { LabMessage } from '../types'
import {
  BROKERS,
  PARTITION_COUNT,
  CONSUMER_COUNT,
} from '../mockData'

/** text-sm(leading-5) 4줄 + space-y-1 간격 3곳 */
const EVENT_LIST_HEIGHT = 'h-[5.75rem]'

type TopologyViewProps = {
  messages: LabMessage[]
  onProduce: () => void
}

export function TopologyView({
  messages,
  onProduce,
}: TopologyViewProps) {
  const [activeBrokerId, setActiveBrokerId] = useState(0)

  const partitions = Array.from({ length: PARTITION_COUNT }, (_, id) => id)
  const consumers = Array.from({ length: CONSUMER_COUNT }, (_, id) => id)
  const activeBroker =
    BROKERS.find((b) => b.id === activeBrokerId) ?? BROKERS[0]

  const roleOf = (partitionId: number) =>
    activeBroker.partitions.find((p) => p.partitionId === partitionId)?.role ??
    'follower'

  return (
    <main className="w-full max-w-6xl mx-auto px-4 pb-10">
      <div className="flex items-stretch gap-4">
        {/* Producer */}
        <section className="w-48 shrink-0 border border-gray-300 p-4 flex flex-col">
          <h2 className="text-xl mb-4">Producer</h2>
          <p className="text-sm text-gray-500 mb-4">{messages.length}개 생성</p>
          <button
            type="button"
            onClick={onProduce}
            className="text-blue-800 cursor-pointer px-3 py-2 hover:text-black hover:underline mt-auto self-end"
          >
            이벤트 생성
          </button>
        </section>

        {/* Broker — 제목이 broker 탭 */}
        <section className="flex-1 border border-gray-300 p-4 min-w-0">
          <h2 className="text-xl mb-1 flex flex-wrap items-baseline gap-4">
            {BROKERS.map((broker) => {
              const isActive = broker.id === activeBrokerId
              return (
                <button
                  key={broker.id}
                  type="button"
                  onClick={() => setActiveBrokerId(broker.id)}
                  className={
                    isActive
                      ? 'text-black underline cursor-pointer'
                      : 'text-blue-800 cursor-pointer hover:text-black hover:underline'
                  }
                >
                  broker-{broker.id}
                </button>
              )
            })}
          </h2>
          <div className="flex flex-col gap-3 mt-4">
            {partitions.map((partitionId) => {
              const waiting = messages.filter(
                (m) =>
                  m.partitionId === partitionId && m.stage === 'partition',
              )
              const role = roleOf(partitionId)

              return (
                <div
                  key={partitionId}
                  className="border border-gray-300 p-3 shrink-0"
                >
                  <h4 className="text-black mb-1">
                    Partition {partitionId} ({role})
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    대기 {waiting.length}개
                  </p>
                  <div className={EVENT_LIST_HEIGHT}>
                    {waiting.length > 0 && (
                      <ul className="space-y-1">
                        {waiting.map((msg) => (
                          <li key={msg.id} className="text-sm leading-5 text-black">
                            offset {msg.offset}: {msg.payload}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Consumers */}
        <section className="w-52 shrink-0 flex flex-col gap-3">
          {consumers.map((consumerId) => {
            const assignedPartition = consumerId
            const recent = messages
              .filter(
                (m) =>
                  m.partitionId === assignedPartition &&
                  m.stage === 'consumed',
              )
              .slice()
              .reverse()

            return (
              <div
                key={consumerId}
                className="border border-gray-300 p-3 flex-1 min-h-0 flex flex-col"
              >
                <h4 className="text-black mb-1 shrink-0">
                  Consumer {consumerId}
                </h4>
                <p className="text-sm text-gray-500 mb-2 shrink-0">
                  {recent.length}개 소비
                </p>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {recent.length > 0 && (
                    <ul className="space-y-1">
                      {recent.slice(0, 5).map((msg) => (
                        <li key={msg.id} className="text-sm leading-5 text-black">
                          offset {msg.offset}: {msg.payload}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
