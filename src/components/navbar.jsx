import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from "../styles/nav.module.css";

function Nav() {
  return (
    <nav className={`${style.nav} navbar navbar-expand-lg`}>
      <div className="container-fluid">
        <h3 className={style.coc}>CLASH OF CLANS</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <i className="bi bi-calendar2-event"></i>
              </a>
            </li>
            <li className="nav-item">
              <button type="button" className="btn btn-outline-success">
                <i className="bi bi-headset"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
