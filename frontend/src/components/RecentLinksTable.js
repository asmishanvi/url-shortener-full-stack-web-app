import React from "react";
import { API_BASE_URL } from "../api";

const RecentLinksTable = ({ links, onCopy }) => {
  return (
    <section className="card">
      <div className="section-header">
        <h3>Recent links</h3>
        <p className="muted">Latest 10 links generated in this workspace.</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">
                  No links yet. Create your first short URL above.
                </td>
              </tr>
            )}
            {links.map((link) => {
              const shortUrl = `${API_BASE_URL}/${link.shortCode}`;
              return (
                <tr key={link.shortCode}>
                  <td>
                    <a href={shortUrl} target="_blank" rel="noreferrer">
                      {shortUrl}
                    </a>
                  </td>
                  <td className="truncate">
                    <a href={link.originalUrl} target="_blank" rel="noreferrer">
                      {link.originalUrl}
                    </a>
                  </td>
                  <td>{link.clickCount}</td>
                  <td>{new Date(link.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="table-actions">
                      <button className="ghost" onClick={() => onCopy(shortUrl)}>
                        Copy
                      </button>
                      <a className="ghost" href={shortUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentLinksTable;
