import React, { useEffect, useState } from 'react';
import './GameShow.css';
import Players from './Players';
import Question from './Question';
import Feedback from './Feedback';
import GameControls from './GameControls';

const GameShow = ({ name, host, game, socket, players, readyPlayers, gameActive, question, feedback, gameEnd }) => {
  const [timer, setTimer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [scores, setScores] = useState(null)
  const [allFeedback, setAllFeedback] = useState([])

  useEffect(() => {
    if (feedback) {
      const feedbackMessage = feedback.name === name ? `You are ${feedback.message}!` : `${feedback.name} is ${feedback.message}!`
      setAllFeedback((prev)=>[...prev, feedbackMessage])
      setScores(prevScores => {
        if (!prevScores) return null
        const {name, message} = feedback
       return {
        ...prevScores,
        [name]:
          message === 'correct' ? prevScores[name] + 1 : prevScores[name]
       }
      })
    }
  }, [feedback])

  useEffect(() => {
    if (question && question.seconds) {
      setAllFeedback([])
      setTimer(question.seconds);
      setHasAnswered(false);
      const timerInterval = setInterval(() => {
        setTimer(previousTime => {
          if (previousTime <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return previousTime - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [question]);

  useEffect(()=>{
    if (players && players.length > 0) {
      const initScores = {};
      players.forEach(player => {
        initScores[player] = 0;
      });
      setScores(initScores);
    }
  }, [players]);

  return (
    <div className="game-show">
      <Players players={players} readyPlayers={readyPlayers} scores={scores} name={name}/>
      <div className="question-display">
        {question ? (
          <div>
            <Question 
              socket={socket} 
              game={game} 
              question={question} 
              hasAnswered={hasAnswered}  
              setHasAnswered={setHasAnswered}/>

            <Feedback timer={timer} allFeedback={allFeedback} host={host}/>
          </div>
        ) : !gameActive && (
          <div>
            <h2>Host: {host}</h2>
            <h2>Waiting for the game to start...</h2>
          </div>
        )}
      </div>
      <GameControls 
        socket={socket}
        game={game}
        name={name}
        host={host}
        readyPlayers={readyPlayers}
        players={players}
        gameActive={gameActive}
        gameEnd={gameEnd}
        scores={scores}
      />
    </div>
  );
};

export default GameShow;