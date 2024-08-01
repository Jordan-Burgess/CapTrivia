import React from 'react'

function GameCard({game, onGameJoin}) {
  return (
    <div key={game.id} className={`game ${game.state === 'ended' ? 'game-ended' : ''}`}>
      <h3>{game.name}</h3>
      <p>Players: {game.player_count}</p>
      <p>Questions: {game.question_count}</p>
      <p>Status: {game.state}</p>
      {game.state !== 'ended' && <button className="join-button" onClick={() => onGameJoin(game)}>Join</button>}
    </div>
  )
}

export default GameCard