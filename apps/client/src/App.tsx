import { useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import Webcam from 'react-webcam'
import { getConnectionStatus } from './utils'
import { useInterval } from 'usehooks-ts'

const App = () => {
  const webcamRef = useRef<Webcam>(null)

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket<{
    c: number
    i: string
    d: any[]
  }>('ws://localhost:4000/ws/predict')

  useInterval(() => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot({ width: 640, height: 480 })
      if (image) {
        sendMessage(image)
      }
    }
  }, 100)

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
          {lastJsonMessage && (
            <img
              className="max-h-[480px] max-w-[640px]"
              src={lastJsonMessage.i}
              alt="Processed"
            />
          )}
        </div>
      </div>
      <div className="w-full rounded-lg bg-gray-100 p-4">
        <p className="wrap-break-word">{JSON.stringify(lastJsonMessage?.d)}</p>
      </div>
    </div>
  )
}

export default App
