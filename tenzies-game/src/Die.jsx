import React from 'react'
import './style.css' 

function Die({value, isHeld,isPaused, holdDice}){

    return (
        <div>
            <div 
                title='die'
                className={isHeld ? "die is-held": "die" } 
                onClick={holdDice}
                
            >
                {value}
            </div>
        </div>
    )
}

export default Die