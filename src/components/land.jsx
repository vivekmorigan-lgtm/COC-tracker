import React, { useState, useRef } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import style from "../styles/land.module.css";
import { motion as motion, useReducedMotion } from "framer-motion";
import { variants } from "../Script/animationVariants";

export default function Land({ setIsAuthenticated }) {
  const [view, setView] = useState("landing");
  const [subscribeStatus, setSubscribeStatus] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);

  const handleBack = () => setView("landing");

  const handleAuthSuccess = () => {
    if (setIsAuthenticated) {
      setIsAuthenticated(true);
    }
  };

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
        const errorMessage =
          data.errors?.map((error) => error.message).join(", ") ||
          "Oops! There was a problem submitting your form";
        throw new Error(errorMessage);
      }
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage(error.message);
    }
  };

  if (view === "login") {
    return (
      <Login
        onSwitchToSignUp={() => setView("signup")}
        onBack={handleBack}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignUp
        onSwitchToLogin={() => setView("login")}
        onBack={handleBack}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <motion.div
      className={style.landingPage}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      variants={variants.page}
    >
      <motion.header
        className={style.header}
        variants={variants.section}
        aria-label="Top navigation"
      >
        <h1 className={style.logo}>Chiefs.io</h1>
        <div className={style.authButtons}>
          <motion.button
            className={style.loginBtn}
            onClick={() => setView("login")}
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            Login
          </motion.button>
          <motion.button
            className={style.signupBtn}
            onClick={() => setView("signup")}
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.header>

      <main>
        <motion.section className={style.hero} variants={variants.section}>
          <motion.div className={style.heroContent} variants={variants.section}>
            <motion.h2 className={style.heroTitle} variants={variants.section}>
              Master Your Clan, Track Your Progress
            </motion.h2>
            <motion.p
              className={style.heroDescription}
              variants={variants.section}
            >
              The ultimate tool to track your Clash of Clans upgrades, manage
              your resources, and plan your village progress like a pro! Get
              started for free.
            </motion.p>
            <motion.div
              variants={variants.section}
              className={style.heroActions}
              aria-hidden={false}
            >
              <motion.button
                className={style.signupBtn}
                onClick={() => setView("signup")}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                Get Started — Free
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className={style.imgPlaceholder}
            variants={variants.heroImage}
            aria-hidden
          >
            <motion.div
              className={style.imgMockup}
              variants={variants.heroImage}
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              transition={{ duration: 0.35 }}
            ></motion.div>
          </motion.div>
        </motion.section>

        {}
        <motion.section className={style.features} variants={variants.section}>
          <h3 className={style.sectionTitle}>Why Use Chiefs.io?</h3>
          <div className={style.featureGrid}>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -6, boxShadow: "0px 12px 30px rgba(2, 6, 23, 0.12)" }
              }
            >
              <h4>Upgrade Timers</h4>
              <p>
                Add and monitor real-time timers for all your building and troop
                upgrades.
              </p>
              <div className={style.featureIcon}></div>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>Multi-Village Support</h4>
              <p>
                Easily switch between tracking your Home Village and Builder
                Base progress.
              </p>
              <div className={style.featureIcon2}></div>
              <div className={style.featureIcon3}></div>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>Persistent Data</h4>
              <p>
                Your upgrade list is saved, so you can pick up right where you
                left off.
              </p>
              <i className={`${style.Icon} bi bi-database-add`}></i>
              <div className={style.featureIcon4}></div>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>User-Friendly Interface</h4>
              <p>
                Intuitive design makes it easy to add, edit, and track your
                upgrades.
              </p>
              <i className={`${style.Icon} bi bi-person-hearts`}></i>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>Free to Use</h4>
              <p>
                All features are available for free. No hidden costs or premium
                plans.
              </p>
              <i className={`${style.Icon} bi bi-gift`}></i>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>Cross-Platform</h4>
              <p>Access your upgrade tracker from any device, anytime.</p>
              <i className={`${style.Icon} bi bi-phone`}></i>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>Access Your account</h4>
              <p>Access your account from coc api based features.</p>
              <i className={`${style.Icon} bi bi-person-circle`}></i>
            </motion.div>
            <motion.div
              className={style.featureCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
            >
              <h4>We value your privacy</h4>
              <p>We do not collect or share your personal data.</p>
              <i className={`${style.Icon} bi bi-person-circle`}></i>
            </motion.div>
          </div>
        </motion.section>

        {}
        <motion.section className={style.howTo} variants={variants.section}>
          <h3 className={style.sectionTitle}>How to Use Chiefs.io</h3>
          <div className={style.stepsContainer}>
            <motion.div
              className={style.stepCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
            >
              <div className={style.stepNumber}>1</div>
              <h4>Sign Up</h4>
              <p>
                Create your free account in seconds. No credit card required.
              </p>
            </motion.div>
            <motion.div
              className={style.stepCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
            >
              <div className={style.stepNumber}>2</div>
              <h4>Add Your Upgrades</h4>
              <p>
                Enter the buildings, troops, or defenses you're currently
                upgrading.
              </p>
            </motion.div>
            <motion.div
              className={style.stepCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
            >
              <div className={style.stepNumber}>3</div>
              <h4>Set Timers</h4>
              <p>
                Input the upgrade duration and the tracker will monitor the
                countdown.
              </p>
            </motion.div>
            <motion.div
              className={style.stepCard}
              variants={variants.card}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
            >
              <div className={style.stepNumber}>4</div>
              <h4>Track Progress</h4>
              <p>
                Check back anytime to see real-time progress and plan your next
                move.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {}
        <motion.section className={style.about} variants={variants.section}>
          <h3 className={style.sectionTitle}>From a Clasher, For Clashers</h3>
          <div className={style.aboutContent}>
            <motion.div
              className={style.avatarPlaceholder}
              variants={variants.section}
              aria-hidden
            ></motion.div>
            <p>
              {}
              As a passionate Clash of Clans player, I built this tool to solve
              a problem I always had: managing upgrade timers efficiently. My
              goal is to help you strategize better and enjoy the game more.
            </p>
          </div>
          <motion.div
            className={style.heroCont}
            ref={heroRef}
            variants={variants.section}
            aria-hidden
          >
            <h1 className={style.headHero}>Clash Of Clans</h1>
            <motion.div
              className={style.king2}
              variants={variants.section}
              aria-hidden
            ></motion.div>
            <motion.div
              className={style.queen}
              variants={variants.section}
              aria-hidden
            ></motion.div>
            <motion.div
              className={style.wardern}
              variants={variants.section}
              aria-hidden
            ></motion.div>
            <motion.div
              className={style.champ}
              variants={variants.section}
              aria-hidden
            ></motion.div>
          </motion.div>
        </motion.section>
      </main>
      <footer className={style.footer}>
        <div className={style.footerContainer}>
          <motion.div className={style.footerGrid} variants={variants.section}>
            <div className={style.footerBrand}>
              <h4 className={style.logo}>Chiefs.io</h4>
              <p className={style.brandTag}>
                Master your Clan — Track your Progress
              </p>
            </div>

            <motion.div
              className={style.footerColumn}
              variants={variants.section}
            >
              <h5 className={style.colTitle}>More Product</h5>
              <ul className={style.colList}>
                <li>
                  <a href="https://philast.pages.dev/">Philast</a>
                </li>
                <li>
                  <a href="https://homepage015.pages.dev/">Homepage</a>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className={style.footerColumn}
              variants={variants.section}
            >
              <h5 className={style.colTitle}>Quick links</h5>
              <ul className={style.colList}>
                <li>
                  <a href="#" onClick={() => setView("landing")}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setView("signup")}>
                    Sign Up
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className={style.footerColumn}
              variants={variants.section}
            >
              <h5 className={style.colTitle}>Stay Updated</h5>
              <motion.form
                onSubmit={handleSubscribe}
                className={style.subscribeForm}
                noValidate
                initial={shouldReduceMotion ? "visible" : "hidden"}
                animate="visible"
                variants={variants.section}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  aria-label="Email"
                  required
                  className={style.subscribeInput}
                />
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  type="submit"
                  className={style.subscribeBtn}
                  disabled={subscribeStatus === "subscribing"}
                >
                  {subscribeStatus === "subscribing"
                    ? "Subscribing..."
                    : "Subscribe"}
                </motion.button>
              </motion.form>
              {subscribeMessage && (
                <p
                  className={`${style.subscribeMessage} ${
                    subscribeStatus === "error" ? style.error : style.success
                  }`}
                >
                  {subscribeMessage}
                </p>
              )}

              <div className={style.socialRow}>
                <a
                  href="mailto:Twinzler@proton.me"
                  title="Email"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-envelope-fill"></i>
                </a>
                <a
                  href="https://github.com/vivekmorigan-lgtm"
                  title="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-github"></i>
                </a>
                <a
                  href="https://discord.com/users/1406246927300821032"
                  title="Discord"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-discord"></i>
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={style.footerBottom}
            variants={variants.section}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate="visible"
          >
            <p>© {new Date().getFullYear()} Chiefs.io. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
}
