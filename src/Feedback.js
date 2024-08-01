import React from 'react'

function Feedback({timer, allFeedback, host}) {
  return (
    <div>
      {host && (<div className="timer">Time Left: {timer}s</div>)}
      <ul className="feedback-list">
        {allFeedback.map((feedback, index) => (
          <li key={index} className={`feedback ${feedback.includes('incorrect') ? 'incorrect' : ''}`}>
            {feedback}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Feedback