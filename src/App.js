import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';
import Games from './Games';
import GameShow from './GameShow';
import Welcome from './Welcome';
import ConnectionForm from './ConnectionForm';

function App() {
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [currentGame, setCurrentGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [gameHost, setGameHost] = useState('');
  const [gameActive, setGameActive] = useState(false);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState([])

  const fetchGamesRef = useRef(null)

  useEffect(() => {
    // Main Function to handle different game event messages
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        switch (data.type) {
          case 'game_player_enter':
            setCurrentGame(data);
            setPlayers(data.payload.players);
            setReadyPlayers(Object.keys(data.payload.players_ready).filter(player => data.payload.players_ready[player]));
            setGameHost(data.payload.players[0]);
            break;
          case 'game_player_ready':
            setReadyPlayers((prevReadyPlayers) => [...prevReadyPlayers, data.payload.player]);
            break;
          case 'game_player_join':
            setPlayers((players) => [...players, data.payload.player]);
            break;
          case 'game_start':
            setGameActive(true);
            break;
          case 'game_question':
            setQuestion(data.payload);
            break;
          case 'game_end':
            setGameHost('')
            break;
          case 'game_player_incorrect':
            setFeedback({message: 'incorrect', name: data.payload.player});
            break;
          case 'game_player_correct':
            setFeedback({message: 'correct', name: data.payload.player});
            break;
          case 'game_create':
            if (fetchGamesRef.current){
              fetchGamesRef.current()
            }
            break;
          default:
            break;
        }
      };
    }
  }, [socket]);

  const handleConnect = (userName) => {
    // Connect a websocket when a user submits connection form
    setError('');
    const ws = new W3CWebSocket(`ws://localhost:8080/connect?name=${userName}`);
    setSocket(ws);

    ws.onopen = () => {
      setConnected(true);
      setName(userName)
    };

    ws.onclose = (event) => {
      // Handle disconnection and other connection errors
      if (event.code === 1000) {
        console.log("Disconnected normally.");
      } else if (event.code === 1006) {
        setError("The name is already taken. Please choose a different name.");
      } else {
        setError("An unexpected error occurred.");
      }
      setConnected(false);
      setCurrentGame(null);
      setSocket(null);
    };

    ws.onerror = (error) => {
      setError("Connection error. Please try again.");
      setConnected(false);
      setSocket(null);
    };
  };

  const handleGameJoin = (game) => {
    const nonce = Date.now().toString();
    const joinMessage = {
      type: 'join',
      nonce: nonce,
      payload: {
        game_id: game.id
      }
    };
    socket.send(JSON.stringify(joinMessage));
  };

  const handleGameEnd = () => {
    setCurrentGame(null);
    setQuestion(null);
    setGameActive(false);
  }

  const handleCreateGame = (gameName, questionCount) => {
    if (socket) {
      const nonce = Date.now().toString();
      const createMessage = {
        type: 'create',
        nonce: nonce,
        payload: {
          name: gameName,
          question_count: questionCount
        }
      };
      socket.send(JSON.stringify(createMessage));
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.close(1000, "Client disconnected");
    }
    setSocket(null);
    setConnected(false);
    setName('');
    setError('');
    setCurrentGame(null);
  };

  return (
    <div className="App">
      {!connected ? (
        <div className="connection-page">
          <Welcome />
          <ConnectionForm handleConnect={handleConnect} error={error}/>
        </div>
      ) : (
        currentGame ? (
          <GameShow
            name={name}
            host={gameHost}
            game={currentGame}
            socket={socket}
            players={players}
            readyPlayers={readyPlayers}
            gameEnd={handleGameEnd}
            gameActive={gameActive}
            setGameActive={setGameActive}
            question={question}
            feedback={feedback}
          />
        ) : (
          <Games 
            onGameJoin={handleGameJoin} 
            onCreateGame={handleCreateGame} 
            onDisconnect={handleDisconnect} 
            socket={socket}
            setFetchGamesRef={(fetchGames)=>fetchGamesRef.current = fetchGames}  
          />
        )
      )}
    </div>
  );
}

export default App;
