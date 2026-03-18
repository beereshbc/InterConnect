import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  SALayout,
  SA_ACCENT,
  Pill,
  Badge,
  SABtn,
  SAModal,
  SAToast,
  Spinner,
  fmtDate,
  Avatar,
} from "./SALayout";

const saAxios = () =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("saToken")}` },
  });

const AdminDetailModal = ({ admin, onClose }) => (
  <SAModal title={`Admin · ${admin.name}`} onClose={onClose}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 20,
      }}
    >
      <Avatar name={admin.name} size={52} />
      <div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            fontWeight: 800,
            color: "#f0f4ff",
          }}
        >
          {admin.name}
        </div>
        <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>
          {admin.email}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <Pill type={admin.isBlocked ? "blocked" : "active"}>
            {admin.isBlocked ? "Blocked" : "Active"}
          </Pill>
          <Badge color={SA_ACCENT}>{admin.role}</Badge>
        </div>
      </div>
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {[
        ["Phone", admin.phone || "—"],
        ["College", admin.college || "—"],
        ["Branch", admin.branch || "—"],
        ["Program", admin.program || "—"],
        ["GitHub", admin.githubLink || "—"],
        ["Joined", fmtDate(admin.createdAt)],
        ["Projects", admin.managedProjects?.length ?? 0],
        ["Total Tasks", admin.totalTaskCreated ?? 0],
        ["Total Points", admin.totalPoints ?? 0],
      ].map(([k, v]) => (
        <div
          key={k}
          style={{
            background: "#060810",
            border: "1px solid #1e2330",
            borderRadius: 8,
            padding: "10px 14px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#6b7a99",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {k}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#c4cedf",
              fontFamily: "'DM Mono', monospace",
              marginTop: 4,
            }}
          >
            {String(v)}
          </div>
        </div>
      ))}
    </div>
  </SAModal>
);

const DeleteConfirmModal = ({ admin, onClose, onDelete }) => {
  const [saving, setSaving] = useState(false);
  return (
    <SAModal title="Confirm Delete" onClose={onClose}>
      <div
        style={{
          background: "#3a1a1a",
          border: "1px solid #f8717130",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#f87171",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          ⚠ This action is irreversible.
        </div>
        <div style={{ fontSize: 12, color: "#c4cedf" }}>
          Admin <strong>{admin.name}</strong> ({admin.email}) will be
          permanently removed.
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <SABtn variant="secondary" onClick={onClose}>
          Cancel
        </SABtn>
        <SABtn
          variant="danger"
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onDelete(admin._id);
            setSaving(false);
            onClose();
          }}
        >
          Delete Admin
        </SABtn>
      </div>
    </SAModal>
  );
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | blocked

  const [detailAdmin, setDetailAdmin] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await saAxios().get("/api/admin/sa/admins");
      setAdmins(data.admins || []);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to load admins.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggleBlock = async (adminId) => {
    try {
      const { data } = await saAxios().patch(
        `/api/admin/sa/admins/${adminId}/toggle-block`,
      );
      if (data.success) {
        setAdmins((prev) =>
          prev.map((a) =>
            a._id === adminId ? { ...a, isBlocked: data.isBlocked } : a,
          ),
        );
        showToast(data.message, data.isBlocked ? "warn" : "success");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed.", "error");
    }
  };

  const handleDelete = async (adminId) => {
    try {
      const { data } = await saAxios().delete(
        `/api/admin/sa/admins/${adminId}`,
      );
      if (data.success) {
        setAdmins((prev) => prev.filter((a) => a._id !== adminId));
        showToast(data.message, "warn");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed.", "error");
    }
  };

  const filtered = admins.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.college?.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return !a.isBlocked && matchSearch;
    if (filter === "blocked") return a.isBlocked && matchSearch;
    return matchSearch;
  });

  return (
    <SALayout
      title="Admin Management"
      subtitle="View, block & manage all admin accounts"
    >
      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admins…"
          style={{
            background: "#0c0f18",
            border: "1px solid #1e2330",
            borderRadius: 9,
            padding: "9px 14px",
            color: "#f0f4ff",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            outline: "none",
            width: 260,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "active", "blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: `1px solid ${filter === f ? `${SA_ACCENT}60` : "#1e2330"}`,
                background: filter === f ? `${SA_ACCENT}18` : "#0c0f18",
                color: filter === f ? SA_ACCENT : "#6b7a99",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f}{" "}
              {f !== "all" &&
                `(${admins.filter((a) => (f === "active" ? !a.isBlocked : a.isBlocked)).length})`}
            </button>
          ))}
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#6b7a99",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {filtered.length} admin{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Spinner size={32} />
          <p style={{ color: "#6b7a99", fontSize: 12 }}>Loading admins…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#4a5568",
            fontSize: 13,
            marginTop: 60,
          }}
        >
          No admins found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((admin, i) => (
            <motion.div
              key={admin._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: "#0c0f18",
                border: `1px solid ${admin.isBlocked ? "#f8717120" : "#1e2330"}`,
                borderRadius: 13,
                padding: "18px 20px",
                borderLeft: `3px solid ${admin.isBlocked ? "#f87171" : "#4ade80"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <Avatar name={admin.name} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#f0f4ff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {admin.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b7a99",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {admin.email}
                  </div>
                </div>
                <Pill type={admin.isBlocked ? "blocked" : "active"}>
                  {admin.isBlocked ? "Blocked" : "Active"}
                </Pill>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  ["Projects", admin.managedProjects?.length ?? 0, "#3a9de8"],
                  ["Tasks", admin.totalTaskCreated ?? 0, "#fbbf24"],
                  ["Points", admin.totalPoints ?? 0, "#4ade80"],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      textAlign: "center",
                      background: "#131825",
                      borderRadius: 6,
                      padding: "8px 4px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 16,
                        fontWeight: 800,
                        color: c,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "#6b7a99",
                        textTransform: "uppercase",
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: "#6b7a99", marginBottom: 14 }}>
                {admin.college || "—"} · {admin.branch || "—"} · Joined{" "}
                {fmtDate(admin.createdAt)}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <SABtn
                  small
                  variant="ghost"
                  onClick={() => setDetailAdmin(admin)}
                >
                  View
                </SABtn>
                <SABtn
                  small
                  variant={admin.isBlocked ? "success" : "danger"}
                  onClick={() => handleToggleBlock(admin._id)}
                >
                  {admin.isBlocked ? "↑ Unblock" : "⊗ Block"}
                </SABtn>
                <SABtn
                  small
                  variant="danger"
                  onClick={() => setDeleteAdmin(admin)}
                >
                  Delete
                </SABtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {detailAdmin && (
        <AdminDetailModal
          admin={detailAdmin}
          onClose={() => setDetailAdmin(null)}
        />
      )}
      {deleteAdmin && (
        <DeleteConfirmModal
          admin={deleteAdmin}
          onClose={() => setDeleteAdmin(null)}
          onDelete={handleDelete}
        />
      )}
      {toast && (
        <SAToast
          message={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </SALayout>
  );
};

export default AdminManagement;
