import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import Hero from "../components/Hero";
import LinkCard from "../components/LinkCard";
import RecentLinksTable from "../components/RecentLinksTable";
import ShortenerForm from "../components/ShortenerForm";

const toLocalDateTimeInput = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationOption, setExpirationOption] = useState("never");
  const [customExpiration, setCustomExpiration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);

  const fetchRecentLinks = async () => {
    try {
      const response = await api.get("/api/links");
      setRecentLinks(response.data);
    } catch (error) {
      toast.error("Could not load recent links.");
    }
  };

  useEffect(() => {
    fetchRecentLinks();
  }, []);

  const getExpiresAtPayload = () => {
    if (expirationOption === "never") {
      return null;
    }
    if (expirationOption === "custom") {
      return customExpiration || null;
    }
    const now = new Date();
    const offset = expirationOption === "24h" ? 24 : 24 * 7;
    const future = new Date(now.getTime() + offset * 60 * 60 * 1000);
    return toLocalDateTimeInput(future);
  };

  const handleShorten = async () => {
    if (!originalUrl.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    if (expirationOption === "custom" && !customExpiration) {
      toast.error("Pick a custom expiration date.");
      return;
    }

    setIsLoading(true);
    setShortUrl("");

    try {
      const payload = {
        originalUrl: originalUrl.trim()
      };
      if (customAlias.trim()) {
        payload.customAlias = customAlias.trim();
      }
      const expiresAt = getExpiresAtPayload();
      if (expiresAt) {
        payload.expiresAt = expiresAt;
      }

      const response = await api.post("/api/shorten", payload);
      setShortUrl(response.data.shortUrl);
      toast.success("Short link created.");
      fetchRecentLinks();
    } catch (error) {
      const message = error.response?.data?.message || "Could not create link.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Link copied.");
    } catch (error) {
      toast.error("Unable to copy link.");
    }
  };

  return (
    <div className="stack">
      <Hero />
      <ShortenerForm
        originalUrl={originalUrl}
        onOriginalUrlChange={setOriginalUrl}
        customAlias={customAlias}
        onCustomAliasChange={setCustomAlias}
        expirationOption={expirationOption}
        onExpirationOptionChange={setExpirationOption}
        customExpiration={customExpiration}
        onCustomExpirationChange={setCustomExpiration}
        onSubmit={handleShorten}
        isLoading={isLoading}
      />

      {shortUrl && <LinkCard shortUrl={shortUrl} onCopy={() => handleCopy(shortUrl)} />}

      <RecentLinksTable links={recentLinks} onCopy={handleCopy} />
    </div>
  );
};

export default Home;
