export type WebsocketResponse = {
  c: number
  // i: string
  d: Prediction[]
}

export type Prediction = {
  name: string // always "hand"
  class: number // always 0
  confidence: number
  box: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
  keypoints: {
    x: number[] // 21 values
    y: number[] // 21 values
    visible: number[] // 21 values
  }
}
