import { useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import Webcam from 'react-webcam'
import { useInterval } from 'usehooks-ts'

import { Scene, SOCKET_ENDPOINT } from '../utils'
import type { WebsocketResponse } from '../utils/types'
import { formatPredictions } from '../utils'
import type { Challenge } from '../services/types'

type CaptchaProps = {
  challenge: Challenge
  setScene: (s: Scene) => void
}

const GLOBAL_OFFSET = 27

const Captcha: React.FC<CaptchaProps> = ({ challenge, setScene }) => {
  const webcamRef = useRef<Webcam>(null)

  const [matchedState, setMatchedState] = useState<boolean[]>(
    new Array(challenge.x.length).fill(false),
  )
  const [totalMatched, setTotalMatched] = useState(0)

  const { sendMessage, lastJsonMessage } = useWebSocket<WebsocketResponse>(
    `${SOCKET_ENDPOINT}/ws/predict`,
  )

  useInterval(() => {
    if (webcamRef.current) {
      const imageBase64 = webcamRef.current.getScreenshot({
        width: 640,
        height: 480,
      })
      const imagePart = imageBase64?.split(',')[1] ?? ''

      if (imagePart) {
        sendMessage(imagePart)
      }
    }
  }, 100)

  useInterval(() => {
    if (lastJsonMessage) {
      const normalizedPredictions = formatPredictions(
        lastJsonMessage.d,
        640,
        480,
      )

      const matchedChallengeIndices = new Set<number>()

      challenge.x.forEach((cx, i) => {
        const cy = challenge.y[i]

        normalizedPredictions.forEach(prediction => {
          prediction.keypoints.x.forEach((px, j) => {
            const py = prediction.keypoints.y[j]

            if (Math.abs(cx - px) < 0.025 && Math.abs(cy - py) < 0.025) {
              matchedChallengeIndices.add(i)
            }
          })
        })
      })

      const newMatchedState = challenge.x.map((_, i) =>
        matchedChallengeIndices.has(i),
      )
      setMatchedState(newMatchedState)
      setTotalMatched(matchedChallengeIndices.size)
    }
  }, 100)

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4">
          <Webcam
            ref={webcamRef}
            audio={false}
            width={640}
            height={480}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
            mirrored={true}
            className="max-h-[480px] max-w-[640px]"
          />
        </div>
        <svg
          className="absolute top-0 left-0 max-h-[480px] max-w-[640px]"
          width={640}
          height={480}
          viewBox="0 0 640 480"
        >
          {lastJsonMessage?.d?.map((prediction, index: number) => (
            <g key={index}>
              <rect
                x={prediction.box.x1 + GLOBAL_OFFSET}
                y={prediction.box.y1 + GLOBAL_OFFSET}
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
                      cx={x + GLOBAL_OFFSET}
                      cy={y + GLOBAL_OFFSET}
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
          className="absolute top-0 left-0 max-h-[480px] max-w-[640px]"
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
                  cx={realX + GLOBAL_OFFSET}
                  cy={realY + GLOBAL_OFFSET}
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
      {lastJsonMessage && (
        <div className="w-full rounded-lg bg-gray-100 p-4">
          <p>
            {JSON.stringify(
              formatPredictions(lastJsonMessage.d, 640, 480),
              null,
              2,
            )}
          </p>
        </div>
      )}
      <p>
        Matched points: {totalMatched} / {challenge.x.length}
      </p>
      <button
        className="btn btn-lg"
        onClick={() =>
          navigator.clipboard.writeText(
            JSON.stringify(formatPredictions(lastJsonMessage.d, 640, 480)),
          )
        }
      >
        copy
      </button>
      <p>challenge</p>
      <div className="w-full rounded-lg bg-gray-100 p-4">
        <p>{JSON.stringify(challenge, null, 2)}</p>
      </div>
    </div>
  )
}

export default Captcha
