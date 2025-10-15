import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'

import { Scene } from './utils'
import Home from './scenes/Home'
import Captcha from './scenes/Captcha'
import Result from './scenes/Result'
import type { Challenge } from './services/types'

const App = () => {
  const [client] = useState(() => new QueryClient())
  const [scene, setScene] = useState<Scene>(Scene.HOME)

  const [challenge, setChallenge] = useState<Challenge | null>(null)

  return (
    <QueryClientProvider client={client}>
      <main>
        {scene === Scene.CAPTCHA ? (
          <Captcha
            challenge={challenge!}
            setScene={(s: Scene) => setScene(s)}
          />
        ) : scene === Scene.RESULT ? (
          <Result setScene={(s: Scene) => setScene(s)} />
        ) : (
          <Home
            setChallenge={setChallenge}
            setScene={(s: Scene) => setScene(s)}
          />
        )}
        <Toaster richColors position="bottom-center" />
      </main>
    </QueryClientProvider>
  )
}

export default App
