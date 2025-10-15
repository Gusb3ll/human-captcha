import { useState } from 'react'

import { Scene } from '../utils/constants'
import type { Challenge } from '../services/types'
import { useMutation } from '@tanstack/react-query'
import { getChallenge } from '../services'
import { toast } from 'sonner'

type HomeProps = {
  setScene: (s: Scene) => void
  setChallenge: (challenge: Challenge) => void
}

const Home: React.FC<HomeProps> = ({ setScene, setChallenge }) => {
  const [isLoading, setIsLoading] = useState(false)

  const getChallengeMutation = useMutation({
    mutationFn: () => getChallenge(),
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setChallenge(res)
      setTimeout(() => {
        setIsLoading(false)
        setScene(Scene.CAPTCHA)
      }, 1000)
    },
    onError: e => toast.error(e.message),
  })

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-16">
      <h1 className="text-4xl font-semibold">Human captcha</h1>
      <button
        onClick={() => getChallengeMutation.mutate()}
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
