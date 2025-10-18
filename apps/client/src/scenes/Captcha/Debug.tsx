import type { Challenge } from '../../services/types'
import { formatPredictions, type Prediction } from '../../utils'

type DebugProps = {
  predictions: Prediction[]
  matchedState: boolean[]
  challenge: Challenge
}

const Debug: React.FC<DebugProps> = ({
  predictions,
  matchedState,
  challenge,
}) => {
  const matchedPotints = matchedState.filter(m => m).length

  return (
    <div className="space-y-4">
      <p>
        Matched points: {matchedPotints} / {challenge.x.length}
      </p>
      <div className="space-y-1">
        <p>Predictions</p>
        <div className="w-full rounded-lg bg-gray-100 p-4">
          <p>
            {JSON.stringify(formatPredictions(predictions, 640, 480), null, 2)}
          </p>
        </div>
        <button
          className="btn w-full"
          onClick={() =>
            navigator.clipboard.writeText(
              JSON.stringify(formatPredictions(predictions, 640, 480)),
            )
          }
        >
          Copy
        </button>
      </div>
      <div className="space-y-1">
        <p>Challenge</p>
        <div className="w-full rounded-lg bg-gray-100 p-4">
          <p>{JSON.stringify(challenge, null, 2)}</p>
        </div>
      </div>
    </div>
  )
}

export default Debug
