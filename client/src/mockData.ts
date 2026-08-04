import type { Broker } from './types'

/** RF=3, 파티션 3 · 브로커 3 정적 토폴로지 (리더/팔로워 배치 예시) */
export const BROKERS: Broker[] = [
  {
    id: 0,
    partitions: [
      { partitionId: 0, role: 'leader' },
      { partitionId: 1, role: 'follower' },
      { partitionId: 2, role: 'follower' },
    ],
  },
  {
    id: 1,
    partitions: [
      { partitionId: 1, role: 'leader' },
      { partitionId: 2, role: 'follower' },
      { partitionId: 0, role: 'follower' },
    ],
  },
  {
    id: 2,
    partitions: [
      { partitionId: 2, role: 'leader' },
      { partitionId: 0, role: 'follower' },
      { partitionId: 1, role: 'follower' },
    ],
  },
]

export const PARTITION_COUNT = 3
export const CONSUMER_COUNT = 3
export const DISPLAY_HOLD_MS = 1000
