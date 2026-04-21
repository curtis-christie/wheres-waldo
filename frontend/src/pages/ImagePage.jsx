import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import waldoImg1 from "../assets/waldo1.jpg";
// import waldoImg2 from "../assets/waldo2.jpg";
// import waldoImg3 from "../assets/waldo3.jpg";
import {
  fetchImage,
  createSession,
  submitGuess,
  completeSession,
  fetchLeaderboard,
} from "../services/api.js";

const localImageMap = {
  waldo1: waldoImg1,
};

export default function ImagePage() {
  const { imageId } = useParams();
  const [imageData, setImageData] = useState(null);
  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [marker, setMarker] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [savingScore, setSavingScore] = useState(false);

  useEffect(() => {
    async function loadGame() {
      try {
        const image = await fetchImage(imageId);
        setImageData(image);

        const newSession = await createSession(image.id);
        setSession(newSession);
      } catch (err) {
        console.error(err);
        setError("Failed to load the game.");
      }
    }

    loadGame();
  }, [imageId]);

  async function handleImageClick(event) {
    if (!session || gameComplete) return;

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
        setFeedback(`You found Waldo in ${(data.finalTimeMs / 1000).toFixed(2)} seconds.`);
        setMarker(data.marker);
        setGameComplete(true);
      } else {
        setFeedback(data.message);
      }
    } catch (error) {
      console.error(error);
      setFeedback("Something went wrong while checking your guess.");
    }
  }

  async function handleNameSubmit(event) {
    event.preventDefault();

    if (!session || !gameComplete) return;
    if (!playerName.trim()) {
      setFeedback("Please enter your name.");
      return;
    }

    try {
      setSavingScore(true);

      await completeSession(session.id, playerName.trim());

      const leaderboardData = await fetchLeaderboard(imageData.slug);
      setLeaderboard(leaderboardData);
      setNameSubmitted(true);
      setFeedback("Score saved successfully.");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to save your score.");
    } finally {
      setSavingScore(false);
    }
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!imageData || !session) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <div className="mx-auto flex max-w-3xl items-center justify-center px-6 py-20">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-700 shadow-sm">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  const imageSrc = localImageMap[imageData.slug];

  if (!imageSrc) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700 shadow-sm">
            Image asset not found for slug: {imageData.slug}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Find Waldo
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{imageData.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Search the image carefully and click directly on Waldo as quickly as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative w-full">
                <img
                  src={imageSrc}
                  alt={imageData.title}
                  onClick={gameComplete ? undefined : handleImageClick}
                  className={`block h-auto w-full select-none ${
                    gameComplete ? "cursor-default" : "cursor-crosshair"
                  }`}
                />

                {marker && (
                  <div
                    className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-red-500 shadow-[0_0_0_6px_rgba(255,255,255,0.85)]"
                    style={{
                      left: `${marker.x * 100}%`,
                      top: `${marker.y * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Goal</h2>
              <p className="text-sm leading-7 text-slate-600">
                Click on Waldo in the image. Once you find him, save your score to the leaderboard.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Status</h2>

              {!feedback && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Round in progress. Start searching.
                </div>
              )}

              {feedback && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    gameComplete
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {feedback}
                </div>
              )}
            </div>

            {gameComplete && !nameSubmitted && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold text-slate-900">Save Your Score</h2>

                <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
                  <label htmlFor="playerName" className="text-sm font-medium text-slate-700">
                    Enter your name
                  </label>

                  <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    placeholder="Your name"
                    maxLength={30}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />

                  <button
                    type="submit"
                    disabled={savingScore}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {savingScore ? "Saving..." : "Save Score"}
                  </button>
                </form>
              </div>
            )}

            {nameSubmitted && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">Leaderboard</h2>

                {leaderboard.length === 0 ? (
                  <p className="text-sm text-slate-600">No scores yet.</p>
                ) : (
                  <ol className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <li
                        key={`${entry.playerName}-${entry.finalTimeMs}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            {index + 1}
                          </span>
                          <span className="font-medium text-slate-800">{entry.playerName}</span>
                        </div>

                        <span className="text-sm font-semibold text-slate-600">
                          {(entry.finalTimeMs / 1000).toFixed(2)}s
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Tip</h2>
              <p className="text-sm leading-7 text-slate-600">
                Search in small sections from left to right instead of scanning the whole image at
                once.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
