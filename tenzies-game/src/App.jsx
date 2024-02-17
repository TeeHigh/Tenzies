import { useState } from 'react'
import './style.css'
import Die from './Die'
import 'nanoid'
import { nanoid } from 'nanoid'

function App() {
  const [diceArr, setDiceArr] = useState(allNewDice)

  function allNewDice(){
    const numberArr = []
    
    for (let i = 0; i < 10; i++){
      const randomNumber = Math.floor((Math.random() * 6) + 1)
      numberArr.push({
        value: randomNumber,
        isHeld: false,
        id: nanoid()
      })
    }

    console.log(numberArr)
    return numberArr
  }

  return (
    <main>
      <div className="outer-box">
        <div className="inner-box">
          <div className="die-container">
            {
              diceArr.map(die => 
                <Die value={die.value} isHeld={die.isHeld} key={die.id}/>
              )
            }
          </div>
          <button 
            className='roll-btn' 
            onClick={() => setDiceArr(allNewDice)}
          >
              Roll
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
