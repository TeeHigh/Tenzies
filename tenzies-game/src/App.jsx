import { useState, useEffect } from 'react'
import './style.css'
import Die from './Die'
import CountUpTimer from './components/Timer'
import Confetti from 'react-confetti'
import { nanoid } from 'nanoid'
import { useWindowSize } from 'react-use'
import { FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

function App() {
  const [diceArr, setDiceArr] = useState(allNewDice)
  const [tenzies, setTenzies] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("bestTime")) || 0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false);
  const { width, height } = useWindowSize()
  const [rollCount, setRollCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHeld, setHeld] = useState(false)

  const allHeld = diceArr.every(element => element.isHeld);
  const firstValue = diceArr[0].value;
  const allSame = diceArr.every(element => element.value === firstValue);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const bestHour = Math.floor(bestTime / 3600);
  const bestMinute = Math.floor((bestTime % 3600) / 60);
  const bestSecond = bestTime % 60

  function newDie() {
    const randomNumber = Math.floor((Math.random() * 6) + 1)

    const newDie = {
      value: randomNumber,
      isHeld: false,
      id: nanoid()
    }

    return newDie
  }

  function allNewDice() {
    const numberArr = []

    for (let i = 0; i < 10; i++) {
      numberArr.push(newDie())
    }
    return numberArr
  }

  function resetGame() {
    setTenzies(false)
    setDiceArr(allNewDice)
    resetTimer()
    setRollCount(0)
    setIsPaused(false)
    setHeld(false)
  }

  function rollDice() {
    if (!isPaused) {
      if (!tenzies) {
        setDiceArr(prev => prev.map(die => (
          die.isHeld ? die : newDie()
        )))
        setRollCount(prevRollCount => prevRollCount + 1)
      }
      else {
        resetGame()
      }
    }
  }

  function holdDice(id) {
    if (!tenzies && !isPaused) {
      setDiceArr(prev => prev.map(die => (
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )))
      setIsRunning(true)
      setHeld(true)
    }
  }

  function toggleTimer() {
    if(rollCount || isHeld){
      setIsRunning(prevRunning => !prevRunning);
      setIsPaused(prevPaused => !prevPaused)
    }
  };

  function stopTimer(){
    setIsRunning(false)
  }

  function resetTimer() {
    setIsRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    if(allHeld && allSame){
      localStorage.setItem("bestTime", JSON.stringify(bestTime))
    }
  }, [bestTime])

  useEffect(() => {
    if (allHeld && allSame) {
      setTenzies(true)
      setCurrentTime(seconds)

      if(bestTime == 0){
        setBestTime(currentTime)
      }
      else if (currentTime && currentTime < bestTime) {
        setBestTime(currentTime)
      }

      stopTimer()
    }
    else {
      setTenzies(false)
    }

  }, [diceArr, isRunning])

  return (
    <main>
      {
        tenzies &&
        <Confetti
          width={width}
          height={height}
        />
      }

      <div className="inner-box">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="stats">
          {/* Count number of times user has rolled the dice */}
          <p className="roll-count" title='roll count'>
            No. of Rolls: {rollCount}
          </p>

          {/* Display user's best time */}
          <p className="highscore-count" title='best time'>
            🏆 : {`${bestHour.toString().padStart(2, "0")}:${bestMinute.toString().padStart(2, "0")}:${bestSecond.toString().padStart(2, "0")}`}
          </p>

          {/* Timer */}
          <CountUpTimer
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            seconds={seconds}
            setSeconds={setSeconds}
            hours={hours}
            minutes={minutes}
            remainingSeconds={remainingSeconds}
          />
        </div>
        
        <div className="die-container">
          {
            diceArr.map(die =>
              <Die
                value={die.value}
                isHeld={die.isHeld}
                isPaused={isPaused}
                key={die.id}
                holdDice={() => holdDice(die.id)}
              />
            )
          }
        </div>
        <button
          title='roll dice'
          className='roll-btn'
          onClick={() => rollDice()}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className="controls">
          <button
            title='pause/play'
            className='toggle-timer'
            onClick={() => toggleTimer()}
          >
            {!isRunning ? 
              <FaRegPlayCircle
                className='play-btn bottom-btn'
              /> 
              : 
              <FaRegPauseCircle
                className='pause-btn bottom-btn'
              /> 
            }
          </button>
          <button
            title='restart'
            className='restart'
            onClick={
              () => resetGame()
            }
          >
            <VscDebugRestart
              className='restart-btn bottom-btn'
            />
          </button>
        </div>
      </div>
    </main >
  )
}

export default App
