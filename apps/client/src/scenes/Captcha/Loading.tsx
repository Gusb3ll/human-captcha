import { useState } from 'react'
import { useTimeout } from 'usehooks-ts'

const Loading = () => {
  const [isRendered, setIsRendered] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useTimeout(() => {
    setIsLoading(false)
  }, 2000)

  useTimeout(() => {
    setIsRendered(true)
  }, 4000)

  return isRendered ? (
    <div
      className={`absolute flex h-screen w-screen items-center justify-center gap-4 bg-black transition-all duration-1000 ${isLoading ? 'z-20 opacity-100' : 'z-0 opacity-0'}`}
    >
      <span className="loading loading-spinner loading-xl text-white" />
      <p className="text-2xl text-white">Starting Webcam...</p>
    </div>
  ) : (
    <></>
  )
}

export default Loading
