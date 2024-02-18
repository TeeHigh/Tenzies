import { useEffect } from "react";

function CountUpTimer({isRunning, seconds, setSeconds}) {
    
    useEffect(() => {
        let intervalId;

        if (isRunning) {
            intervalId = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div>
            <p>Timer: {`${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`}</p>
            {/* <button onClick={startTimer}>Start</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={stopTimer}>Reset</button> */}
        </div>
    );
}

export default CountUpTimer;
