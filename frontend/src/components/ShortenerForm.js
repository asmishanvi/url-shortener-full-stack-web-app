import React from "react";

const ShortenerForm = ({
  originalUrl,
  onOriginalUrlChange,
  customAlias,
  onCustomAliasChange,
  expirationOption,
  onExpirationOptionChange,
  customExpiration,
  onCustomExpirationChange,
  onSubmit,
  isLoading
}) => {
  return (
    <section className="card">
      <h3>Create a short link</h3>
      <p className="muted">Shorten a URL, add an optional alias, and set an expiration policy.</p>

      <div className="form-grid">
        <div className="form-group span-2">
          <label htmlFor="originalUrl">Original URL</label>
          <input
            id="originalUrl"
            type="url"
            placeholder="https://example.com/long-path"
            value={originalUrl}
            onChange={(event) => onOriginalUrlChange(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customAlias">Custom alias (optional)</label>
          <input
            id="customAlias"
            type="text"
            placeholder="myalias"
            value={customAlias}
            onChange={(event) => onCustomAliasChange(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiration">Expiration</label>
          <select
            id="expiration"
            value={expirationOption}
            onChange={(event) => onExpirationOptionChange(event.target.value)}
          >
            <option value="never">Never</option>
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="custom">Custom date</option>
          </select>
        </div>

        {expirationOption === "custom" && (
          <div className="form-group span-2">
            <label htmlFor="customExpiration">Select date & time</label>
            <input
              id="customExpiration"
              type="datetime-local"
              value={customExpiration}
              onChange={(event) => onCustomExpirationChange(event.target.value)}
            />
          </div>
        )}
      </div>

      <button className="primary" onClick={onSubmit} disabled={isLoading}>
        {isLoading ? (
          <span className="button-loading">
            <span className="spinner" aria-label="Loading" />
            Shortening...
          </span>
        ) : (
          "Shorten link"
        )}
      </button>
    </section>
  );
};

export default ShortenerForm;
