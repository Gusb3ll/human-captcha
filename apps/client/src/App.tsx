import { useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import Webcam from 'react-webcam'
import { formatPredictions, getConnectionStatus } from './utils'
import { useInterval } from 'usehooks-ts'

import type { WebsocketResponse } from './utils/types'

const App = () => {
  const webcamRef = useRef<Webcam>(null)

  const { sendMessage, lastJsonMessage, readyState } =
    useWebSocket<WebsocketResponse>('ws://localhost:4000/ws/predict')

  useInterval(() => {
    if (webcamRef.current) {
      const imageBase64 = webcamRef.current.getScreenshot({
        width: 640,
        height: 480,
      })
      const imagePart = imageBase64?.split(',')[1] ?? ''

      sendMessage(imagePart)
    }
  }, 50)

  return (
    <div className="flex flex-col gap-4 p-8">
      <p>Socket: {getConnectionStatus(readyState)}</p>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4">
          <p>live</p>
          <Webcam
            ref={webcamRef}
            audio={false}
            width={640}
            height={480}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
            className="max-h-[480px] max-w-[640px]"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p>rendered</p>
          {lastJsonMessage && lastJsonMessage.i && (
            <img
              className="max-h-[480px] max-w-[640px]"
              src={`data:image/jpeg;base64,${lastJsonMessage.i}`}
              alt="Processed"
            />
          )}
        </div>
      </div>
      {lastJsonMessage && (
        <div className="w-full rounded-lg bg-gray-100 p-4">
          <p className="">
            {JSON.stringify(
              formatPredictions(lastJsonMessage.d, 640, 480),
              null,
              2,
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default App
