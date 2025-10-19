import { useWindowSize } from 'usehooks-ts'
import Confetti from 'react-confetti'

import { Scene } from '../utils/constants'

type ResultProps = {
  setScene: (s: Scene) => void
}

const Result: React.FC<ResultProps> = ({ setScene }) => {
  const { width, height } = useWindowSize()

  return (
    <>
      <Confetti width={width} height={height} />
      <div className="flex h-[50dvh] w-full flex-col items-center justify-center gap-16">
        <h1 className="animate-bounce text-6xl font-bold">
          ! Captcha Passed !
        </h1>
        <button
          onClick={() => setScene(Scene.HOME)}
          className="btn btn-primary btn-xl w-[200px]"
        >
          Reset
        </button>
      </div>
    </>
  )
}

export default Result
