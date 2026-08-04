export type MessageStage = 'partition' | 'consumed'

export type LabMessage = {
  id: string
  payload: string
  partitionId: number
  offset: number
  stage: MessageStage
  consumerId?: string
}

/** monitor SSE payload */
export type MonitorEvent = {
  type: 'PRODUCED' | 'CONSUMED'
  sequence: number
  payload: string
  partition: number
  offset: number
  consumerId: string | null
}

/** producer GET /api/topology — 파티션 n의 리더 브로커 id */
export type PartitionLeader = {
  partition: number
  leader: number
}
