import React from 'react'

function Question({socket, game, question, hasAnswered, setHasAnswered}) {
  const handleAnswer = (answerIndex, questionId) => {
    if (socket && game && !hasAnswered) {
      const nonce = Date.now().toString();
      const answerMessage = {
        type: 'answer',
        nonce: nonce,
        payload: {
              game_id: game.id,
              index: answerIndex,
              question_id: questionId
        }
      };
      socket.send(JSON.stringify(answerMessage));
      setHasAnswered(true);
    }
  };
  
  return (
    <div>
      <h2>{question.question}</h2>
      <ul className="question-option-list">
      {question.options.map((option, index) => (
        <li 
          key={index} 
          className={`question-option ${hasAnswered ? 'disabled' : ''}`} 
          onClick={() => !hasAnswered && handleAnswer(index, question.id)}
        >
        {option}
        </li>
      ))}
      </ul>
    </div>
  )
}

export default Question