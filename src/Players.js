import React from 'react'

function Players({players, readyPlayers, scores, name}) {
  return (
    <div className="player-list">
        <h3>Players</h3>
        <ul>
          {players.map(player => (
            <li key={player} className={`player-item ${player === name ? 'current-player' : ''} ${readyPlayers.includes(player) ? 'ready' : ''}`}>
              {player} {readyPlayers.includes(player) ? '(Ready)' : ''} 
              {scores && ` ${scores[player]} Correct`}
            </li>
          ))}
        </ul>
      </div>
  )
}

export default Players