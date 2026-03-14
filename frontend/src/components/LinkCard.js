import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const LinkCard = ({ shortUrl, onCopy }) => {
  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (!canvas) {
      return;
    }
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    downloadLink.click();
  };

  return (
    <section className="card result-card">
      <div className="result-info">
        <h3>Short link ready</h3>
        <a href={shortUrl} target="_blank" rel="noreferrer">
          {shortUrl}
        </a>
        <div className="result-actions">
          <button className="ghost" onClick={onCopy}>
            Copy
          </button>
          <a className="ghost" href={shortUrl} target="_blank" rel="noreferrer">
            Open
          </a>
        </div>
      </div>

      <div className="qr-box">
        <QRCodeCanvas id="qr-code-canvas" value={shortUrl} size={140} />
        <button className="ghost" onClick={handleDownload}>
          Download QR
        </button>
      </div>
    </section>
  );
};

export default LinkCard;
