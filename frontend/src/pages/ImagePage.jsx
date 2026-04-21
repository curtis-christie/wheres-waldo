/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import waldoImg1 from "../assets/waldo1.jpg";
// import waldoImg2 from "../assets/waldo2.jpg";
// import waldoImg3 from "../assets/waldo3.jpg";
import { fetchImage, createSession, submitGuess } from "../services/api.js";

const localImageMap = {
  waldo1: waldoImg1,
  // waldo2: waldoImg2,
  // waldo3: waldoImg3,
};

export default function ImagePage() {
  const { imageId } = useParams();
  const [imageData, setImageData] = useState(null);
  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [marker, setMarker] = useState(null);

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

    try {
      const data = await submitGuess({
        sessionId: session.id,
        x,
        y,
      });

      if (data.correct) {
        setFeedback(`You found Waldo in ${data.finalTimeMs} ms!`);
        setMarker(data.marker);
      } else {
        setFeedback(data.message);
      }
    } catch (error) {
      console.error(error);
      setFeedback("Something went wrong while checking your guess.");
    }
  }

  if (!imageData || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <Navbar />
      <h1 className="text-center">{imageData.title}</h1>

      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src={localImageMap[imageData.slug]}
          alt={imageData.title}
          onClick={handleImageClick}
          style={{ width: "800px", cursor: "crosshair", display: "block" }}
        />

        {marker && (
          <div
            style={{
              position: "absolute",
              left: `${marker.x * 100}%`,
              top: `${marker.y * 100}%`,
              transform: "translate(-50%, -50%)",
              width: "24px",
              height: "24px",
              border: "3px solid red",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <div>
        <h2>Characters to find</h2>
        <p>Find Waldo in the image.</p>
      </div>
    </div>
  );
}
