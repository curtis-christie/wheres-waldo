import { useParams } from "react-router";
import waldoImg1 from "../assets/waldo1.jpg";
import waldoImg2 from "../assets/waldo2.jpg";
import waldoImg3 from "../assets/waldo3.jpg";
import Navbar from "../components/Navbar.jsx";

const imageMap = {
  waldo1: {
    title: "Find Waldo 1",
    src: waldoImg1,
  },
  waldo2: {
    title: "Find Waldo 2",
    src: waldoImg2,
  },
  waldo3: {
    title: "Find Wilma 3",
    src: waldoImg3,
  },
};

export default function ImagePage() {
  const { imageId } = useParams();
  const imageData = imageMap[imageId];

  if (!imageData) {
    return <h2>Image not found</h2>;
  }

  async function handleImageClick(e) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const response = await fetch("http://localhost:3000/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId, x, y }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <Navbar />
      <h1 className="text-center">{imageData.title}</h1>
      <img
        src={imageData.src}
        alt={imageData.title}
        onClick={handleImageClick}
        style={{ width: "800px", cursor: "crosshair" }}
      />
    </div>
  );
}
