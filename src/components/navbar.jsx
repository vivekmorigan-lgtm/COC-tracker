import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../styles/nav.module.css";

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className={style.nav}>
        <h3 className={style.coc}>CLASH OF CLANS</h3>

        {/* Desktop Icons */}
        <div className={style.desktopIcons}>
          <button className={style.btn}>
            <i className="bi bi-calendar2-event"></i>
          </button>
          <button className={style.btn}>
            <i className="bi bi-headset"></i>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className={style.menu} onClick={() => setOpen(true)}>
          <i className="bi bi-list"></i>
        </button>
      </nav>

      {/* MOBILE SIDE PANEL */}
      <div className={`${style.sidePanel} ${open ? style.show : ""}`}>
        <button className={style.closeBtn} onClick={() => setOpen(false)}>
          <i className="bi bi-x-lg"></i>
        </button>

        <button className={style.panelBtn}>
          <i className="bi bi-calendar2-event"></i> Upgrade Timer
        </button>

        <button className={style.panelBtn}>
          <i className="bi bi-headset"></i> Support
        </button>
      </div>

      {open && <div className={style.backdrop} onClick={() => setOpen(false)} />}
    </>
  );
}

export default Nav;
