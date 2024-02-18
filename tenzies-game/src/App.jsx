import { useState, useEffect } from 'react'
import './style.css'
import Die from './Die'
import 'nanoid'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
// import {useWindowSize} from '@uidotdev/usehooksdotdev/usehooks'

function App() {
  const [diceArr, setDiceArr] = useState(allNewDice)
  const [tenzies, setTenzies] = useState(false)
  // const { width, height } = useWindowSize()
  const width  = window.innerWidth
  const height = window.innerHeight

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
    const numberArr = []
    
    for (let i = 0; i < 10; i++){
      numberArr.push(newDie())
    }
    console.log("New dice")
    return numberArr
  }

  function rollDice(){
    setDiceArr(prev => prev.map(die => (
      die.isHeld ? die : newDie()
    )))
  }

  function holdDice(id){
    setDiceArr(prev => prev.map(die => (
      die.id === id ? {...die, isHeld: !die.isHeld} : die
    )))
  }

  // function renderDice(){
  //   return tenzies ? allNewDice() : rollDice()
  // }

useEffect(() => {

  const allHeld = diceArr.every(element => element.isHeld);
  const firstValue = diceArr[0].value;
  const allSame = diceArr.every(element => element.value === firstValue);

  if(allHeld && allSame){
    setTenzies(true)
  }
  else{
    setTenzies(false)
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
          <div className="die-container">
            {
              diceArr.map(die => 
                <Die value={die.value} isHeld={die.isHeld} key={die.id} holdDice={() => holdDice(die.id)}/>
              )
            }
          </div>
          <button 
            className='roll-btn' 
            onClick={() => tenzies ? allNewDice() : rollDice()}
          >
              {tenzies ? "New Game" : "Roll" }
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
