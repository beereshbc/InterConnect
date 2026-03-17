import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Server,
  Building,
  Hash,
  Tag,
  Users,
  CheckCircle,
  Briefcase,
  Mail,
  FileText,
  ArrowRight,
  ChevronRight,
  Circle,
  User,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

const Problems = () => {
  const { studentToken, axios } = useAppContext();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    theme: "",
    tags: "",
    ownerName: "",
    organization: "",
    department: "",
    contactInfo: "",
    problem_coordinator: "",
  });

  const joditConfig = useMemo(
    () => ({
      theme: "dark",
      placeholder:
        "Describe the problem statement, requirements, and expected outcomes in detail...",
      minHeight: 240,
      style: {
        background: "#111318",
        color: "#cbd5e1",
        fontSize: "13px",
        fontFamily: "'DM Sans', sans-serif",
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "align",
        "|",
        "undo",
        "redo",
      ],
    }),
    [],
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axios.get("/api/problems/published");
        if (data.success) setProblems(data.problems);
      } catch {
        toast.error("Failed to load problems.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, [axios]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUploadClick = () => {
    if (!studentToken) {
      toast.error("Please log in to upload a problem statement.");
      navigate("/register");
      return;
    }
    setIsCreateOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || formData.description === "<p><br></p>")
      return toast.error("Description cannot be empty.");
    try {
      const { data } = await axios.post("/api/problems/create", formData);
      if (data.success) {
        toast.success(data.message);
        setIsCreateOpen(false);
        setFormData({
          title: "",
          category: "",
          description: "",
          theme: "",
          tags: "",
          ownerName: "",
          organization: "",
          department: "",
          contactInfo: "",
          problem_coordinator: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit problem.");
    }
  };

  const handleJoinProject = async (problemId) => {
    if (!studentToken) {
      toast.error("Please log in to join a project.");
      navigate("/register");
      return;
    }
    try {
      const { data } = await axios.post(`/api/problems/${problemId}/join`);
      if (data.success) {
        toast.success("Successfully joined the project!");
        setSelectedProblem(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join project.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .ps-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .ps-mono { font-family: 'DM Mono', monospace; }
        .ps-scroll::-webkit-scrollbar { width: 4px; }
        .ps-scroll::-webkit-scrollbar-track { background: transparent; }
        .ps-scroll::-webkit-scrollbar-thumb { background: #2a2f3a; border-radius: 4px; }
        .ps-row:hover { background: rgba(255,255,255,0.025); }
        .ps-input { width: 100%; background: #0d1017; border: 1px solid #1e2330; color: #c8d0dc; font-size: 13px; border-radius: 8px; padding: 10px 13px; outline: none; transition: border-color 0.15s; }
        .ps-input:focus { border-color: #3b5bdb; }
        .ps-input::placeholder { color: #3e4758; }
        .ps-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .ps-btn-primary { background: #1e2d6b; color: #a5b4fc; border: 1px solid #2d3f8a; font-size: 13px; font-weight: 500; padding: 9px 18px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .ps-btn-primary:hover { background: #263380; border-color: #3b5bdb; color: #c7d2fe; }
        .ps-btn-ghost { background: transparent; color: #5a6478; border: 1px solid #1e2330; font-size: 13px; font-weight: 500; padding: 9px 18px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .ps-btn-ghost:hover { color: #a0aec0; border-color: #2d3748; }
        .ps-btn-join { background: #0f2318; color: #34d399; border: 1px solid #1a3d29; font-size: 13px; font-weight: 500; padding: 10px 22px; border-radius: 8px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 7px; }
        .ps-btn-join:hover { background: #142d20; border-color: #22c55e; }
        .ps-label { font-size: 11px; font-weight: 500; color: #4a5568; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; display: block; }
        .ps-tag { background: #111720; border: 1px solid #1e2840; color: #7c8ea8; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 5px; }
        .ps-theme-badge { background: #0f1a2e; border: 1px solid #1a2d4a; color: #60a5fa; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 5px; }
        .ps-detail-card { background: #0d1017; border: 1px solid #1a2030; border-radius: 8px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; }
        .ps-icon-wrap { width: 28px; height: 28px; background: #131925; border: 1px solid #1e2840; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ps-prose h1,h2,h3,h4 { color: #c8d0dc; margin: 12px 0 6px; font-size: 14px; }
        .ps-prose p { color: #8a95a8; font-size: 13px; line-height: 1.7; margin: 0 0 8px; }
        .ps-prose ul,ol { color: #8a95a8; font-size: 13px; padding-left: 18px; }
      `}</style>

      <div
        className="ps-root"
        style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#3b5bdb",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#3b5bdb",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Problem Board
              </span>
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#dde3ee",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Active Problem Statements
            </h1>
            <p style={{ fontSize: 13, color: "#4e5a72", margin: "4px 0 0" }}>
              Discover, inspect, and contribute to real-world challenges.
            </p>
          </div>
          <button
            onClick={handleUploadClick}
            className="ps-btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={14} strokeWidth={2.5} /> Upload Statement
          </button>
        </div>

        {/* ── Table ── */}
        <div
          style={{
            background: "#0b0f18",
            border: "1px solid #191f2e",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#0d1117",
                    borderBottom: "1px solid #191f2e",
                  }}
                >
                  {["Problem ID", "Title", "Organization", "Theme", ""].map(
                    (h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "10px 16px",
                          fontWeight: 500,
                          fontSize: 11,
                          color: "#3e4d6c",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          textAlign: i === 4 ? "right" : "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "40px 16px",
                        color: "#3e4d6c",
                        fontSize: 13,
                      }}
                    >
                      Loading problems…
                    </td>
                  </tr>
                ) : problems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "40px 16px",
                        color: "#3e4d6c",
                        fontSize: 13,
                      }}
                    >
                      No published problems at the moment.
                    </td>
                  </tr>
                ) : (
                  problems.map((prob, idx) => (
                    <tr
                      key={prob._id}
                      className="ps-row"
                      onClick={() => setSelectedProblem(prob)}
                      style={{
                        borderBottom:
                          idx < problems.length - 1
                            ? "1px solid #111720"
                            : "none",
                        cursor: "pointer",
                        transition: "background 0.1s",
                      }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className="ps-mono"
                          style={{
                            fontSize: 12,
                            color: "#4a7cf7",
                            background: "#0d1525",
                            border: "1px solid #1a2d4a",
                            padding: "2px 8px",
                            borderRadius: 5,
                          }}
                        >
                          {prob.problemID}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 500,
                          color: "#c8d0dc",
                          maxWidth: 280,
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {prob.title}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            color: "#6b7a94",
                            fontSize: 12,
                          }}
                        >
                          <Building size={12} style={{ flexShrink: 0 }} />
                          {prob.organization}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className="ps-theme-badge">{prob.theme}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            justifyContent: "flex-end",
                            color: "#4a7cf7",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          View <ChevronRight size={13} />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MODALS ── */}
        <AnimatePresence>
          {/* Create Problem */}
          {isCreateOpen && (
            <Overlay
              onClose={() => setIsCreateOpen(false)}
              title="Submit Problem Statement"
              subtitle="Fill in the details below. Your submission will be reviewed before publishing."
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <FormField
                  label="Problem Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Blockchain Voting System"
                  style={{ gridColumn: "1 / -1" }}
                />
                <FormField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Web App, AI Model"
                />
                <FormField
                  label="Theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="e.g., FinTech, Healthcare"
                />
                <FormField
                  label="Organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company / College Name"
                />
                <FormField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., R&D, IT"
                />
                <FormField
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                />
                <FormField
                  label="Coordinator Name"
                  name="problem_coordinator"
                  value={formData.problem_coordinator}
                  onChange={handleChange}
                  placeholder="Coordinator overseeing this"
                />
                <FormField
                  label="Contact Info"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Email or Phone"
                  style={{ gridColumn: "1 / -1" }}
                />
                <FormField
                  label="Tags (comma separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="react, nodejs, blockchain"
                  style={{ gridColumn: "1 / -1" }}
                />
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="ps-label">Detailed Description</label>
                  <div
                    style={{
                      border: "1px solid #1e2330",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <JoditEditor
                      ref={editorRef}
                      value={formData.description}
                      config={joditConfig}
                      onBlur={(c) =>
                        setFormData({ ...formData, description: c })
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    paddingTop: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="ps-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ps-btn-primary">
                    Submit for Review
                  </button>
                </div>
              </form>
            </Overlay>
          )}

          {/* Inspect Problem */}
          {selectedProblem && (
            <Overlay
              onClose={() => setSelectedProblem(null)}
              title={selectedProblem.title}
              badge={selectedProblem.problemID}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                {/* Description */}
                <div>
                  <label className="ps-label">Description</label>
                  <div
                    className="ps-prose"
                    style={{
                      background: "#0d1017",
                      border: "1px solid #1a2030",
                      borderRadius: 8,
                      padding: "14px 16px",
                      maxHeight: 240,
                      overflowY: "auto",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedProblem.description,
                    }}
                  />
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <DetailBox
                    icon={Building}
                    label="Organization"
                    value={selectedProblem.organization}
                  />
                  <DetailBox
                    icon={Briefcase}
                    label="Department"
                    value={selectedProblem.department || "—"}
                  />
                  <DetailBox
                    icon={Tag}
                    label="Category"
                    value={selectedProblem.category}
                  />
                  <DetailBox
                    icon={CheckCircle}
                    label="Theme"
                    value={selectedProblem.theme}
                  />
                  <DetailBox
                    icon={User}
                    label="Owner"
                    value={selectedProblem.ownerName}
                  />
                  <DetailBox
                    icon={Mail}
                    label="Contact"
                    value={selectedProblem.contactInfo}
                  />
                </div>

                {/* Tags */}
                {selectedProblem.tags?.length > 0 && (
                  <div>
                    <label className="ps-label">Tags</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {selectedProblem.tags.map((tag, i) => (
                        <span key={i} className="ps-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 16,
                    borderTop: "1px solid #141b26",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      background: "#0d1017",
                      border: "1px solid #1a2030",
                      padding: "7px 14px",
                      borderRadius: 8,
                    }}
                  >
                    <Users size={13} style={{ color: "#4a7cf7" }} />
                    <span style={{ fontSize: 12, color: "#6b7a94" }}>
                      {selectedProblem.assignedStudents?.length || 0}{" "}
                      contributors active
                    </span>
                  </div>
                  <button
                    onClick={() => handleJoinProject(selectedProblem._id)}
                    className="ps-btn-join"
                  >
                    Join Project Pipeline <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </Overlay>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

/* ── Overlay Component ── */
const Overlay = ({ children, onClose, title, subtitle, badge }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "80px 16px 24px",
      background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(4px)",
    }}
  >
    <motion.div
      initial={{ scale: 0.97, y: 12 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.97, y: 12 }}
      transition={{ duration: 0.18 }}
      className="ps-scroll"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 740,
        maxHeight: "82vh",
        background: "#0b0f18",
        border: "1px solid #1a2236",
        borderRadius: 14,
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
      }}
    >
      {/* Modal Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #141b26",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          position: "sticky",
          top: 0,
          background: "#0b0f18",
          zIndex: 1,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {badge && (
            <span
              className="ps-mono"
              style={{
                fontSize: 11,
                color: "#4a7cf7",
                background: "#0d1525",
                border: "1px solid #1a2d4a",
                padding: "2px 8px",
                borderRadius: 5,
                display: "inline-block",
                marginBottom: 6,
              }}
            >
              {badge}
            </span>
          )}
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 600,
              color: "#dde3ee",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4e5a72" }}>
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid #1e2330",
            color: "#5a6478",
            borderRadius: 6,
            padding: 5,
            cursor: "pointer",
            display: "flex",
            flexShrink: 0,
            transition: "all 0.12s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#c8d0dc";
            e.target.style.borderColor = "#2d3748";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#5a6478";
            e.target.style.borderColor = "#1e2330";
          }}
        >
          <X size={15} />
        </button>
      </div>
      <div style={{ padding: "20px 24px 24px" }}>{children}</div>
    </motion.div>
  </motion.div>
);

/* ── Form Field ── */
const FormField = ({ label, name, value, onChange, placeholder, style }) => (
  <div style={style}>
    <label className="ps-label">{label}</label>
    <input
      className="ps-input"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);

/* ── Detail Box ── */
const DetailBox = ({ icon: Icon, label, value }) => (
  <div className="ps-detail-card">
    <div className="ps-icon-wrap">
      <Icon size={13} style={{ color: "#4a7cf7" }} />
    </div>
    <div style={{ minWidth: 0 }}>
      <p
        style={{
          margin: "0 0 2px",
          fontSize: 10,
          fontWeight: 600,
          color: "#3e4d6c",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#b0bac8",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

export default Problems;
