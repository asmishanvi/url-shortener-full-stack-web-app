import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import StatsCard from "../components/StatsCard";
import StatsChart from "../components/StatsChart";

const Stats = () => {
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Enter a short code.");
      return;
    }

    setIsLoading(true);
    setStats(null);

    try {
      const response = await api.get(`/api/stats/${code}`);
      setStats(response.data);
    } catch (error) {
      const message = error.response?.data?.message || "Could not load stats.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = stats?.dailyClicks?.length
    ? stats.dailyClicks
    : [];

  return (
    <div className="stack">
      <section className="card">
        <h3>Link performance</h3>
        <p className="muted">Fetch detailed analytics for a short code.</p>

        <div className="form-row">
          <input
            type="text"
            placeholder="abc123 or http://localhost:8080/abc123"
            value={shortCode}
            onChange={(event) => setShortCode(event.target.value)}
          />
          <button className="primary" onClick={handleGetStats} disabled={isLoading}>
            {isLoading ? "Loading..." : "Get Stats"}
          </button>
        </div>
      </section>

      {stats && (
        <section className="stats-grid">
          <StatsCard
            label="Original URL"
            value={
              <a href={stats.originalUrl} target="_blank" rel="noreferrer">
                {stats.originalUrl}
              </a>
            }
          />
          <StatsCard label="Short Code" value={stats.shortCode} />
          <StatsCard
            label="Created At"
            value={new Date(stats.createdAt).toLocaleString()}
          />
          <StatsCard label="Total Clicks" value={stats.clickCount} />
        </section>
      )}

      {stats && <StatsChart data={chartData} />}
    </div>
  );
};

export default Stats;
