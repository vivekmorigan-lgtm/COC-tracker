import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import style from "../styles/land.module.css";

export default function Land() {
  const [view, setView] = useState("landing");
  const [subscribeStatus, setSubscribeStatus] = useState(""); 
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleBack = () => setView("landing");
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    setSubscribeStatus("subscribing");
    setSubscribeMessage("");

    try {
      const response = await fetch("https://formspree.io/f/myznnlqp", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setSubscribeStatus("success");
        setSubscribeMessage("Thanks for subscribing!");
        form.reset();
      } else {
        const data = await response.json();
        const errorMessage = data.errors?.map((error) => error.message).join(", ") || "Oops! There was a problem submitting your form";
        throw new Error(errorMessage);
      }
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage(error.message);
    }
  };

  if (view === "login") {
    return (
      <Login onSwitchToSignUp={() => setView("signup")} onBack={handleBack} />
    );
  }

  if (view === "signup") {
    return (
      <SignUp onSwitchToLogin={() => setView("login")} onBack={handleBack} />
    );
  }

  return (
    <div className={style.landingPage}>
      <header className={style.header}>
        <h1 className={style.logo}>COC Tracker</h1>
        <div className={style.authButtons}>
          <button className={style.loginBtn} onClick={() => setView("login")}>
            Login
          </button>
          <button className={style.signupBtn} onClick={() => setView("signup")}>
            Sign Up
          </button>
        </div>
      </header>

      <main>
        {}
        <section className={style.hero}>
          <div className={style.heroContent}>
            <h2 className={style.heroTitle}>
              Master Your Clan, Track Your Progress
            </h2>
            <p className={style.heroDescription}>
              The ultimate tool to track your Clash of Clans upgrades, manage
              your resources, and plan your village progress like a pro! Get
              started for free.
            </p>
          </div>
          <div className={style.imgPlaceholder}>
           <div className={style.imgMockup}></div>
          </div>
        </section>

        {}
        <section className={style.features}>
          <h3 className={style.sectionTitle}>Why Use COC Tracker?</h3>
          <div className={style.featureGrid}>
            <div className={style.featureCard}>
              <h4>Upgrade Timers</h4>
              <p>
                Add and monitor real-time timers for all your building and troop
                upgrades.
              </p>
              <div className={style.featureIcon}></div>
            </div>
            <div className={style.featureCard}>
              <h4>Multi-Village Support</h4>
              <p>
                Easily switch between tracking your Home Village and Builder
                Base progress.
              </p>
              <div className={style.featureIcon2}></div>
               <div className={style.featureIcon3}></div>
            </div>
            <div className={style.featureCard}>
              <h4>Persistent Data</h4>
              <p>
                Your upgrade list is saved, so you can pick up right where you
                left off.
              </p>
              <i className={`${style.Icon} bi bi-database-add`}></i>
              <div className={style.featureIcon4}></div>
            </div>
            <div className={style.featureCard}>
              <h4>User-Friendly Interface</h4>
              <p>
                Intuitive design makes it easy to add, edit, and track your
                upgrades.
              </p>
              <i className={`${style.Icon} bi bi-person-hearts`}></i>
            </div>
            <div className={style.featureCard}>
              <h4>Free to Use</h4>
              <p>
                All features are available for free. No hidden costs or premium
                plans.
              </p>
              <i className={`${style.Icon} bi bi-gift`}></i>
            </div>
            <div className={style.featureCard}>
              <h4>Cross-Platform</h4>
              <p>
                Access your upgrade tracker from any device, anytime.
              </p>
              <i className={`${style.Icon} bi bi-phone`}></i>
            </div>
          </div>
        </section>

        {}
        <section className={style.about}>
          <h3 className={style.sectionTitle}>From a Clasher, For Clashers</h3>
          <div className={style.aboutContent}>
            <div className={style.avatarPlaceholder}></div>
            <p>
              {}
              As a passionate Clash of Clans player, I built this tool to solve
              a problem I always had: managing upgrade timers efficiently. My
              goal is to help you strategize better and enjoy the game more.
            </p>
          </div>
        </section>
      </main>
      <footer className={style.footer}>
        <div className={style.footerContainer}>
          <div className={style.footerGrid}>
            <div className={style.footerBrand}>
              <h4 className={style.logo}>COC Tracker</h4>
              <p className={style.brandTag}>Master your Clan — Track your Progress</p>
            </div>

            <div className={style.footerColumn}>
              <h5 className={style.colTitle}>Product</h5>
              <ul className={style.colList}>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#">Roadmap</a></li>
              </ul>
            </div>

            <div className={style.footerColumn}>
              <h5 className={style.colTitle}>Resources</h5>
              <ul className={style.colList}>
                <li>
                  <a href="https://github.com/vivekmorigan-lgtm/COC-tracker" target="_blank" rel="noopener noreferrer">
                    Source code
                  </a>
                </li>
                <li><a href="#">Docs</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>

            <div className={style.footerColumn}>
              <h5 className={style.colTitle}>Stay Updated</h5>
              <form onSubmit={handleSubscribe} className={style.subscribeForm} noValidate>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  aria-label="Email"
                  required
                  className={style.subscribeInput}
                />
                <button type="submit" className={style.subscribeBtn} disabled={subscribeStatus === 'subscribing'}>
                  {subscribeStatus === 'subscribing' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {subscribeMessage && (
                <p className={`${style.subscribeMessage} ${subscribeStatus === 'error' ? style.error : style.success}`}>
                  {subscribeMessage}
                </p>
              )}

              <div className={style.socialRow}>
                <a href="mailto:Twinzler@proton.me" title="Email" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-envelope-fill"></i>
                </a>
                <a href="https://github.com/vivekmorigan-lgtm" title="GitHub" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-github"></i>
                </a>
                <a href="https://discord.com/users/1406246927300821032" title="Discord" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-discord"></i>
                </a>
              </div>
            </div>
          </div>

          <div className={style.footerBottom}>
            <p>© {new Date().getFullYear()} COC Tracker. All rights reserved.</p>
            <nav className={style.footerNav}>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
