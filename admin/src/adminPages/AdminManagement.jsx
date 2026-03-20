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

const InfoRow = ({ label, value }) => (
  <div
    className="rounded-lg p-2.5"
    style={{ background: "#060810", border: "1px solid #1e2330" }}
  >
    <div
      className="font-mono text-[9px] uppercase tracking-widest"
      style={{ color: "#6b7a99" }}
    >
      {label}
    </div>
    <div className="font-mono text-[12px] mt-1" style={{ color: "#c4cedf" }}>
      {String(value)}
    </div>
  </div>
);

const AdminDetailModal = ({ admin, onClose }) => (
  <SAModal title={`Admin · ${admin.name}`} onClose={onClose}>
    <div className="flex items-center gap-3.5 mb-5">
      <Avatar name={admin.name} size={52} />
      <div>
        <div
          className="font-display text-[17px] font-extrabold"
          style={{ color: "#f0f4ff" }}
        >
          {admin.name}
        </div>
        <div
          className="font-mono text-[12px] mt-0.5"
          style={{ color: "#6b7a99" }}
        >
          {admin.email}
        </div>
        <div className="flex gap-1.5 mt-2">
          <Pill type={admin.isBlocked ? "blocked" : "active"}>
            {admin.isBlocked ? "Blocked" : "Active"}
          </Pill>
          <Badge color={SA_ACCENT}>{admin.role}</Badge>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2.5 mb-4">
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
        <InfoRow key={k} label={k} value={v} />
      ))}
    </div>
  </SAModal>
);

const DeleteConfirmModal = ({ admin, onClose, onDelete }) => {
  const [saving, setSaving] = useState(false);
  return (
    <SAModal title="Confirm Delete" onClose={onClose}>
      <div
        className="rounded-xl p-4 mb-5"
        style={{ background: "#3a1a1a", border: "1px solid #f8717130" }}
      >
        <div
          className="font-mono text-[13px] font-bold mb-1"
          style={{ color: "#f87171" }}
        >
          ⚠ This action is irreversible.
        </div>
        <div className="font-mono text-[12px]" style={{ color: "#c4cedf" }}>
          Admin <strong>{admin.name}</strong> ({admin.email}) will be
          permanently removed.
        </div>
      </div>
      <div className="flex gap-2.5 justify-end">
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
  const [filter, setFilter] = useState("all");
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
    const m =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.college?.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return !a.isBlocked && m;
    if (filter === "blocked") return a.isBlocked && m;
    return m;
  });

  return (
    <SALayout
      title="Admin Management"
      subtitle="View, block & manage all admin accounts"
    >
      {/* Controls */}
      <div className="flex gap-3 items-center mb-5 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admins…"
          className="rounded-xl font-mono text-[12px] outline-none"
          style={{
            background: "#0c0f18",
            border: "1px solid #1e2330",
            padding: "9px 14px",
            color: "#f0f4ff",
            width: 260,
          }}
        />
        <div className="flex gap-1.5">
          {["all", "active", "blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-lg font-mono text-[11px] font-bold cursor-pointer capitalize tracking-wide"
              style={{
                padding: "7px 14px",
                border: `1px solid ${filter === f ? `${SA_ACCENT}60` : "#1e2330"}`,
                background: filter === f ? `${SA_ACCENT}18` : "#0c0f18",
                color: filter === f ? SA_ACCENT : "#6b7a99",
              }}
            >
              {f}{" "}
              {f !== "all" &&
                `(${admins.filter((a) => (f === "active" ? !a.isBlocked : a.isBlocked)).length})`}
            </button>
          ))}
        </div>
        <div
          className="ml-auto font-mono text-[12px]"
          style={{ color: "#6b7a99" }}
        >
          {filtered.length} admin{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Spinner size={32} />
          <p className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
            Loading admins…
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center font-mono text-[13px] mt-16"
          style={{ color: "#4a5568" }}
        >
          No admins found.
        </div>
      ) : (
        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))" }}
        >
          {filtered.map((admin, i) => (
            <motion.div
              key={admin._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-5"
              style={{
                background: "#0c0f18",
                border: `1px solid ${admin.isBlocked ? "#f8717120" : "#1e2330"}`,
                borderLeft: `3px solid ${admin.isBlocked ? "#f87171" : "#4ade80"}`,
              }}
            >
              <div className="flex items-start gap-3 mb-3.5">
                <Avatar name={admin.name} size={42} />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-display text-sm font-bold truncate"
                    style={{ color: "#f0f4ff" }}
                  >
                    {admin.name}
                  </div>
                  <div
                    className="font-mono text-[11px] mt-0.5 truncate"
                    style={{ color: "#6b7a99" }}
                  >
                    {admin.email}
                  </div>
                </div>
                <Pill type={admin.isBlocked ? "blocked" : "active"}>
                  {admin.isBlocked ? "Blocked" : "Active"}
                </Pill>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3.5">
                {[
                  ["Projects", admin.managedProjects?.length ?? 0, "#3a9de8"],
                  ["Tasks", admin.totalTaskCreated ?? 0, "#fbbf24"],
                  ["Points", admin.totalPoints ?? 0, "#4ade80"],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    className="text-center rounded-lg py-2"
                    style={{ background: "#131825" }}
                  >
                    <div
                      className="font-display text-base font-extrabold"
                      style={{ color: c }}
                    >
                      {v}
                    </div>
                    <div
                      className="font-mono text-[9px] uppercase"
                      style={{ color: "#6b7a99" }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="font-mono text-[11px] mb-3.5"
                style={{ color: "#6b7a99" }}
              >
                {admin.college || "—"} · {admin.branch || "—"} · Joined{" "}
                {fmtDate(admin.createdAt)}
              </div>

              <div className="flex gap-2">
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
