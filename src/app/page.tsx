'use client';

import { ReactNode, RefObject, createContext, useContext, useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaVolumeUp, FaVolumeDown } from "react-icons/fa";
import videos, { Video } from './data/video';
import { convertTimeToString } from "./utils/Utils";
import { HomeContext } from "./context/HomeContext"; 

export default function Home() {
    const [showFilter, setShowFilter] = useState(true);
    const {
        videoURL,
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
        videoDetails,
        setVolume 
    } = useContext(HomeContext);

    useEffect(() => {
        if (videoRef && videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume, videoRef]);

    return (
        <main className="mx-auto w-[90%] mt-4 flex flex-col md:flex-row">
            <div className="w-full md:w-[65%] mr-0 md:mr-2 mb-4 md:mb-0">
                <video
                    className="w-full rounded-lg shadow-md border-2 border-gray-700"
                    ref={videoRef}
                    src={videoURL}
                    hidden={showFilter}
                    controls={false}
                ></video>
                <canvas className="w-full h-[380px] rounded-lg shadow-md" ref={canvasRef} hidden={!showFilter}></canvas>

                <div className="bg-gray-800 flex items-center p-4 rounded-lg shadow-md mt-2">
                    {/* Barra de Progresso */}
                    <input
                        className="appearance-none w-full h-2 bg-gray-600 rounded-lg mx-2 cursor-pointer"
                        type="range"
                        min={0}
                        max={totalTime}
                        value={currentTime}
                        onChange={(e) => configCurrentTime(Number(e.target.value))}
                    />

                    {/* Botão Play/Pause */}
                    <button className="text-white ml-2 hover:text-green-400 transition-colors" onClick={playPause}>
                        {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
                    </button>

                    {/* Controle de Volume */}
                    <div className="flex items-center ml-2">
                        <FaVolumeDown className="text-white mr-1" />
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="volume-slider appearance-none w-20 h-2 bg-gray-600 rounded-lg mx-1 cursor-pointer"
                        />
                        <FaVolumeUp className="text-white ml-1" />
                    </div>

                    {/* Seletor de Filtro */}
                    <select
                        onChange={(e) => configFilter(Number(e.target.value))}
                        hidden={!showFilter}
                        className="ml-2 text-white bg-gray-600 rounded-lg border-none"
                    >
                        <option value={0}>Sem filtro</option>
                        <option value={1}>Verde</option>
                        <option value={2}>Azul</option>
                        <option value={3}>Vermelho</option>
                        <option value={4}>Preto e branco</option>
                    </select>

                    {/* Checkbox para Mostrar/Esconder Filtro */}
                    <label className="ml-2 flex items-center">
                        <input
                            type="checkbox"
                            name="Filtro"
                            onChange={() => setShowFilter(!showFilter)}
                            className="mr-1"
                        />
                        <span className="text-white">Mostrar Filtro</span>
                    </label>

                    <span className="text-white ml-2">
                        {convertTimeToString(currentTime)} / {convertTimeToString(totalTime)}
                    </span>
                </div>

                {/* Detalhes do Vídeo */}
                {videoDetails && (
                    <div className="mt-2 p-4 bg-gray-800 text-white rounded-lg shadow-md">
                        <h2 className="text-lg font-bold">{videoDetails.title}</h2>
                        <p>{videoDetails.description}</p>
                    </div>
                )}
            </div>

            {/* Lista de Vídeos */}
            <div className="w-full md:w-[35%] h-[100vh] overflow-y-auto p-2 bg-gray-900 text-white">
                {videos.map((video: Video, index) => (
                    <button
                        key={index}
                        className="w-full mb-2 flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => configVideo(index)}
                    >
                        <img
                            className="w-[100px] h-[80px] mr-2 rounded-lg border-2 border-gray-600"
                            src={video.imageURL}
                            alt={`Thumbnail do vídeo ${video.title}`}
                        />
                        <div>
                            <h3 className="text-sm font-bold">{video.title}</h3>
                            <p className="text-xs">{video.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </main>
    );
}