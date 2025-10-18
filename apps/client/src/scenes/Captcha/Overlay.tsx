import Webcam from 'react-webcam'

import type { Prediction } from '../../utils'
import type { Challenge } from '../../services/types'

type OverlayProps = {
  webcamRef: React.RefObject<Webcam | null>
  predictions: Prediction[]
  challenge: Challenge
  matchedState: boolean[]
}

const Overlay: React.FC<OverlayProps> = ({
  webcamRef,
  predictions,
  challenge,
  matchedState,
}) => {
  return (
    <div className="relative h-[480px] w-[640px]">
      <Webcam
        ref={webcamRef}
        audio={false}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        mirrored={true}
        className="h-full w-full"
      />
      <svg
        className="absolute top-0 left-0 h-full w-full"
        width={640}
        height={480}
        viewBox="0 0 640 480"
      >
        {predictions.map((prediction, index: number) => (
          <g key={index}>
            <rect
              x={prediction.box.x1}
              y={prediction.box.y1}
              width={prediction.box.x2 - prediction.box.x1}
              height={prediction.box.y2 - prediction.box.y1}
              fill="none"
              stroke="lime"
              strokeWidth="2"
            />
            {prediction.keypoints.x.map((x, i) => {
              const y = prediction.keypoints.y[i]
              const visible = prediction.keypoints.visible[i]
              if (visible > 0.9) {
                return (
                  <circle
                    key={`k-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="red"
                    stroke="white"
                    strokeWidth="1"
                  />
                )
              }
            })}
          </g>
        ))}
      </svg>
      <svg
        className="absolute top-0 left-0 h-full w-full"
        width={640}
        height={480}
        viewBox="0 0 640 480"
      >
        <g>
          {challenge.x.map((x, i) => {
            const realX = x * 640
            const realY = challenge.y[i] * 480

            const matched = matchedState[i]

            return (
              <circle
                key={`ck-${i}`}
                cx={realX}
                cy={realY}
                r="3"
                fill={matched ? 'yellow' : 'blue'}
                stroke="white"
                strokeWidth="1"
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default Overlay
