import React from "react";

const StatsCard = ({ label, value }) => {
  return (
    <div className="stats-card">
      <p className="label">{label}</p>
      <div className="value">{value}</div>
    </div>
  );
};

export default StatsCard;
