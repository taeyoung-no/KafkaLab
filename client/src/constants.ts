/** 토픽 없을 때 화면용 (kafka NODE_ID 1..3) */
export const DEFAULT_BROKER_IDS = [1, 2, 3] as const

export const PARTITION_COUNT = 3

/** compose CONSUMER_ID — 화면 라벨 Consumer 0..n-1 과 1:1 */
export const CONSUMER_IDS = ['consumer-1', 'consumer-2', 'consumer-3'] as const

/** CONSUMED SSE 수신 후 consumer 상자로 옮기기 전 파티션에 남겨 두는 시간 */
export const CONSUMED_DISPLAY_DELAY_MS = 1000
