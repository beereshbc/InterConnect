import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bell,
  Pin,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  SendHorizontal,
} from "lucide-react";
import {
  SALayout,
  SA_ACCENT,
  Pill,
  Badge,
  SABtn,
  SAToast,
  Spinner,
  fmtDate,
} from "./SALayout";

// Axios instance matching your pattern
const saAxios = () =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Ensure this maps correctly
    headers: { Authorization: `Bearer ${localStorage.getItem("saToken")}` },
  });

const SANotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isPublished: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await saAxios().get("/api/admin/sa/notifications");
      setNotifications(data.notifications || []);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to load notifications.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message)
      return showToast("Title and message are required", "warn");

    try {
      setIsSubmitting(true);
      const { data } = await saAxios().post(
        "/api/admin/sa/notifications",
        formData,
      );
      showToast(data.message, "success");
      setFormData({ title: "", message: "", type: "info", isPublished: false });
      fetchNotifications();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAction = async (id, action) => {
    try {
      const { data } = await saAxios().patch(
        `/api/admin/sa/notifications/${id}/${action}`,
      );
      showToast(data.message, "success");
      fetchNotifications();
    } catch (err) {
      showToast(err?.response?.data?.message || "Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification permanently?")) return;
    try {
      const { data } = await saAxios().delete(
        `/api/admin/sa/notifications/${id}`,
      );
      showToast(data.message, "success");
      fetchNotifications();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const getTypeColors = (type) => {
    switch (type) {
      case "alert":
        return {
          icon: <AlertCircle size={20} className="text-[#f87171]" />,
          color: "#f87171",
        };
      case "success":
        return {
          icon: <CheckCircle size={20} className="text-[#4ade80]" />,
          color: "#4ade80",
        };
      case "update":
        return {
          icon: <Clock size={20} className="text-[#fbbf24]" />,
          color: "#fbbf24",
        };
      default:
        return {
          icon: <Info size={20} className="text-[#3a9de8]" />,
          color: "#3a9de8",
        };
    }
  };

  return (
    <SALayout
      title="Broadcast Center"
      subtitle="Manage announcements and trigger instant email broadcasts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <div
            className="rounded-2xl p-6"
            style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
          >
            <h2
              className="font-display text-[18px] font-extrabold mb-5"
              style={{ color: "#f0f4ff" }}
            >
              New Announcement
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Title */}
              <div>
                <label
                  className="block font-mono text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "#6b7a99" }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Hackathon Deadline Extended"
                  className="w-full rounded-xl font-mono text-[12px] outline-none transition-all"
                  style={{
                    background: "#060810",
                    border: "1px solid #1e2330",
                    padding: "12px 14px",
                    color: "#f0f4ff",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = SA_ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block font-mono text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "#6b7a99" }}
                >
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Details of the announcement..."
                  className="w-full rounded-xl font-mono text-[12px] outline-none min-h-[120px] resize-y transition-all"
                  style={{
                    background: "#060810",
                    border: "1px solid #1e2330",
                    padding: "12px 14px",
                    color: "#f0f4ff",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = SA_ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
                />
              </div>

              {/* Type Selection */}
              <div>
                <label
                  className="block font-mono text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "#6b7a99" }}
                >
                  Category
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full rounded-xl font-mono text-[12px] outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    background: "#060810",
                    border: "1px solid #1e2330",
                    padding: "12px 14px",
                    color: "#f0f4ff",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = SA_ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
                >
                  <option value="info">Information (Blue)</option>
                  <option value="update">Update (Yellow)</option>
                  <option value="success">Success (Green)</option>
                  <option value="alert">Alert (Red)</option>
                </select>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 pt-2 pb-4">
                <input
                  type="checkbox"
                  id="publish"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 cursor-pointer accent-[#3a9de8]"
                />
                <label
                  htmlFor="publish"
                  className="font-mono text-[11px] cursor-pointer"
                  style={{ color: "#c4cedf" }}
                >
                  Publish & Broadcast Email Instantly
                </label>
              </div>

              {/* Submit Button */}
              <SABtn
                onClick={handleCreate}
                disabled={isSubmitting}
                className="w-full justify-center py-3"
              >
                {isSubmitting ? (
                  "Processing..."
                ) : formData.isPublished ? (
                  <span className="flex items-center gap-2">
                    <SendHorizontal size={16} /> Broadcast Now
                  </span>
                ) : (
                  "Save as Draft"
                )}
              </SABtn>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-7 xl:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <Spinner size={32} />
              <p className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
                Loading broadcasts…
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div
              className="text-center font-mono text-[13px] mt-24"
              style={{ color: "#4a5568" }}
            >
              <Bell className="mx-auto mb-4 opacity-30" size={40} />
              No announcements broadcasted yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {notifications.map((notif, i) => {
                  const { icon, color } = getTypeColors(notif.type);
                  return (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-2xl p-5 sm:p-6 transition-all"
                      style={{
                        background: "#0c0f18",
                        border: `1px solid ${notif.isPinned ? `${SA_ACCENT}50` : "#1e2330"}`,
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
                        {/* Content */}
                        <div className="flex gap-4 flex-1">
                          <div className="mt-1 shrink-0 bg-[#060810] p-2.5 rounded-xl border border-[#1e2330]">
                            {icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3
                                className="font-display text-[16px] sm:text-[18px] font-bold"
                                style={{ color: "#f0f4ff" }}
                              >
                                {notif.title}
                              </h3>
                              {notif.isPinned && (
                                <Badge color={SA_ACCENT}>Pinned</Badge>
                              )}
                              {!notif.isPublished && (
                                <Badge color="#f87171">Draft</Badge>
                              )}
                            </div>

                            <p
                              className="font-sans text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap mb-4"
                              style={{ color: "#8892a4" }}
                            >
                              {notif.message}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="font-mono text-[10px] uppercase tracking-widest"
                                style={{ color: "#4a5568" }}
                              >
                                {fmtDate(notif.createdAt)}
                              </span>
                              {notif.emailSent && (
                                <>
                                  <span className="text-[#4a5568]">•</span>
                                  <span className="font-mono text-[10px] text-[#4ade80] uppercase tracking-widest flex items-center gap-1">
                                    <Send size={10} /> Broadcasted
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-[#1e2330] pt-4 sm:pt-0 sm:pl-4 justify-end sm:justify-start">
                          <button
                            onClick={() => handleToggleAction(notif._id, "pin")}
                            className="p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center group"
                            style={{
                              background: notif.isPinned
                                ? `${SA_ACCENT}20`
                                : "#060810",
                              border: "1px solid #1e2330",
                            }}
                            title={notif.isPinned ? "Unpin" : "Pin"}
                          >
                            <Pin
                              size={16}
                              color={notif.isPinned ? SA_ACCENT : "#6b7a99"}
                              className="group-hover:scale-110 transition-transform"
                            />
                          </button>

                          <button
                            onClick={() =>
                              handleToggleAction(notif._id, "publish")
                            }
                            className="p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center group"
                            style={{
                              background: notif.isPublished
                                ? "#4ade8020"
                                : "#060810",
                              border: "1px solid #1e2330",
                            }}
                            title={
                              notif.isPublished
                                ? "Unpublish"
                                : "Publish & Broadcast"
                            }
                          >
                            <Send
                              size={16}
                              color={notif.isPublished ? "#4ade80" : "#6b7a99"}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </button>

                          <button
                            onClick={() => handleDelete(notif._id)}
                            className="p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center group hover:bg-[#f8717115] hover:border-[#f8717150]"
                            style={{
                              background: "#060810",
                              border: "1px solid #1e2330",
                            }}
                            title="Delete"
                          >
                            <Trash2
                              size={16}
                              color="#6b7a99"
                              className="group-hover:text-[#f87171] transition-colors"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

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

export default SANotification;
