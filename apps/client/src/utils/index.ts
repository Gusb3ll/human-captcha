import { ReadyState } from 'react-use-websocket'

import type { Prediction } from './types'

export const getConnectionStatus = (readyState: ReadyState) => {
  return {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]
}

const normalizePosition = (val: number, dimension: number) => {
  if (dimension) {
    return +(val / dimension).toFixed(3)
  }

  return 0
}

export const formatPredictions = (
  prediction: Prediction[],
  imageWidth: number,
  imageHeight: number,
) => {
  if (!prediction) {
    return []
  }

  return prediction.map(hand => {
    return {
      // name: hand.name,
      // class: hand.class,
      confidence: +hand.confidence.toFixed(2),
      // box: {
      //   x1: +hand.box.x1.toFixed(0),
      //   y1: +hand.box.y1.toFixed(0),
      //   x2: +hand.box.x2.toFixed(0),
      //   y2: +hand.box.y2.toFixed(0),
      // },
      keypoints: {
        x: hand.keypoints.x.map((val: number) =>
          normalizePosition(val, imageWidth),
        ),
        y: hand.keypoints.y.map((val: number) =>
          normalizePosition(val, imageHeight),
        ),
        // visible: hand.keypoints.visible.map(val => +val.toFixed(2)),
      },
    }
  })
}

export * from './constants'
export * from './types'
