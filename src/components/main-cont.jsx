import React, { useState, useEffect, useRef } from "react";
import style from "../styles/main.module.css";
import data from "../data.json";
import "bootstrap-icons/font/bootstrap-icons.css";
import apiService from "../services/api";
import Loader from "./loader";

export default function Main() {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [item, setItem] = useState("");
  const [village, setVillage] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [notifPermission, setNotifPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  );
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await apiService.getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Error loading tasks. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const convertTimeToMs = (str) => {
    if (!str) return 0;
    const trimmed = str.trim();

    if (/^\d+:\d+:\d+$/.test(trimmed)) {
      const [a, b, c] = trimmed.split(":").map(Number);
      return a * 3600000 + b * 60000 + c * 1000;
    }

    if (/^\d+:\d+$/.test(trimmed)) {
      const [a, b] = trimmed.split(":").map(Number);
      return a * 3600000 + b * 60000;
    }

    if (/^\d+$/.test(trimmed)) return Number(trimmed) * 60000;

    let total = 0;
    const d = /([0-9]+)d/.exec(trimmed);
    const h = /([0-9]+)h/.exec(trimmed);
    const m = /([0-9]+)m/.exec(trimmed);
    const s = /([0-9]+)s/.exec(trimmed);

    if (d) total += Number(d[1]) * 86400000;
    if (h) total += Number(h[1]) * 3600000;
    if (m) total += Number(m[1]) * 60000;
    if (s) total += Number(s[1]) * 1000;

    return total;
  };

  const addTask = async () => {
    if (!type || !item || !village || !time) {
      return alert("Fill all fields.");
    }

    const durationMs = convertTimeToMs(time);
    if (durationMs <= 0) {
      return alert("Invalid time format.");
    }

    try {
      const newTask = await apiService.createTask({
        type,
        item,
        village,
        time,
        endTime: Date.now() + durationMs,
      });

      setTasks([...tasks, newTask]);
      setShowModal(false);
      setType("");
      setItem("");
      setVillage("");
      setTime("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add upgrade. Please try again.");
    }
  };

  const formatRemaining = (end) => {
    const diff = end - now;
    if (diff <= 0) {
      return (
        <p
          style={{
            color: "#99ff00ff",
            textAlign: "center",
            fontWeight: "bold",
            display: "inline",
            fontSize: "20px",
          }}
        >
          <i className="bi bi-check2-circle"></i>
        </p>
      );
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((t) => [...t]);
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const requestNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === "granted") {
        try {
          new Notification("Notifications enabled", {
            body: "You'll get notified when upgrades complete.",
          });
        } catch (e) {
          console.error("Notification error:", e);
        }
      }
    } catch (err) {
      console.error("Permission request failed:", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const tick = () => {
      const currentIds = new Set(tasks.map((t) => t._id));
      for (const id of Array.from(notifiedRef.current)) {
        if (!currentIds.has(id)) notifiedRef.current.delete(id);
      }

      if (notifPermission !== "granted") return;

      tasks.forEach((t) => {
        if (!t._id || !t.endTime) return;
        if (t.endTime <= Date.now() && !notifiedRef.current.has(t._id)) {
          try {
            new Notification(`${t.type} Complete`, {
              body: `${t.item} in ${t.village} has completed.`,
              tag: t._id,
            });
          } catch (e) {
            console.error("Notification failed:", e);
          }
          notifiedRef.current.add(t._id);
        }
      });
    };

    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [tasks, notifPermission]);

  const getTypeOptionsByVillage = (villageName) => {
    if (!villageName) return [];
    let types = [];
    if (villageName === "Home Village") {
      types = ["Troop", "Building", "Unit", "Hero", "Spell"];
    } else if (villageName === "Builder Base") {
      types = ["Troop", "Building", "Hero"];
    } else {
      types = ["Troop", "Building"];
    }
    return types.sort();
  };

  const getItemsForType = (typeName, villageName) => {
    if (!typeName) return [];

    let items = [];
    switch (typeName) {
      case "Troop":
        items =
          villageName === "Builder Base"
            ? data.BuilderBaseTroops || []
            : data.HomeVillageTroops || [];
        break;
      case "Building":
        items =
          villageName === "Builder Base"
            ? data.BuilderBaseBuildings || []
            : data.HomeVillageBuildings || [];
        break;
      case "Unit":
        items = data.units || [];
        break;
      case "Spell":
        items = data.spells || [];
        break;
      case "Hero":
        items =
          villageName === "Builder Base"
            ? data.BuilderBaseHeroes || []
            : data.HomeVillageHeroes || [];
        break;
      default:
        items = [];
    }
    return [...items].sort();
  };

  const removeTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error("Error removing task:", error);
      alert("Failed to remove upgrade. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="parent">
        <div className={style.contCard}>
          <div className={style.row}>
            <div className={style.col4}>
              <div className={style.cardBox}>
                <Loader />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="parent">
        <div className={style.contBtn}>
          <button className={style.btn} onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle"></i> Add Upgrade
          </button>
          <button
            className={style.btnAlt}
            onClick={requestNotifications}
            disabled={notifPermission === "granted"}
            style={{ marginLeft: "8px" }}
          >
            <i className="bi bi-bell"></i>{" "}
            {notifPermission === "granted"
              ? "Notifications On"
              : "Enable Notifications"}
          </button>
        </div>
        <div className={style.contCard}>
          <div className={style.row}>
            {tasks.length === 0 && (
              <div className={style.col4}>
                <div className={style.cardBox}>
                  No upgrades yet.<div className={style.king}></div>
                </div>
              </div>
            )}

            {tasks.map((t) => (
              <div key={t._id} className={style.col4}>
                <div className={style.cardBox}>
                  <div
                    className={style.cardHeader}
                    style={{
                      backgroundImage:
                        t.village === "Home Village"
                          ? "url('/img/Home.jpg')"
                          : "url('/img/builder.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <h4 className={style.name}>
                      {t.item}{" "}
                      <button
                        className={style.delbtn}
                        onClick={() => removeTask(t._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>{" "}
                    </h4>
                  </div>
                  <div className={style.cardBody}>
                    <div className={style.infoRow}>
                      <span className={style.infoLabel}>Type</span>
                      <span className={style.infoValue}>{t.type}</span>
                    </div>
                    <div className={style.infoRow}>
                      <span className={style.infoLabel}>Time Set</span>
                      <span className={style.infoValue}>{t.time}</span>
                    </div>
                    <div className={style.infoRow}>
                      <span className={style.infoLabel}>Remaining</span>
                      <span className={style.infoValue}>
                        {formatRemaining(t.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modalBox}>
              <h2>Add Upgrade</h2>
              <select
                className={style.input}
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  setType("");
                  setItem("");
                }}
              >
                <option value="">Select Village</option>
                {data.villages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <select
                className={style.input}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setItem("");
                }}
                disabled={!village}
              >
                <option value="">Select Type</option>
                {village &&
                  getTypeOptionsByVillage(village).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>

              <select
                className={style.input}
                value={item}
                onChange={(e) => setItem(e.target.value)}
                disabled={!type}
              >
                <option value="">Select {type || "Item"}</option>
                {type &&
                  getItemsForType(type, village).map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
              </select>

              <input
                className={style.input}
                type="text"
                placeholder="1d 2h / 2h 30m / 90m / 1:30 / 1:02:03"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!type && !item}
              />

              <div className={style.modalBtns}>
                <button
                  className={style.btnAlt}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className={style.btn} onClick={addTask}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
