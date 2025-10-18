import { useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import Webcam from 'react-webcam'
import { useInterval } from 'usehooks-ts'

import { Scene, SOCKET_ENDPOINT } from '../../utils'
import type { WebsocketResponse } from '../../utils/types'
import { formatPredictions } from '../../utils'
import type { Challenge } from '../../services/types'
import Overlay from './Overlay'
import Debug from './Debug'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

type CaptchaProps = {
  challenge: Challenge
  setScene: (s: Scene) => void
}

const Captcha: React.FC<CaptchaProps> = ({ challenge, setScene }) => {
  const webcamRef = useRef<Webcam>(null)

  const [timer, setTimer] = useState(5)
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [matchedState, setMatchedState] = useState<boolean[]>(
    new Array(challenge.x.length).fill(false),
  )

  const { sendMessage, lastJsonMessage } = useWebSocket<WebsocketResponse>(
    `${SOCKET_ENDPOINT}/ws/predict`,
  )

  const totalMatched = matchedState.filter(m => m).length

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
  }, 50)

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
    }
  }, 100)

  useInterval(() => {
    if (totalMatched === challenge.x.length) {
      setTimer(prev => {
        if (prev > 0) {
          return prev - 1
        } else {
          setScene(Scene.RESULT)

          return 0
        }
      })
    } else {
      setTimer(5)
    }
  }, 1000)

  return (
    <div className="flex flex-col gap-4 p-8">
      <button
        onClick={() => setIsDebugMode(!isDebugMode)}
        className="btn btn-error z-999 w-fit"
      >
        {isDebugMode ? 'Disable' : 'Enable'} debug
      </button>
      <div className="flex w-full items-center justify-between">
        <FaArrowRight size="150px" />
        <div className="relative">
          <Overlay
            webcamRef={webcamRef}
            predictions={lastJsonMessage?.d ?? []}
            challenge={challenge}
            matchedState={matchedState}
          />
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center bg-black/80 transition-all ease-in-out ${timer === 5 ? 'opacity-0 delay-500' : 'opacity-100'}`}
          >
            <p className={`text-error text-8xl font-bold`}>
              <span className="countdown">
                <span
                  style={{ '--value': timer } as React.CSSProperties}
                  aria-live="polite"
                >
                  {timer}
                </span>
              </span>
            </p>
          </div>
        </div>
        <FaArrowLeft size="150px" />
      </div>
      <p className="text-center text-2xl font-semibold transition-all">
        {totalMatched} / {challenge.x.length}
      </p>

      {isDebugMode && (
        <Debug
          predictions={lastJsonMessage?.d ?? []}
          challenge={challenge}
          matchedState={matchedState}
        />
      )}
    </div>
  )
}

export default Captcha
