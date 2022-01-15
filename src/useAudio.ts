import {useEffect, useState} from "react";


const useAudio = (url: string) => {
    const [audio] = useState<HTMLAudioElement>(new Audio(url));
    const [playing, setPlaying] = useState<boolean>(false);

    const toggleSound = (): void => {
        setPlaying(prevState => !prevState);
    };

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.addEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggleSound];
};

export default useAudio;