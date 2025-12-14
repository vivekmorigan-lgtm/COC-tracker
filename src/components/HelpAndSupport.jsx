import React from "react";
import style from "../styles/help.module.css";

export default function HelpAndSupport({ onBack }) {
  return (
    <div className={style.helpContainer}>
      <div className={style.helpHeader}>
        <button onClick={onBack} className={style.backButton}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h1>Help & Support</h1>
      </div>

      <div className={style.helpContent}>
        <div className={style.helpSection}>
          <h2>Frequently Asked Questions</h2>
          <div className={style.faqItem}>
            <h4>How do I add a new upgrade?</h4>
            <p>
              Click the "Add Upgrade" button on the main screen. A modal will
              appear where you can select the village, upgrade type, item, and
              duration.
            </p>
          </div>
          <div className={style.faqItem}>
            <h4>How do I enable notifications?</h4>
            <p>
              Click the "Enable Notifications" button. Your browser will ask for
              permission. Once granted, you'll receive a notification when an
              upgrade is complete.
            </p>
          </div>
          <div className={style.faqItem}>
            <h4>Can I track multiple villages?</h4>
            <p>
              Yes! You can track upgrades for both your Home Village and Builder
              Base. Simply select the correct village when adding a new upgrade.
            </p>
          </div>
        </div>

        <div className={style.helpSection}>
          <h2>Contact Us</h2>
          <p>
            If you have any other questions, feedback, or need assistance,
            please don't hesitate to reach out via email at twinzler@proton.me.
          </p>
          <div className={style.contactSection}>
            <p className={style.contactTitle}>Contact & Social</p>
            <div className={style.socialButtons}>
              <button
                className={style.socialBtn}
                onClick={() =>
                  window.open(
                    "https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=twinzler@proton.me",
                    "_blank"
                  )
                }
                title="Contact"
              >
                <i className="bi bi-headset"></i>
              </button>
              <button
                className={style.socialBtn}
                onClick={() =>
                  window.open("https://github.com/vivekmorigan-lgtm", "_blank")
                }
                title="GitHub"
              >
                <i className="bi bi-github"></i>
              </button>
              <button
                className={style.socialBtn}
                onClick={() =>
                  window.open(
                    "https://discord.com/users/1406246927300821032",
                    "_blank"
                  )
                }
                title="Discord"
              >
                <i className="bi bi-discord"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
