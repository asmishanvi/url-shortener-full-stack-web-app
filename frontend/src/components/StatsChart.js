import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const StatsChart = ({ data }) => {
  return (
    <section className="card">
      <div className="section-header">
        <h3>Clicks per day</h3>
        <p className="muted">Daily engagement for this short link.</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted)" />
            <YAxis allowDecimals={false} stroke="var(--muted)" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="var(--accent)"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default StatsChart;
