// Main.jsx
import React, { useState, useEffect } from "react";
import style from "../styles/main.module.css";
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

const troops = [
  "Barbarian",
  "Archer",
  "Giant",
  "Goblin",
  "Wall Breaker",
  "Balloon",
  "Wizard",
  "Healer",
  "Dragon",
  "P.E.K.K.A.",
  "Baby Dragon",
  "Miner",
  "Electro Dragon",
  "Yeti",
  "Dragon Rider",
  "Electro Titan",
  "Minion",
  "Hog Rider",
  "Valkyrie",
  "Golem",
  "Witch",
  "Lava Hound",
  "Bowler",
  "Ice Golem",
  "Headhunter",
  "Apprentice Warden",
];

const buildings = [
  "Town Hall",
  "Cannon",
  "Archer Tower",
  "Mortar",
  "Air Defense",
  "Wizard Tower",
  "Air Sweeper",
  "Hidden Tesla",
  "Bomb Tower",
  "X-Bow",
  "Inferno Tower",
  "Eagle Artillery",
  "Builder's Hut",
  "Spell Tower",
  "Army Camp",
  "Barracks",
  "Dark Barracks",
];

const villages = ["Home Village", "Builder Base"];

export default function Main() {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [item, setItem] = useState("");
  const [village, setVillage] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor authentication state
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

    if (/^\d+:\d+$/.test(trimmed)) {
      const [a, b] = trimmed.split(":").map(Number);
      return a * 3600000 + b * 60000;
    }

    if (/^\d+$/.test(trimmed)) return Number(trimmed) * 60000;

    let total = 0;
    const h = /([0-9]+)h/.exec(trimmed);
    const m = /([0-9]+)m/.exec(trimmed);
    const s = /([0-9]+)s/.exec(trimmed);

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
    if (diff <= 0) return "Completed";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => setTasks((t) => [...t]), 1000);
    return () => clearInterval(interval);
  }, []);

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
                Loading...
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

              <select
                className={style.input}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setItem("");
                }}
              >
                <option value="">Select Type</option>
                <option value="Troop">Troop</option>
                <option value="Building">Building</option>
              </select>

              <select
                className={style.input}
                value={item}
                onChange={(e) => setItem(e.target.value)}
                disabled={!type}
              >
                <option value="">Select {type || "Item"}</option>
                {(type === "Troop" ? troops : buildings).map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <select
                className={style.input}
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              >
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <input
                className={style.input}
                type="text"
                placeholder="2h 30m / 90m / 1:30"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

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