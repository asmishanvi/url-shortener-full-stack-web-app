import React, { useState } from "react";
import api from "../api";

const Stats = () => {
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const extractCode = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    if (trimmed.includes("/")) {
      return trimmed.split("/").pop();
    }
    return trimmed;
  };

  const handleGetStats = async () => {
    const code = extractCode(shortCode);
    if (!code) {
      setMessage("Enter a short code to fetch stats.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setStats(null);

    try {
      const response = await api.get(`/api/stats/${code}`);
      setStats(response.data);
    } catch (error) {
      setMessage("Could not find stats for that code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Link stats</h2>
      <p className="muted">
        Enter a short code to see clicks and creation time.
      </p>

      <div className="form-row">
        <input
          type="text"
          placeholder="abc123 or http://localhost:8080/abc123"
          value={shortCode}
          onChange={(event) => setShortCode(event.target.value)}
        />
        <button onClick={handleGetStats} disabled={isLoading}>
          {isLoading ? "Loading..." : "Get Stats"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {stats && (
        <div className="stats-grid">
          <div>
            <span className="label">Original URL</span>
            <a href={stats.originalUrl} target="_blank" rel="noreferrer">
              {stats.originalUrl}
            </a>
          </div>
          <div>
            <span className="label">Short Code</span>
            <p>{stats.shortCode}</p>
          </div>
          <div>
            <span className="label">Created At</span>
            <p>{new Date(stats.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="label">Total Clicks</span>
            <p>{stats.clickCount}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Stats;
