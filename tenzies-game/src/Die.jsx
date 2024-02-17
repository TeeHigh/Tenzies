import React from 'react'
import './style.css' 

function Die({value}){
    return (
        <div>
            <div className="die">{value}</div>
        </div>
    )
}

export default Die