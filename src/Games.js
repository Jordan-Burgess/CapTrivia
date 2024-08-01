import React, { useState, useEffect } from 'react';
import './Games.css';
import GameForm from './GameForm';
import GameCard from './GameCard';

function Games({ onGameJoin, onCreateGame, onDisconnect, socket, setFetchGamesRef }) {
  const [gamesList, setGamesList] = useState([]);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:8080/games');
      const games = await response.json();
      setGamesList(games);
    } catch (err) {
      console.error('Failed to fetch games:', err);
    }
  };

  useEffect(() => {
    fetchGames();
    setFetchGamesRef(fetchGames)
  }, [setFetchGamesRef]);

  return (
    <div className="games-container">
      <div className="games-header">
        <h2>Available Games</h2>
        <button onClick={onDisconnect} className="disconnect-button">Disconnect</button>
      </div>
      <GameForm onCreateGame={onCreateGame} socket={socket}/>
      
      <div className="games-list">
        {gamesList.length ? (
          gamesList.map((game) => (
            <GameCard game={game} onGameJoin={onGameJoin}/>
        ))
      ) : (
    <p>No games available</p>
  )}
</div>
    </div>
  );
}

export default Games;