import { useEffect } from "react";

function CountUpTimer({isRunning, setSeconds, hours, minutes, remainingSeconds}) {
    
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

    return (
        <div>
            <p>⏱: {`${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`}</p>
            
        </div>
    );
}

export default CountUpTimer;
