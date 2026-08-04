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

export type BrokerRole = 'leader' | 'follower'

export type PartitionReplica = {
  partitionId: number
  role: BrokerRole
}

export type Broker = {
  id: number
  partitions: PartitionReplica[]
}
