import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

// ─── Fonts & Global ─────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --bg: #060810;
    --surface: #0d1117;
    --border: #1e2d42;
    --text: #e8edf5;
    --text2: #8b96aa;
    --text3: #4a5568;
    --font-d: 'Outfit', sans-serif;
    --font-m: 'JetBrains Mono', monospace;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateX(-50%) translateY(16px) scale(.94); }
    to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
  }

  .animate-float { animation: float 3s ease-in-out infinite; }
`;

// ─── Toast ───────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const C = { success: "#22d3a0", error: "#f05252", warn: "#f5a623" };
  const c = C[type] || C.success;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 400,
        zIndex: 9999,
        background: "#0d1117",
        border: `1px solid ${c}40`,
        borderLeft: `3px solid ${c}`,
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "var(--text)",
        boxShadow: "0 20px 60px rgba(0,0,0,.8)",
        animation: "toastIn .3s cubic-bezier(.175,.885,.32,1.275) both",
        fontSize: 13,
        fontFamily: "var(--font-d)",
      }}
    >
      <span style={{ color: c, fontSize: 16 }}>
        {type === "error" ? "✕" : "✓"}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
};

// ─── Participant Certificate ──────────────────────────────────────────────────────
const ParticipantCertificate = ({ name }) => {
  const canvasRef = useRef(null);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    if (!name) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/1.png"; // Participant template

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const cx = canvas.width / 2;
      // ── Fixed Alignment: Participant Name ──
      // Moved down an additional 15px
      const nameY = Math.round(canvas.height * 0.385) + 15;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 6;

      let fontSize = 66;
      ctx.font = `bold ${fontSize}px 'Georgia', serif`;
      while (
        ctx.measureText(name).width > canvas.width * 0.68 &&
        fontSize > 28
      ) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px 'Georgia', serif`;
      }

      ctx.fillStyle = "#6b1a1a";
      ctx.fillText(name.toUpperCase(), cx, nameY);
      ctx.shadowBlur = 0;

      setImgReady(true);
    };
  }, [name]);

  const download = () => {
    const link = document.createElement("a");
    link.download = `InterConnect26_Participation_${name?.replace(/\s+/g, "_")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 12,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      />
      {imgReady && (
        <DownloadBtn
          onClick={download}
          label="Download Certificate"
          color="#7c5cfc"
        />
      )}
    </div>
  );
};

// ─── Contributor Certificate ──────────────────────────────────────────────────────
const ContributorCertificate = ({ name, totalScore, projectCount, rank }) => {
  const canvasRef = useRef(null);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    if (!name) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/13.png"; // Contributor template

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const W = canvas.width;
      const H = canvas.height;

      // ── Fixed Alignment: Student Name ──
      // Moved down an additional 15px (total 41px down from the baseline)
      const nameY = Math.round(H * 0.385) + 41;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4;

      let fontSize = 66;
      ctx.font = `bold ${fontSize}px 'Georgia', serif`;
      while (ctx.measureText(name).width > W * 0.68 && fontSize > 28) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px 'Georgia', serif`;
      }
      ctx.fillStyle = "#3b1d6b";
      ctx.fillText(name.toUpperCase(), W / 2, nameY);
      ctx.shadowBlur = 0;

      // ── Fixed Alignment: Stats boxes ──
      const statsY = Math.round(H * 0.612) - 2;

      const boxCentres = [
        Math.round(W * 0.285),
        Math.round(W * 0.5),
        Math.round(W * 0.715),
      ];

      const values = [totalScore, projectCount, rank];

      values.forEach((val, i) => {
        const bx = boxCentres[i];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = `bold 44px 'Georgia', serif`;
        ctx.fillStyle = "#c4982a";
        ctx.fillText(val, bx, statsY);
      });

      setImgReady(true);
    };
  }, [name, totalScore, projectCount, rank]);

  const download = () => {
    const link = document.createElement("a");
    link.download = `InterConnect26_Contributor_${name?.replace(/\s+/g, "_")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 12,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      />
      {imgReady && (
        <DownloadBtn
          onClick={download}
          label="Download Certificate"
          color="#f5a623"
        />
      )}
    </div>
  );
};

// ─── Download Button ─────────────────────────────────────────────────────────────
const DownloadBtn = ({ onClick, label, color }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    style={{
      padding: "13px 32px",
      borderRadius: 12,
      border: `1px solid ${color}50`,
      background: `${color}18`,
      color,
      fontFamily: "var(--font-d)",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
    {label}
  </motion.button>
);

// ─── Badge ───────────────────────────────────────────────────────────────────────
const Badge = ({ label, value, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "14px 20px",
      borderRadius: 14,
      background: `${color}12`,
      border: `1px solid ${color}28`,
      minWidth: 90,
    }}
  >
    <span
      style={{
        fontFamily: "var(--font-d)",
        fontWeight: 800,
        fontSize: 22,
        color,
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: "var(--font-m)",
        fontSize: 9,
        color: "var(--text3)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════
const Certificate = () => {
  const appCtx = (() => {
    try {
      return useAppContext();
    } catch {
      return null;
    }
  })();
  const axiosInst = appCtx?.axios;
  const ctxToken = appCtx?.studentToken;

  const resolveToken = () =>
    ctxToken ||
    localStorage.getItem("studentToken") ||
    localStorage.getItem("token") ||
    null;

  const authGet = async (url) => {
    const token = resolveToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (axiosInst) return await axiosInst.get(url, { headers });
    const base = import.meta.env?.VITE_BASE_URL || "";
    const res = await fetch(`${base}${url}`, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  };

  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authGet("/api/student/certificate");
      if (data.success) {
        setCertData(data);
      } else {
        setToast({
          message: data.message || "Failed to load certificate.",
          type: "error",
        });
      }
    } catch (e) {
      setToast({
        message: e?.response?.data?.message || "Failed to load certificate.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [ctxToken]);

  useEffect(() => {
    load();
  }, [load]);

  const isContributor = certData?.certificateType === "contributor";
  const d = certData?.data || {};

  if (loading)
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "var(--bg)",
        }}
      >
        <style>{STYLES}</style>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg,#4f8ef7,#7c5cfc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#fff",
          }}
          className="animate-spin"
        >
          ◎
        </div>
        <p
          style={{
            fontFamily: "var(--font-m)",
            fontSize: 11,
            color: "var(--text3)",
            textTransform: "uppercase",
          }}
        >
          Generating certificate…
        </p>
      </div>
    );

  return (
    <>
      <style>{STYLES}</style>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--bg)",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Background Ambience */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -200,
              left: "10%",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background: isContributor
                ? "radial-gradient(circle,#f5a62308,transparent 70%)"
                : "radial-gradient(circle,#7c5cfc08,transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -200,
              right: "5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle,#4f8ef708,transparent 70%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 700,
            margin: "0 auto",
            padding: "32px 16px 64px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 32, textAlign: "center" }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                margin: "0 auto 16px",
                background: isContributor
                  ? "linear-gradient(135deg,#f5a623,#f97316)"
                  : "linear-gradient(135deg,#7c5cfc,#4f8ef7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: "#fff",
                boxShadow: isContributor
                  ? "0 12px 32px #f5a62340"
                  : "0 12px 32px #7c5cfc40",
              }}
              className="animate-float"
            >
              {isContributor ? "🏆" : "🎖️"}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-d)",
                fontWeight: 900,
                color: "var(--text)",
                fontSize: "clamp(22px,5.5vw,32px)",
                margin: "0 0 8px",
              }}
            >
              {isContributor
                ? "Contributor Certificate"
                : "Participation Certificate"}
            </h1>
          </motion.div>

          {isContributor && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
                marginBottom: 28,
              }}
            >
              <Badge
                label="Total Score"
                value={d.totalScore ?? 0}
                color="#f5a623"
              />
              <Badge
                label="Projects"
                value={d.projectCount ?? 0}
                color="#4f8ef7"
              />
              <Badge label="Rank" value={`#${d.rank ?? "—"}`} color="#22d3a0" />
            </motion.div>
          )}

          {!isContributor && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                background: "#7c5cfc12",
                border: "1px solid #7c5cfc28",
                marginBottom: 28,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-m)",
                  fontSize: 12,
                  color: "var(--text2)",
                  margin: "0 0 4px",
                }}
              >
                Awarded to
              </p>
              <p
                style={{
                  fontFamily: "var(--font-d)",
                  fontWeight: 800,
                  fontSize: "clamp(18px,4vw,22px)",
                  color: "var(--text)",
                  margin: "0",
                }}
              >
                {d.name}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isContributor ? (
              <ContributorCertificate
                name={d.name}
                totalScore={d.totalScore}
                projectCount={d.projectCount}
                rank={d.rank}
              />
            ) : (
              <ParticipantCertificate name={d.name} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              marginTop: 32,
              borderRadius: 16,
              padding: "18px 20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  borderRadius: 3,
                  background: isContributor ? "#f5a623" : "#7c5cfc",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-d)",
                  fontWeight: 700,
                  color: "var(--text)",
                  fontSize: 14,
                }}
              >
                Certificate Details
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Name", value: d.name },
                { label: "Email", value: d.email },
                { label: "Event", value: "InterConnect 26.0" },
                {
                  label: "Type",
                  value: isContributor
                    ? "Certificate of Contribution"
                    : "Certificate of Participation",
                },
                ...(isContributor
                  ? [
                      { label: "Score", value: `${d.totalScore} pts` },
                      { label: "Projects", value: d.projectCount },
                      {
                        label: "Rank",
                        value: `#${d.rank} of ${d.totalParticipants}`,
                      },
                    ]
                  : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "7px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 10,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      minWidth: 72,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 12,
                      color: "var(--text)",
                    }}
                  >
                    {value ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
};

export default Certificate;
