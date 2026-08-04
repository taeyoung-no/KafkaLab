import { useCallback, useEffect, useState } from 'react'
import type { LabMessage, PartitionLeader } from '../types'
import { DEFAULT_BROKER_IDS, PARTITION_COUNT, CONSUMER_IDS } from '../constants'

/** text-sm(leading-5) 4줄 + space-y-1 간격 3곳 */
const EVENT_LIST_HEIGHT = 'h-[5.75rem]'

type TopologyViewProps = {
  messages: LabMessage[]
  onProduce: () => void
  producing?: boolean
  /** produce/reset 후 리더 정보 다시 읽게 */
  topologyTick?: number
}

export function TopologyView({
  messages,
  onProduce,
  producing = false,
  topologyTick = 0,
}: TopologyViewProps) {
  const [leaders, setLeaders] = useState<PartitionLeader[]>([])
  const [activeBrokerId, setActiveBrokerId] = useState<number>(DEFAULT_BROKER_IDS[0])

  const loadTopology = useCallback(async () => {
    try {
      const res = await fetch('/api/topology')
      if (!res.ok) {
        console.error('topology failed', res.status)
        return
      }
      const data = (await res.json()) as PartitionLeader[]
      setLeaders(data)
    } catch (e) {
      console.error('topology failed', e)
    }
  }, [])

  // 처음 + 주기적으로 진짜 리더 갱신 (브로커 kill 실험용)
  useEffect(() => {
    void loadTopology()
    const id = window.setInterval(() => {
      void loadTopology()
    }, 2000)
    return () => window.clearInterval(id)
  }, [loadTopology])

  useEffect(() => {
    if (topologyTick > 0) {
      void loadTopology()
    }
  }, [topologyTick, loadTopology])

  const partitions = Array.from({ length: PARTITION_COUNT }, (_, id) => id)

  const roleOf = (brokerId: number, partitionId: number): string => {
    const p = leaders.find((x) => x.partition === partitionId)
    if (!p || p.leader < 0) {
      return '?'
    }
    return p.leader === brokerId ? 'leader' : 'follower'
  }

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
            disabled={producing}
            className="text-blue-800 cursor-pointer px-3 py-2 hover:text-black hover:underline mt-auto self-end disabled:opacity-50 disabled:cursor-wait"
          >
            이벤트 생성
          </button>
        </section>

        {/* Broker — 탭 id = Kafka NODE_ID (1..3 고정) */}
        <section className="flex-1 border border-gray-300 p-4 min-w-0">
          <h2 className="text-xl mb-1 flex flex-wrap items-baseline gap-4">
            {DEFAULT_BROKER_IDS.map((brokerId) => {
              const isActive = brokerId === activeBrokerId
              return (
                <button
                  key={brokerId}
                  type="button"
                  onClick={() => setActiveBrokerId(brokerId)}
                  className={
                    isActive
                      ? 'text-black underline cursor-pointer'
                      : 'text-blue-800 cursor-pointer hover:text-black hover:underline'
                  }
                >
                  Broker {brokerId}
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
              const role = roleOf(activeBrokerId, partitionId)

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
          {CONSUMER_IDS.map((backendId, index) => {
            const recent = messages
              .filter(
                (m) => m.stage === 'consumed' && m.consumerId === backendId,
              )
              .slice()
              .reverse()

            return (
              <div
                key={backendId}
                className="border border-gray-300 p-3 flex-1 min-h-0 flex flex-col"
              >
                <h4 className="text-black mb-1 shrink-0">Consumer {index}</h4>
                <p className="text-sm text-gray-500 mb-2 shrink-0">
                  {recent.length}개 소비
                </p>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {recent.length > 0 && (
                    <ul className="space-y-1">
                      {recent.slice(0, 5).map((msg) => (
                        <li key={msg.id} className="text-sm leading-5 text-black">
                          p{msg.partitionId} offset {msg.offset}: {msg.payload}
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
