import React, { useState, useEffect } from 'react'

function GameControls({socket, game, name, host, readyPlayers, players, gameActive, gameEnd, scores}) {
    const [isReady, setIsReady] = useState(false);
    const [winners, setWinners] = useState([])
    const winnerString = winners?.length > 1
        ? winners.slice(0, -1).join(', ') + ' and ' + winners[winners.length - 1] + ' Wins!'
        : winners?.length === 1 ? winners[0] + ' Wins!'
        : 'No Wins'

    const handleReady = () => {
        if (socket && game) {
          const nonce = Date.now().toString();
          const readyMessage = {
            type: 'ready',
            nonce: nonce,
            payload: {
              game_id: game.id
            }
          };
          socket.send(JSON.stringify(readyMessage));
          setIsReady(true);
        }
      };
    
    const handleStart = () => {
        if (socket && game) {
          const nonce = Date.now().toString();
          const readyMessage = {
            type: 'start',
            nonce: nonce,
            payload: {
              game_id: game.id
            }
          };
          socket.send(JSON.stringify(readyMessage));
        }
      };

    const getWinners = (scores) => {
        if(scores){
        const winners = Object.entries(scores).reduce((acc, [key, value]) => {
            if (value > acc.maxValue) {
                acc.maxValue = value
                acc.keys = [key]
            } else if (value === acc.maxValue) {
                acc.keys.push(key)
            }
            return acc
        }, {maxValue: 0, keys: []})

        if (winners.maxValue === 0) {
            return [];
        }
        return winners.keys
    }
    }

    useEffect(()=>{
        setWinners(getWinners(scores))
    }, [host])
  
  return (
    <div className="controls">
      {!isReady && (
          <button className="button ready-button" onClick={handleReady}>Ready</button>
      )}
      {name === host && readyPlayers.length === players.length && !gameActive ? (
          <button className="button start-game-button" onClick={handleStart}>Start Game</button>
      ) : !gameActive ? (
          <p>Waiting for All Players to Get Ready</p>
      ) : !host && (
          <div>
          <h2>Game Over!</h2>
          <h3>{winnerString}</h3>
          <button onClick={gameEnd} className='button exit-button'>Exit Game</button>
          </div>
      )}
    </div>
  )
}

export default GameControls