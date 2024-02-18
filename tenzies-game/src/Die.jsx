import React from 'react'
import './style.css' 

function Die({value, isHeld, holdDice}){

    return (
        <div>
            <div className={isHeld ? "die is-held": "die"} onClick={holdDice}>{value}</div>
        </div>
    )
}

export default Die