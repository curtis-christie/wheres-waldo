import { Link } from "react-router-dom";

const images = [
  { id: "waldo1", name: "Find Waldo 1" },
  // { id: "waldo2", name: "Find Waldo 2" },
  // { id: "waldo3", name: "Find Waldo 3" },
];

export default function HomePage() {
  return (
    <div>
      <h1>Photo Tagging Game</h1>
      <p>Select an image to start: </p>

      <ul>
        {images.map((image) => (
          <li key={image.id}>
            <Link to={`/image/${image.id}`}>{image.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
