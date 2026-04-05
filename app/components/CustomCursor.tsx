"use client";
import { useState, useEffect } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: pos.x - 8,
          top: pos.y - 8,
          transition: "left 0.08s linear, top 0.08s linear",
        }}
      />
      <div
        className="cursor-ring"
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  );
}
