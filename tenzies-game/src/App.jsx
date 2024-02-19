import { useState, useEffect } from 'react'
import './style.css'
import Die from './Die'
import CountUpTimer from './components/Counter'
import 'nanoid'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

function App() {
  const [diceArr, setDiceArr] = useState(allNewDice)
  const [tenzies, setTenzies] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const [bestTime, setBestTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false);
  const { width, height } = useWindowSize()
  const [rollCount, setRollCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

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
    console.log("New dice")
    return numberArr
  }

  function resetGame() {
    setTenzies(false)
    setDiceArr(allNewDice)
    resetTimer()
    setRollCount(0)
    setIsPaused(false)
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
    }
  }

  function startTimer() {
    setIsRunning(true);
  };

  function pauseTimer() {
    setIsRunning(false);
  };

  function resetTimer() {
    setIsRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    setBestTime(
      currentTime ? currentTime : bestTime
    )
    if (currentTime && currentTime < bestTime) {
      setBestTime(currentTime)
    }

  }, [isRunning])

  useEffect(() => {
    if (allHeld && allSame) {
      setTenzies(true)
      pauseTimer()
      setCurrentTime(seconds)
    }
    else {
      setTenzies(false)
      setTimeout(startTimer(), 2000)
    }

    console.log(tenzies)

  }, [diceArr])

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
          <p className="roll-count">
            No. of Rolls: {rollCount}
          </p>

          {/* Display user's best time */}
          <p className="highscore-count">
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
          className='roll-btn'
          onClick={() => rollDice()}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className="controls">
          <button
            className='pause'
            onClick={() => setIsPaused(prevPaused => !prevPaused)}
          >
            {isPaused ? "resume" : "pause"}
          </button>
          <button
            className='restart'
            onClick={
              () => resetGame()
            }
          >
            restart
          </button>
        </div>
      </div>
    </main >
  )
}

export default App
