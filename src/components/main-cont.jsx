// Main.jsx
import React, { useState, useEffect, useRef } from "react";
import style from "../styles/main.module.css";
import data from "../data.json";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auth, db } from "../userdata/firebase.js";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "./loader";

export default function Main() {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [item, setItem] = useState("");
  const [village, setVillage] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifPermission, setNotifPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  );
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time sync with Firebase
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      alert("Error loading tasks. Please refresh the page.");
    });

    return () => unsubscribe();
  }, [currentUser]);

  const convertTimeToMs = (str) => {
    if (!str) return 0;
    const trimmed = str.trim();

    // support HH:MM and HH:MM:SS (hours:minutes(:seconds))
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
    if (!currentUser) {
      return alert("Please sign in to add upgrades.");
    }

    if (!type || !item || !village || !time) {
      return alert("Fill all fields.");
    }

    const durationMs = convertTimeToMs(time);
    if (durationMs <= 0) {
      return alert("Invalid time format.");
    }

    try {
      const tasksRef = collection(db, "tasks");
      await addDoc(tasksRef, {
        userId: currentUser.uid,
        type,
        item,
        village,
        time,
        endTime: Date.now() + durationMs,
        createdAt: serverTimestamp()
      });

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
    const diff = end - Date.now();
    if(diff <= 0){
      return <p style={{color: "#99ff00ff", textAlign: "center", fontWeight: "bold",display: "inline" , fontSize: "20px"}}><i className="bi bi-check2-circle"></i></p>
    };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => setTasks((t) => [...t]), 1000);
    return () => clearInterval(interval);
  }, []);

  // Request notification permission when user clicks the enable button
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

  // Watch tasks and notify when they complete (once per task)
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const tick = () => {
      // prune notified ids that no longer exist
      const currentIds = new Set(tasks.map((t) => t.id));
      for (const id of Array.from(notifiedRef.current)) {
        if (!currentIds.has(id)) notifiedRef.current.delete(id);
      }

      if (notifPermission !== "granted") return;

      tasks.forEach((t) => {
        if (!t.id || !t.endTime) return;
        if (t.endTime <= Date.now() && !notifiedRef.current.has(t.id)) {
          try {
            new Notification(`${t.type} Complete`, {
              body: `${t.item} in ${t.village} has completed.`,
              tag: t.id,
            });
          } catch (e) {
            console.error("Notification failed:", e);
          }
          notifiedRef.current.add(t.id);
        }
      });
    };

    const id = setInterval(tick, 1000);
    // run immediately once
    tick();
    return () => clearInterval(id);
  }, [tasks, notifPermission]);

  // Return list of type options depending on selected village
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

  // Given a selected type and village, return the appropriate items list from data.json
  const getItemsForType = (typeName, villageName) => {
    if (!typeName) return [];

    let items = [];
    switch (typeName) {
      case "Troop":
        items = villageName === "Builder Base"
          ? data.BuilderBaseTroops || []
          : data.HomeVillageTroops || [];
        break;
      case "Building":
        items = villageName === "Builder Base"
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
        items = villageName === "Builder Base"
          ? data.BuilderBaseHeroes || []
          : data.HomeVillageHeroes || [];
        break;
      default:
        items = [];
    }
    return [...items].sort();
  };

  const removeTask = async (taskId) => {
    if (!currentUser) return;

    try {
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);
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

  if (!currentUser) {
    return (
      <div className="parent">
        <div className={style.contCard}>
          <div className={style.row}>
            <div className={style.col4}>
              <div className={style.cardBox}>
                Please sign in to manage your upgrades.
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
            className={style.btn}
            onClick={requestNotifications}
            disabled={notifPermission === "granted"}
            style={{ marginLeft: "8px" }}
          >
            <i className="bi bi-bell"></i>{" "}
            {notifPermission === "granted" ? "Notifications On" : "Enable Notifications"}
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
              <div key={t.id} className={style.col4}>
                <div className={style.cardBox}>
                  <h4 className={style.name}>
                    {t.type}: {t.item}
                  </h4>
                  <p>Village: {t.village}</p>
                  <p>Time Set: {t.time}</p>
                  <p>Remaining: {formatRemaining(t.endTime)}</p>
                  <button
                    className={style.btn}
                    onClick={() => removeTask(t.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modalBox}>
              <h2>Add Upgrade</h2>

              {/* Progressive form: village -> type -> item -> time */}
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

              {/* Show type options only after village is selected */}
              {village && (
                <select
                  className={style.input}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setItem("");
                  }}
                >
                  <option value="">Select Type</option>
                  {getTypeOptionsByVillage(village).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}

              {/* Show item select only after a type is chosen */}
              {type && (
                <select
                  className={style.input}
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                >
                  <option value="">Select {type}</option>
                  {getItemsForType(type, village).map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              )}

              {/* Show time input once an item is chosen (or allow entering time after type if desired) */}
              {(type || item) && (
                <input
                  className={style.input}
                  type="text"
                  placeholder="1d 2h / 2h 30m / 90m / 1:30 / 1:02:03"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              )}

              <div className={style.modalBtns}>
                <button className={style.btn} onClick={addTask}>
                  Add
                </button>
                <button
                  className={style.btn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );
}