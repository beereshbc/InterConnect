import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Tag,
  Users,
  CheckCircle,
  Briefcase,
  Mail,
  ArrowRight,
  ChevronRight,
  User,
  Plus,
  X,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Primitives ───────────────────────────────────────────────────────────────
const ThemeBadge = ({ children }) => (
  <span
    className="inline-block font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md"
    style={{
      background: "#0f1a2e",
      border: "1px solid #1a2d4a",
      color: "#60a5fa",
    }}
  >
    {children}
  </span>
);

const ProblemTag = ({ children }) => (
  <span
    className="inline-block font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-md"
    style={{
      background: "#111720",
      border: "1px solid #1e2840",
      color: "#7c8ea8",
    }}
  >
    {children}
  </span>
);

const Label = ({ children, required }) => (
  <label
    className="block font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5"
    style={{ color: "#4a5568" }}
  >
    {children}
    {required && (
      <span className="ml-1" style={{ color: "#3b5bdb" }}>
        *
      </span>
    )}
  </label>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  className = "",
}) => (
  <div className={className}>
    <Label required={required}>{label}</Label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg font-mono text-[13px] outline-none transition-all focus:ring-1"
      style={{
        background: "#0d1017",
        border: "1px solid #1e2330",
        padding: "10px 13px",
        color: "#c8d0dc",
        focusRingColor: "#3b5bdb",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#3b5bdb")}
      onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
    />
  </div>
);

const DetailBox = ({ icon: Icon, label, value }) => (
  <div
    className="flex items-start gap-2.5 rounded-xl p-3"
    style={{ background: "#0d1017", border: "1px solid #1a2030" }}
  >
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: "#131925", border: "1px solid #1e2840" }}
    >
      <Icon size={13} style={{ color: "#4a7cf7" }} />
    </div>
    <div className="min-w-0">
      <p
        className="font-mono text-[10px] font-semibold uppercase tracking-widest mb-0.5"
        style={{ color: "#3e4d6c" }}
      >
        {label}
      </p>
      <p
        className="font-mono text-[13px] font-medium truncate"
        style={{ color: "#b0bac8" }}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

// ─── Overlay ──────────────────────────────────────────────────────────────────
const Overlay = ({ children, onClose, title, subtitle, badge }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
    style={{
      background: "rgba(0,0,0,.65)",
      backdropFilter: "blur(4px)",
      padding: "80px 16px 24px",
    }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.97, y: 12 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.97, y: 12 }}
      transition={{ duration: 0.18 }}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{
        maxWidth: 740,
        background: "#0b0f18",
        border: "1px solid #1a2236",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-6 pt-5 pb-4"
        style={{ background: "#0b0f18", borderBottom: "1px solid #141b26" }}
      >
        <div className="flex-1 min-w-0">
          {badge && (
            <span
              className="inline-block font-mono text-[11px] mb-1.5 px-2 py-0.5 rounded-md"
              style={{
                background: "#0d1525",
                border: "1px solid #1a2d4a",
                color: "#4a7cf7",
              }}
            >
              {badge}
            </span>
          )}
          <h2
            className="font-display font-bold text-[17px] leading-tight truncate"
            style={{ color: "#dde3ee" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="font-mono text-[12px] mt-1"
              style={{ color: "#4e5a72" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 cursor-pointer transition-colors hover:border-slate-600"
          style={{
            background: "transparent",
            border: "1px solid #1e2330",
            color: "#5a6478",
          }}
        >
          <X size={15} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  </motion.div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Problems = () => {
  const { studentToken, axios } = useAppContext();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [search, setSearch] = useState("");

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
      minHeight: 220,
      style: {
        background: "#0d1017",
        color: "#cbd5e1",
        fontSize: "13px",
        fontFamily: "'DM Mono',monospace",
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
      toolbarAdaptive: false,
    }),
    [],
  );

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      // FIX: correct route is /api/student/problems/published
      const { data } = await axios.get("/api/student/problems/published");
      if (data.success) setProblems(data.problems || []);
    } catch {
      // fallback to legacy route
      try {
        const { data } = await axios.get("/api/student/published");
        if (data.success) setProblems(data.problems || []);
      } catch {
        toast.error("Failed to load problems.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    setSubmitting(true);
    try {
      // FIX: correct route is /api/student/problems/create
      const { data } = await axios.post(
        "/api/student/problems/create",
        formData,
      );
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinProject = async (problemId) => {
    if (!studentToken) {
      toast.error("Please log in to join a project.");
      navigate("/register");
      return;
    }
    setJoining(true);
    try {
      // FIX: correct route is /api/student/problems/:id/join
      const { data } = await axios.post(
        `/api/student/problems/${problemId}/join`,
      );
      if (data.success) {
        toast.success("Successfully joined the project!");
        setSelectedProblem(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join project.");
    } finally {
      setJoining(false);
    }
  };

  const filtered = problems.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.organization?.toLowerCase().includes(search.toLowerCase()) ||
      p.theme?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');
        .font-display{font-family:'Syne',sans-serif!important}
        .font-mono{font-family:'DM Mono',monospace!important}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2f3a;border-radius:4px}
        .prob-row:hover{background:rgba(255,255,255,0.025) !important}
        .jodit-container{border-color:#1e2330 !important}
        .jodit-workplace{background:#0d1017 !important}
        .jodit-toolbar{background:#0d1017 !important;border-color:#1e2330 !important}
      `}</style>

      <div
        className="font-mono w-full"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#3b5bdb" }}
              />
              <span
                className="font-mono text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#3b5bdb" }}
              >
                Problem Board
              </span>
            </div>
            <h1
              className="font-display font-semibold text-[22px] leading-tight"
              style={{ color: "#dde3ee", letterSpacing: "-0.01em" }}
            >
              Active Problem Statements
            </h1>
            <p
              className="font-mono text-[13px] mt-1"
              style={{ color: "#4e5a72" }}
            >
              Discover, inspect, and contribute to real-world challenges.
            </p>
          </div>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-1.5 rounded-lg font-mono font-medium text-[13px] px-4 py-2.5 cursor-pointer transition-all hover:border-[#3b5bdb]"
            style={{
              background: "#1e2d6b",
              color: "#a5b4fc",
              border: "1px solid #2d3f8a",
            }}
          >
            <Plus size={14} strokeWidth={2.5} /> Upload Statement
          </button>
        </div>

        {/* ── Search ── */}
        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, organization or theme…"
            className="w-full rounded-xl font-mono text-[13px] outline-none max-w-xs"
            style={{
              background: "#0c0f18",
              border: "1px solid #1e2330",
              padding: "9px 14px",
              color: "#f0f4ff",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b5bdb")}
            onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
          />
        </div>

        {/* ── Table ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#0b0f18", border: "1px solid #191f2e" }}
        >
          <div className="overflow-x-auto">
            <table
              className="w-full font-mono text-[13px]"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    background: "#0d1117",
                    borderBottom: "1px solid #191f2e",
                  }}
                >
                  {[
                    "Problem ID",
                    "Title",
                    "Organization",
                    "Theme",
                    "Date",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="font-mono text-[11px] font-medium uppercase tracking-widest whitespace-nowrap"
                      style={{
                        padding: "10px 16px",
                        color: "#3e4d6c",
                        textAlign: i === 5 ? "right" : "left",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 font-mono text-[13px]"
                      style={{ color: "#3e4d6c" }}
                    >
                      Loading problems…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 font-mono text-[13px]"
                      style={{ color: "#3e4d6c" }}
                    >
                      {search
                        ? "No problems match your search."
                        : "No published problems at the moment."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((prob, idx) => (
                    <tr
                      key={prob._id}
                      className="prob-row cursor-pointer transition-colors"
                      onClick={() => setSelectedProblem(prob)}
                      style={{
                        borderBottom:
                          idx < filtered.length - 1
                            ? "1px solid #111720"
                            : "none",
                      }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className="font-mono text-[12px] px-2 py-0.5 rounded-md"
                          style={{
                            background: "#0d1525",
                            border: "1px solid #1a2d4a",
                            color: "#4a7cf7",
                          }}
                        >
                          {prob.problemID}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", maxWidth: 280 }}>
                        <span
                          className="font-mono font-medium truncate block"
                          style={{ color: "#c8d0dc" }}
                        >
                          {prob.title}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className="inline-flex items-center gap-1.5 font-mono text-[12px]"
                          style={{ color: "#6b7a94" }}
                        >
                          <Building size={12} className="flex-shrink-0" />{" "}
                          {prob.organization}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <ThemeBadge>{prob.theme}</ThemeBadge>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: "#4e5a72" }}
                        >
                          {fmtDate(prob.createdAt)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <span
                          className="inline-flex items-center gap-0.5 font-mono text-[12px] font-medium"
                          style={{ color: "#4a7cf7" }}
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

        {/* ── Count ── */}
        {!isLoading && (
          <p
            className="font-mono text-[11px] mt-3"
            style={{ color: "#4e5a72" }}
          >
            {filtered.length} problem{filtered.length !== 1 ? "s" : ""}{" "}
            {search ? "found" : "published"}
          </p>
        )}

        {/* ── MODALS ── */}
        <AnimatePresence>
          {/* Create Problem */}
          {isCreateOpen && (
            <Overlay
              onClose={() => setIsCreateOpen(false)}
              title="Submit Problem Statement"
              subtitle="Fill in the details below. Your submission will be reviewed before publishing."
            >
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <Input
                    label="Problem Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Blockchain Voting System"
                    required
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web App, AI Model"
                    required
                  />
                  <Input
                    label="Theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    placeholder="e.g., FinTech, Healthcare"
                    required
                  />
                  <Input
                    label="Organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company / College Name"
                    required
                  />
                  <Input
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., R&D, IT"
                  />
                  <Input
                    label="Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    required
                  />
                  <Input
                    label="Coordinator Name"
                    name="problem_coordinator"
                    value={formData.problem_coordinator}
                    onChange={handleChange}
                    placeholder="Coordinator overseeing this"
                  />
                  <Input
                    label="Contact Info"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Email or Phone"
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Tags (comma separated)"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="react, nodejs, blockchain"
                    className="sm:col-span-2"
                  />
                </div>

                <div className="mb-5">
                  <Label required>Detailed Description</Label>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid #1e2330" }}
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
                  className="flex justify-end gap-2.5 pt-4"
                  style={{ borderTop: "1px solid #141b26" }}
                >
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-colors"
                    style={{
                      background: "transparent",
                      border: "1px solid #1e2330",
                      color: "#5a6478",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[13px] font-medium cursor-pointer disabled:opacity-60 transition-colors"
                    style={{
                      background: "#1e2d6b",
                      border: "1px solid #2d3f8a",
                      color: "#a5b4fc",
                    }}
                  >
                    {submitting ? "Submitting…" : "Submit for Review"}
                  </button>
                </div>
              </form>
            </Overlay>
          )}

          {/* View Problem */}
          {selectedProblem && (
            <Overlay
              onClose={() => setSelectedProblem(null)}
              title={selectedProblem.title}
              badge={selectedProblem.problemID}
            >
              <div className="space-y-5">
                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <div
                    className="rounded-xl overflow-y-auto max-h-52 prose-invert"
                    style={{
                      background: "#0d1017",
                      border: "1px solid #1a2030",
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      className="font-mono text-[13px] leading-relaxed"
                      style={{ color: "#8a95a8" }}
                      dangerouslySetInnerHTML={{
                        __html: selectedProblem.description,
                      }}
                    />
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProblem.tags.map((t, i) => (
                        <ProblemTag key={i}>{t}</ProblemTag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div
                  className="flex items-center justify-between flex-wrap gap-3 pt-4"
                  style={{ borderTop: "1px solid #141b26" }}
                >
                  <div
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{
                      background: "#0d1017",
                      border: "1px solid #1a2030",
                    }}
                  >
                    <Users size={13} style={{ color: "#4a7cf7" }} />
                    <span
                      className="font-mono text-[12px]"
                      style={{ color: "#6b7a94" }}
                    >
                      {selectedProblem.assignedStudents?.length || 0}{" "}
                      contributors
                    </span>
                  </div>
                  <button
                    onClick={() => handleJoinProject(selectedProblem._id)}
                    disabled={joining}
                    className="inline-flex items-center gap-2 rounded-lg font-mono font-medium text-[13px] px-5 py-2.5 cursor-pointer disabled:opacity-60 transition-colors"
                    style={{
                      background: "#0f2318",
                      border: "1px solid #1a3d29",
                      color: "#34d399",
                    }}
                  >
                    {joining ? (
                      "Joining…"
                    ) : (
                      <>
                        <span>Join Project Pipeline</span>
                        <ArrowRight size={14} />
                      </>
                    )}
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

export default Problems;
