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
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
      className="w-full rounded-lg font-mono text-[13px] outline-none transition-all"
      style={{
        background: "#0d1017",
        border: "1px solid #1e2330",
        padding: "10px 13px",
        color: "#c8d0dc",
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
        className="font-mono text-[13px] font-medium break-words"
        style={{ color: "#b0bac8" }}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

// ─── Highlight matched text ───────────────────────────────────────────────────
const Highlight = ({ text = "", query = "" }) => {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "#1e2d6b",
          color: "#a5b4fc",
          borderRadius: 3,
          padding: "0 2px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
};

// ─── Filter Pill ─────────────────────────────────────────────────────────────
const FilterPill = ({ label, value, onClear }) => (
  <span
    className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full"
    style={{
      background: "#1e2d6b",
      border: "1px solid #2d3f8a",
      color: "#a5b4fc",
    }}
  >
    <span style={{ color: "#5a7cf7" }}>{label}:</span> {value}
    <button
      onClick={onClear}
      className="hover:opacity-70 transition-opacity ml-0.5"
    >
      <X size={10} />
    </button>
  </span>
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
      padding: "60px 12px 24px",
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
      <div
        className="sticky top-0 z-10 flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 pb-4"
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
            className="font-display font-bold text-[16px] sm:text-[17px] leading-tight"
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
      <div className="px-4 sm:px-6 py-5">{children}</div>
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

  // ── Search & Filter State ──
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    theme: "",
    category: "",
    organization: "",
    department: "",
    owner: "",
    tag: "",
  });

  // Derived unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    const get = (key) =>
      [...new Set(problems.map((p) => p[key]).filter(Boolean))].sort();
    const allTags = [
      ...new Set(problems.flatMap((p) => p.tags || []).filter(Boolean)),
    ].sort();
    return {
      themes: get("theme"),
      categories: get("category"),
      organizations: get("organization"),
      departments: get("department"),
      owners: get("ownerName"),
      tags: allTags,
    };
  }, [problems]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

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
      const { data } = await axios.get("/api/student/problems/published");
      if (data.success) setProblems(data.problems || []);
    } catch {
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

  // ── Multi-field filtering ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems.filter((p) => {
      // Global text search across all meaningful fields
      const searchFields = [
        p.title,
        p.organization,
        p.theme,
        p.category,
        p.department,
        p.ownerName,
        p.contactInfo,
        p.problemID,
        ...(p.tags || []),
      ].map((v) => (v || "").toLowerCase());

      const matchesSearch = !q || searchFields.some((f) => f.includes(q));

      // Dropdown filters
      const matchTheme =
        !filters.theme ||
        (p.theme || "").toLowerCase() === filters.theme.toLowerCase();
      const matchCategory =
        !filters.category ||
        (p.category || "").toLowerCase() === filters.category.toLowerCase();
      const matchOrg =
        !filters.organization ||
        (p.organization || "").toLowerCase() ===
          filters.organization.toLowerCase();
      const matchDept =
        !filters.department ||
        (p.department || "").toLowerCase() === filters.department.toLowerCase();
      const matchOwner =
        !filters.owner ||
        (p.ownerName || "").toLowerCase() === filters.owner.toLowerCase();
      const matchTag =
        !filters.tag ||
        (p.tags || []).some(
          (t) => t.toLowerCase() === filters.tag.toLowerCase(),
        );

      return (
        matchesSearch &&
        matchTheme &&
        matchCategory &&
        matchOrg &&
        matchDept &&
        matchOwner &&
        matchTag
      );
    });
  }, [problems, search, filters]);

  const clearFilter = (key) => setFilters((f) => ({ ...f, [key]: "" }));
  const clearAll = () => {
    setSearch("");
    setFilters({
      theme: "",
      category: "",
      organization: "",
      department: "",
      owner: "",
      tag: "",
    });
  };

  const FilterSelect = ({ label, field, options }) => (
    <div className="relative">
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={filters[field]}
          onChange={(e) =>
            setFilters((f) => ({ ...f, [field]: e.target.value }))
          }
          className="w-full rounded-lg font-mono text-[12px] outline-none appearance-none pr-8 cursor-pointer"
          style={{
            background: "#0d1017",
            border: `1px solid ${filters[field] ? "#3b5bdb" : "#1e2330"}`,
            padding: "9px 13px",
            color: filters[field] ? "#a5b4fc" : "#5a6478",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#3b5bdb")}
          onBlur={(e) => {
            if (!filters[field]) e.target.style.borderColor = "#1e2330";
          }}
        >
          <option value="">All {label}s</option>
          {options.map((o) => (
            <option
              key={o}
              value={o}
              style={{ background: "#0d1017", color: "#c8d0dc" }}
            >
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#4e5a72" }}
        />
      </div>
    </div>
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
        .prob-row:hover{background:rgba(255,255,255,0.025)!important}
        .jodit-container{border-color:#1e2330!important}
        .jodit-workplace{background:#0d1017!important}
        .jodit-toolbar{background:#0d1017!important;border-color:#1e2330!important}
        mark{background:#1e2d6b;color:#a5b4fc;border-radius:3px;padding:0 2px}
      `}</style>

      <div
        className="font-mono w-full px-3 sm:px-0"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
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
              className="font-display font-semibold text-[20px] sm:text-[22px] leading-tight"
              style={{ color: "#dde3ee", letterSpacing: "-0.01em" }}
            >
              Active Problem Statements
            </h1>
            <p
              className="font-mono text-[12px] sm:text-[13px] mt-1"
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
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden xs:inline">Upload Statement</span>
            <span className="xs:hidden">Upload</span>
          </button>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-3">
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {/* Search input */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#4e5a72" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, org, theme, tags, owner, contact…"
                className="w-full rounded-xl font-mono text-[13px] outline-none pl-9"
                style={{
                  background: "#0c0f18",
                  border: "1px solid #1e2330",
                  padding: "10px 14px 10px 36px",
                  color: "#f0f4ff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b5bdb")}
                onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: "#4e5a72" }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl font-mono text-[12px] font-medium px-4 py-2.5 cursor-pointer transition-all flex-shrink-0"
              style={{
                background:
                  showFilters || activeFilterCount > 0 ? "#1e2d6b" : "#0c0f18",
                border: `1px solid ${showFilters || activeFilterCount > 0 ? "#3b5bdb" : "#1e2330"}`,
                color:
                  showFilters || activeFilterCount > 0 ? "#a5b4fc" : "#5a6478",
              }}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
                  style={{ background: "#3b5bdb", color: "#fff" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Filter Panel ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0b0f18", border: "1px solid #191f2e" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-mono text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: "#4e5a72" }}
                    >
                      Filter by field
                    </span>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() =>
                          setFilters({
                            theme: "",
                            category: "",
                            organization: "",
                            department: "",
                            owner: "",
                            tag: "",
                          })
                        }
                        className="font-mono text-[11px] hover:opacity-70 transition-opacity"
                        style={{ color: "#4a7cf7" }}
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <FilterSelect
                      label="Theme"
                      field="theme"
                      options={uniqueValues.themes}
                    />
                    <FilterSelect
                      label="Category"
                      field="category"
                      options={uniqueValues.categories}
                    />
                    <FilterSelect
                      label="Organization"
                      field="organization"
                      options={uniqueValues.organizations}
                    />
                    <FilterSelect
                      label="Department"
                      field="department"
                      options={uniqueValues.departments}
                    />
                    <FilterSelect
                      label="Owner"
                      field="owner"
                      options={uniqueValues.owners}
                    />
                    <FilterSelect
                      label="Tag"
                      field="tag"
                      options={uniqueValues.tags}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Active Filter Pills ── */}
          {(search || activeFilterCount > 0) && (
            <div className="flex items-center flex-wrap gap-2 mt-2.5">
              {search && (
                <FilterPill
                  label="search"
                  value={`"${search}"`}
                  onClear={() => setSearch("")}
                />
              )}
              {filters.theme && (
                <FilterPill
                  label="theme"
                  value={filters.theme}
                  onClear={() => clearFilter("theme")}
                />
              )}
              {filters.category && (
                <FilterPill
                  label="category"
                  value={filters.category}
                  onClear={() => clearFilter("category")}
                />
              )}
              {filters.organization && (
                <FilterPill
                  label="org"
                  value={filters.organization}
                  onClear={() => clearFilter("organization")}
                />
              )}
              {filters.department && (
                <FilterPill
                  label="dept"
                  value={filters.department}
                  onClear={() => clearFilter("department")}
                />
              )}
              {filters.owner && (
                <FilterPill
                  label="owner"
                  value={filters.owner}
                  onClear={() => clearFilter("owner")}
                />
              )}
              {filters.tag && (
                <FilterPill
                  label="tag"
                  value={filters.tag}
                  onClear={() => clearFilter("tag")}
                />
              )}
              {(search || activeFilterCount > 0) && (
                <button
                  onClick={clearAll}
                  className="font-mono text-[11px] hover:opacity-70 transition-opacity"
                  style={{ color: "#4e5a72" }}
                >
                  Clear all ×
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Desktop Table ── */}
        <div
          className="hidden sm:block rounded-xl overflow-hidden"
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
                      className="text-center py-12 font-mono text-[13px]"
                      style={{ color: "#3e4d6c" }}
                    >
                      Loading problems…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 font-mono text-[13px]"
                      style={{ color: "#3e4d6c" }}
                    >
                      {search || activeFilterCount > 0 ? (
                        <div>
                          <p>No problems match your search.</p>
                          <button
                            onClick={clearAll}
                            className="mt-2 text-[12px] hover:opacity-70 transition-opacity"
                            style={{ color: "#4a7cf7" }}
                          >
                            Clear all filters
                          </button>
                        </div>
                      ) : (
                        "No published problems at the moment."
                      )}
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
                      <td style={{ padding: "12px 16px", maxWidth: 260 }}>
                        <span
                          className="font-mono font-medium block"
                          style={{ color: "#c8d0dc" }}
                        >
                          <Highlight text={prob.title} query={search} />
                        </span>
                        {prob.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prob.tags.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                                style={{
                                  background: "#111720",
                                  color: "#5a6a84",
                                }}
                              >
                                <Highlight text={t} query={search} />
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className="inline-flex items-center gap-1.5 font-mono text-[12px]"
                          style={{ color: "#6b7a94" }}
                        >
                          <Building size={11} className="flex-shrink-0" />
                          <Highlight text={prob.organization} query={search} />
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <ThemeBadge>
                          <Highlight text={prob.theme} query={search} />
                        </ThemeBadge>
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

        {/* ── Mobile Card List ── */}
        <div className="sm:hidden space-y-2.5">
          {isLoading ? (
            <div
              className="text-center py-12 font-mono text-[13px]"
              style={{ color: "#3e4d6c" }}
            >
              Loading problems…
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-12 font-mono text-[13px]"
              style={{ color: "#3e4d6c" }}
            >
              <p>
                {search || activeFilterCount > 0
                  ? "No problems match your search."
                  : "No published problems at the moment."}
              </p>
              {(search || activeFilterCount > 0) && (
                <button
                  onClick={clearAll}
                  className="mt-2 text-[12px]"
                  style={{ color: "#4a7cf7" }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filtered.map((prob) => (
              <motion.div
                key={prob._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedProblem(prob)}
                className="cursor-pointer rounded-xl p-4 transition-all active:scale-[0.99]"
                style={{ background: "#0b0f18", border: "1px solid #191f2e" }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="font-mono text-[11px] px-2 py-0.5 rounded-md flex-shrink-0"
                    style={{
                      background: "#0d1525",
                      border: "1px solid #1a2d4a",
                      color: "#4a7cf7",
                    }}
                  >
                    {prob.problemID}
                  </span>
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: "#4e5a72" }}
                  >
                    {fmtDate(prob.createdAt)}
                  </span>
                </div>
                <p
                  className="font-mono font-medium text-[14px] mb-2 leading-snug"
                  style={{ color: "#c8d0dc" }}
                >
                  <Highlight text={prob.title} query={search} />
                </p>
                <div className="flex items-center gap-1.5 mb-2">
                  <Building size={11} style={{ color: "#4e5a72" }} />
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: "#6b7a94" }}
                  >
                    <Highlight text={prob.organization} query={search} />
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {prob.theme && (
                    <ThemeBadge>
                      <Highlight text={prob.theme} query={search} />
                    </ThemeBadge>
                  )}
                  {prob.tags?.slice(0, 2).map((t, i) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: "#111720", color: "#5a6a84" }}
                    >
                      <Highlight text={t} query={search} />
                    </span>
                  ))}
                  <span
                    className="ml-auto font-mono text-[12px] font-medium flex items-center gap-0.5"
                    style={{ color: "#4a7cf7" }}
                  >
                    View <ChevronRight size={12} />
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* ── Count ── */}
        {!isLoading && (
          <p
            className="font-mono text-[11px] mt-3"
            style={{ color: "#4e5a72" }}
          >
            {filtered.length} of {problems.length} problem
            {problems.length !== 1 ? "s" : ""}
            {search || activeFilterCount > 0
              ? " match your filters"
              : " published"}
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
                  className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4"
                  style={{ borderTop: "1px solid #141b26" }}
                >
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-colors"
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-[13px] font-medium cursor-pointer disabled:opacity-60 transition-colors"
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
                <div>
                  <Label>Description</Label>
                  <div
                    className="rounded-xl overflow-y-auto max-h-52"
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

                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4"
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg font-mono font-medium text-[13px] px-5 py-2.5 cursor-pointer disabled:opacity-60 transition-colors"
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
