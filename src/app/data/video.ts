export type Video = {
    videoURL: string;
    imageURL: string;
    description: string;
    title: string;
}

const videos: Video[] = [
    {
        videoURL: "video/NossosDias.mp4",
        imageURL: "image/nossosdias.jpg", // Adicionando a extensão do arquivo
        description: "Baku no Kokoro no Jabai Yatsu 2ª Temporada OP/Opening Song Phool",
        title: "Alok & Zeeba - Nossos Dias"
    },
    {
        videoURL: "video/eusemvocê.mp4",
        imageURL: "image/eusemvocê.jpg", // Certifique-se que a imagem existe
        description: "Wesley Safadão e Gusttavo Lima - Eu Sem Você - Arrocha Safadão",
        title: "Eu Sem Você - Arrocha Safadão"
    },
];

// Exportando o array de videos
export default videos;
