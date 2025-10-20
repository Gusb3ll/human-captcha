import { toast } from 'sonner'
import { Velustro } from 'uvcanvas'
import { useState } from 'react'

import { Scene } from '../utils/constants'
import type { Challenge } from '../services/types'
import { useMutation } from '@tanstack/react-query'
import { getChallenge } from '../services'

type HomeProps = {
  setScene: (s: Scene) => void
  setChallenge: (challenge: Challenge) => void
}

const Home: React.FC<HomeProps> = ({ setScene, setChallenge }) => {
  const [isChallengeLoaded, setIsChallengeLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getChallengeMutation = useMutation({
    mutationFn: () => getChallenge(),
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setChallenge(res)
      setIsChallengeLoaded(true)
      setTimeout(() => {
        setIsLoading(false)
        setScene(Scene.CAPTCHA)
      }, 3000)
    },
    onError: e => toast.error(e.message),
  })

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Velustro className="absolute" />
      <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center">
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black via-black/50 via-50% to-black transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 via-50% to-black/50 transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute inset-0 bg-black transition-opacity delay-1000 duration-1000 ease-in ${isChallengeLoaded ? 'z-999 opacity-100' : 'opacity-0'}`}
        />
        <button
          disabled={isLoading}
          className="z-10 cursor-pointer rounded-lg bg-white px-8 py-4 text-xl font-semibold transition-all duration-200 hover:scale-102 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:hover:scale-100"
          onClick={() => getChallengeMutation.mutate()}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xl" />
          ) : (
            'Generate'
          )}
        </button>
      </div>
    </div>
  )
}

export default Home
