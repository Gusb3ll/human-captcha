import { useState } from 'react'

import { Scene } from '../utils/types'

type HomeProps = {
  setScene: (s: Scene) => void
}

const Home: React.FC<HomeProps> = ({ setScene }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-16">
      <h1 className="text-4xl font-semibold">Human captcha</h1>
      <button
        onClick={() => {
          setIsLoading(true)
          setTimeout(() => {
            setScene(Scene.CAPTCHA)
          }, 1000)
        }}
        disabled={isLoading}
        className="btn btn-lg btn-primary w-xs transition-all disabled:w-3xs"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xl" />
        ) : (
          'Generate'
        )}
      </button>
    </div>
  )
}

export default Home
