import React, {useState} from 'react'

function GameForm({onCreateGame, socket}) {
  const [newGameName, setNewGameName] = useState('')
  const [questionCount, setQuestionCount] = useState(10)

  const handleCreateGame = () => {
    if (newGameName && socket) {
      onCreateGame(newGameName, questionCount);
      setNewGameName('');
    }
  };

  return (
    <div className="new-game-form">
      <label htmlFor="newGameName">Game Name</label>
      <input
        type="text"
        id="newGameName"
        value={newGameName}
        onChange={(e) => setNewGameName(e.target.value)}
        placeholder="Enter new game name"
      />
  
      <label htmlFor="questionCount">Number of Questions</label>
      <input
        type="number"
        id="questionCount"
        value={questionCount}
        onChange={(e) => setQuestionCount(e.target.value)}
        placeholder="Questions"
        min="1"
      />
    
      <button onClick={handleCreateGame} className="create-game-button">Create Game</button>
    </div>
  )
}

export default GameForm