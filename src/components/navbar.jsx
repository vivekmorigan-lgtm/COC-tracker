import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../styles/nav.module.css";

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className={style.nav}>
        <h3 className={style.coc}>CLASH OF CLANS</h3>

        {}
        <div className={style.desktopIcons}>
          <button className={style.btn} onClick={() => window.open("https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=twinzler@proton.me", "_blank")}>
            <i className="bi bi-headset"></i>
          </button>
          <button className={style.btn} onClick={() => window.open("https://github.com/vivekmorigan-lgtm", "_blank")}>
            <i className="bi bi-github"></i>
          </button>
          <button className={style.btn} onClick={() => window.open("https://discord.com/users/1406246927300821032", "_blank")}>
            <i className="bi bi-discord"></i>
          </button>
        </div>

        {}
        <button className={style.menu} onClick={() => setOpen(true)}>
          <i className="bi bi-list"></i>
        </button>
      </nav>

      {}
      <div className={`${style.sidePanel} ${open ? style.show : ""}`}>
        <button className={style.closeBtn} onClick={() => setOpen(false)}>
          <i className="bi bi-x-lg"></i>
        </button>

       <button className={style.panelBtn} onClick={() => window.open("https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=twinzler@proton.me", "_blank")}>
            <i className="bi bi-headset"></i> Contact
          </button>
          <button className={style.panelBtn} onClick={() => window.open("https://github.com/vivekmorigan-lgtm", "_blank")}>
            <i className="bi bi-github"></i> Github
          </button>
          <button className={style.panelBtn} onClick={() => window.open("https://discord.com/users/1406246927300821032", "_blank")}>
            <i className="bi bi-discord"></i> Discord
          </button>
      </div>

      {open && <div className={style.backdrop} onClick={() => setOpen(false)} />}
    </>
  );
}

export default Nav;
