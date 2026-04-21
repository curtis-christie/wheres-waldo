import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ImagePage from "./pages/ImagePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/image/:imageId" element={<ImagePage />} />
    </Routes>
  );
}

export default App;
