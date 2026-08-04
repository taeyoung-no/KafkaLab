export type MessageStage = 'partition' | 'consumed'

export type LabMessage = {
  id: string
  payload: string
  partitionId: number
  offset: number
  stage: MessageStage
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
