import { useEffect, useState } from "react";

export default function useCurrentTime() {
    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const handler = () => setCurrentTime(new Date());
        const timerId = setInterval(handler, 200);
        return () => clearInterval(timerId);
    });

    return currentTime;
}
