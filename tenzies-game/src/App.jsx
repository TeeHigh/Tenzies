import { useState, useEffect } from 'react'
import './style.css'
import Die from './Die'
import CountUpTimer from './components/Counter'
import 'nanoid'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import {useWindowSize} from 'react-use'

function App() {
  const [diceArr, setDiceArr] = useState(allNewDice)
  const [tenzies, setTenzies] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { width, height } = useWindowSize()
  const [rollCount, setRollCount] = useState(0)

  function newDie(){
    const randomNumber = Math.floor((Math.random() * 6) + 1)

    const newDie = {
      value: randomNumber,
      isHeld: false,
      id: nanoid()
    }
    
    return newDie
  }

  function allNewDice(){
    resetTimer()

    const numberArr = []
    
    for (let i = 0; i < 10; i++){
      numberArr.push(newDie())
    }
    console.log("New dice")
    return numberArr
  }

  function rollDice(){
    if(!tenzies){
      setDiceArr(prev => prev.map(die => (
        die.isHeld ? die : newDie()
      )))
      setRollCount(prevRollCount => prevRollCount + 1)
    }
    else{
      setTenzies(false)
      setDiceArr(allNewDice)
      setRollCount(0)
    }
  }

  function holdDice(id){
    setDiceArr(prev => prev.map(die => (
      die.id === id ? {...die, isHeld: !die.isHeld} : die
    )))
  }

  function startTimer(){
      setIsRunning(true);
  };

  function pauseTimer(){
      setIsRunning(false);
  };

  function resetTimer(){
      setIsRunning(false);
      setSeconds(0);
  };

  useEffect(() => {
    const allHeld = diceArr.every(element => element.isHeld);
    const firstValue = diceArr[0].value;
    const allSame = diceArr.every(element => element.value === firstValue);

    if(allHeld && allSame){
      setTenzies(true)
      pauseTimer()
    }
    else{
      setTenzies(false)
      startTimer()
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
      <div className="outer-box">
        <div className="inner-box">
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className="stats">
            <p className="roll-count">
              No. of Rolls: {rollCount}
            </p>
            <p className="highscore-count">
              Highscore: {}
            </p>
            <CountUpTimer 
              isRunning={isRunning} 
              setIsRunning={setIsRunning}
              seconds={seconds}
              setSeconds={setSeconds}
            />
          </div>
          <div className="die-container">
            {
              diceArr.map(die => 
                <Die value={die.value} isHeld={die.isHeld} key={die.id} holdDice={() => holdDice(die.id)}/>
              )
            }
          </div>
          <button 
            className='roll-btn' 
            onClick={() => rollDice()}
          >
              {tenzies ? "New Game" : "Roll" }
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
