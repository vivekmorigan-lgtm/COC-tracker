import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../styles/main.module.css";

// Troops list
const troops = [
  "Barbarian", "Archer", "Giant", "Goblin", "Wall Breaker",
  "Balloon", "Wizard", "Healer", "Dragon", "P.E.K.K.A.",
  "Baby Dragon", "Miner", "Electro Dragon", "Yeti",
  "Dragon Rider", "Electro Titan",
  "Minion", "Hog Rider", "Valkyrie", "Golem",
  "Witch", "Lava Hound", "Bowler", "Ice Golem",
  "Headhunter", "Apprentice Warden"
];

// Buildings list
const buildings = [
  "Town Hall", "Cannon", "Archer Tower", "Mortar", "Air Defense",
  "Wizard Tower", "Air Sweeper", "Hidden Tesla", "Bomb Tower",
  "X-Bow", "Inferno Tower", "Eagle Artillery",
  "Builder's Hut", "Spell Tower",
  "Army Camp", "Barracks", "Dark Barracks"
];

const villages = ["Home Village", "Builder Base", "Clan Capital"];

function Main() {
  const [type, setType] = useState("");
  const [item, setItem] = useState("");
  const [village, setVillage] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = () => {
    if (!type || !item || !village || !time) {
      alert("Please fill all fields");
      return;
    }

    console.log("Added:", {
      type,
      item,
      village,
      time
    });

    // you can save into list state when needed
    setType("");
    setItem("");
    setVillage("");
    setTime("");
  };

  return (
    <>
      <div className={style.contBtn}>
        <div className="row g-2">

          {/* TYPE */}
          <div className="col-3">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setItem("");
              }}
              className={style.input}
            >
              <option value="">Type</option>
              <option value="Troop">Troop</option>
              <option value="Building">Building</option>
            </select>
          </div>

          {/* ITEM */}
          <div className="col-3">
            <select
              value={item}
              onChange={(e) => setItem(e.target.value)}
              disabled={!type}
              className={style.input}
            >
              <option value="">Select {type || "Item"}</option>
              {(type === "Troop" ? troops : buildings).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* VILLAGE */}
          <div className="col-3">
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className={style.input}
            >
              <option value="">Village</option>
              {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* TIME INPUT */}
          <div className="col-3">
            <input
              type="text"
              placeholder="Time e.g. 2h 30m"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={style.input}
            />
          </div>

          {/* ADD BUTTON */}
          <div className="col-12 mt-2">
            <button type="button" className={style.btn} onClick={handleAdd}>
              <i className="bi bi-plus-circle"></i> Add Upgrade
            </button>
          </div>

        </div>
      </div>

      {/* DISPLAY */}
      <div className={style.contCard}>
        <div className="grid text-center">
          <div className={`${style.card} g-col-6 g-col-md-4`}>
            <p>After you add, you can show details here.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
