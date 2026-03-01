import React, { useState } from "react";
import api from "../api";

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleShorten = async () => {
    if (!originalUrl.trim()) {
      setMessage("Please enter a URL to shorten.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setShortUrl("");

    try {
      const response = await api.post("/api/shorten", {
        originalUrl: originalUrl.trim()
      });
      setShortUrl(response.data.shortUrl);
      setMessage("Short link ready.");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) {
      return;
    }
    await navigator.clipboard.writeText(shortUrl);
    setMessage("Copied to clipboard.");
  };

  return (
    <section className="card">
      <h2>Shorten a link</h2>
      <p className="muted">
        Paste a long URL and get a clean, shareable short link in seconds.
      </p>

      <div className="form-row">
        <input
          type="url"
          placeholder="https://example.com/some/long/path"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
        />
        <button onClick={handleShorten} disabled={isLoading}>
          {isLoading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {shortUrl && (
        <div className="result">
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
          <button className="ghost" onClick={handleCopy}>
            Copy
          </button>
        </div>
      )}
    </section>
  );
};

export default Home;
