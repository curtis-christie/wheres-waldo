import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar.jsx";
import waldoImg1 from "../assets/waldo1.jpg";
import waldoImg2 from "../assets/waldo2.jpg";
import waldoImg3 from "../assets/waldo3.jpg";
import { fetchImage, createSession } from "../services/api.js";

const localImageMap = {
  waldo1: waldoImg1,
  waldo2: waldoImg2,
  waldo3: waldoImg3,
};

export default function ImagePage() {
  const { imageId } = useParams();
  const [imageData, setImageData] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadGame() {
      const image = await fetchImage(imageId);
      setImageData(image);

      const newSession = await createSession(image.id);
      setSession(newSession);
    }

    loadGame().catch(console.error);
  }, [imageId]);

  async function handleImageClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const response = await fetch("http://localhost:3000/api/guesses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: session.id,
        x,
        y,
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  if (!imageData || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <Navbar />
      <h1 className="text-center">{imageData.title}</h1>

      <img
        src={localImageMap[imageData.slug]}
        alt={imageData.title}
        onClick={handleImageClick}
        style={{ width: "800px", cursor: "crosshair" }}
      />

      <div>
        <h2>Characters to find</h2>
        <ul>
          {imageData.characters.map((character) => (
            <li key={character.id}>{character.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
