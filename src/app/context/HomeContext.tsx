import { createContext, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, filters } from "../data/Filter";

// Tipo do contexto
type HomeContextData = {
    videoURL: string;
    videoDetails: { title: string; description: string };
    playing: boolean;
    totalTime: number;
    currentTime: number;
    volume: number;
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    playPause: () => void;
    configCurrentTime: (time: number) => void;
    configVideo: (index: number) => void;
    configFilter: (index: number) => void;
    setVolume: (volume: number) => void; // Propriedade para mudar o volume
    changeVolume: (volume: number) => void; // Adicionando changeVolume
}

export const HomeContext = createContext({} as HomeContextData);

type ProviderProps = {
    children: ReactNode;    
}

const HomeContextProvider = ({ children }: ProviderProps) => {
    const [videoURL, setVideoURL] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1); // Estado para volume (1 = 100%)
    const [videoDetails, setVideoDetails] = useState({ title: "", description: "" }); // Detalhes do vídeo atual
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        configVideo(videoIndex); // Carregar o primeiro vídeo
    }, []);

    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;
        const currentVideo: Video = videos[currentIndex];
        setVideoURL(currentVideo.videoURL);
        setVideoIndex(currentIndex);
        setVideoDetails({ title: currentVideo.title, description: currentVideo.description });
    }
    
    const configFilter = (index: number) => {
        setFilterIndex(index);
    }

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.volume = volume;

            video.onloadedmetadata = () => {
                setTotalTime(video.duration);
                setCurrentTime(video.currentTime);
                if (playing) {
                    video.play();
                }
            }

            video.ontimeupdate = () => {
                setCurrentTime(video.currentTime);
            }

            video.onended = () => {
                configVideo(videoIndex + 1);
            }
        }
        draw();
    }, [videoURL, filterIndex]);

    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
        setCurrentTime(time);
    }

    const playPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
            video.pause();
        } else {
            video.play();
            draw();
        }
        setPlaying(!playing);
    }

    const handleVolumeChange = (volume: number) => {
        const video = videoRef.current;
        if (video) video.volume = volume;
        setVolume(volume);
    };

    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter: Filter = filters[filterIndex];
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i + 0];
            const green = data[i + 1];
            const blue = data[i + 2];
            filter.calc(red, green, blue);
            data[i + 0] = filter.red;
            data[i + 1] = filter.green;
            data[i + 2] = filter.blue;
        }
        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(draw);
    }

    return (
        <HomeContext.Provider value={{
            videoURL,
            videoDetails,
            playing,
            totalTime,
            currentTime,
            volume,
            videoRef,
            canvasRef,
            playPause,
            configCurrentTime,
            configVideo,
            configFilter,
            setVolume: handleVolumeChange, // Manter a função aqui
            changeVolume: handleVolumeChange // Adicionando changeVolume
        }}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeContextProvider;
