import { useState } from 'react'
import Home from './scene/Home'
import Captcha from './scene/Captcha'
import Result from './scene/Result'

import { Scene } from './utils/types'

const App = () => {
  const [scene, setScene] = useState<Scene>(Scene.HOME)

  return (
    <>
      {scene === Scene.CAPTCHA ? (
        <Captcha setScene={(s: Scene) => setScene(s)} />
      ) : scene === Scene.RESULT ? (
        <Result setScene={(s: Scene) => setScene(s)} />
      ) : (
        <Home setScene={(s: Scene) => setScene(s)} />
      )}
    </>
  )
}

export default App
