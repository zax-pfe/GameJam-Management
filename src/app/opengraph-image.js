import { ImageResponse } from "next/og";

// Link preview shown when the URL is shared (Discord, Slack, WhatsApp, X…).
// Generated once at build time.
export const alt = "Game Project Manager: tickets, planning and shared resources for the game team";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STATUS = [
  { label: "TO DO", color: "#8fa8c4" },
  { label: "IN PROGRESS", color: "#4db8ff" },
  { label: "DONE", color: "#3fd08a" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b1e33",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#f5f8fc",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              padding: "12px 20px",
              border: "3px solid #e85d35",
              borderRadius: 12,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            GPM
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a9bdd3", letterSpacing: 4 }}>
            GAME PROJECT MANAGER
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Ship the game, together.
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#a9bdd3" }}>
            Tickets · Kanban · Calendar · Project Hub
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {STATUS.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 18px",
                border: "2px solid rgba(255,255,255,0.16)",
                borderRadius: 8,
                fontSize: 22,
                letterSpacing: 2,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 7, background: s.color }} />
              {s.label}
            </div>
          ))}
          <div style={{ display: "flex", flex: 1 }} />
          <div style={{ display: "flex", width: 160, height: 8, alignSelf: "center", background: "#e85d35", borderRadius: 4 }} />
        </div>
      </div>
    ),
    size,
  );
}
