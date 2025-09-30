import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css"; 

const Home = () => {
  return (
    <>
      <header className={styles.mainheader}>
        <div className={styles.titleHeader}>
          <div className={styles.mikegen}>
            <div className={styles.mike}>
              <h3 className={styles.titleLeft}>
                Fast <span className={styles.tit}>Poll</span>
              </h3>
            </div>

            <div className={styles.rightsbtn}>
              <Link to="/dashboard">
                <button className={styles.publicpoll}>Public Polls</button>
              </Link>
              <span className={styles.seperate}></span>
              <Link to="/signin">
                <button className={styles.SignInheaderbtn}>Login</button>
              </Link>
              <Link to="/signup">
                <button className={styles.SignUpheaderbtn}>SignUp</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.center}>
        <div className={styles.container}>
          <div className={styles.leftsec}>
            <p className={styles.leftpara}>
              Create instant, real-time <span className={styles.para}>polls</span> for free
            </p>
            <Link to="/dashboard">
              <button className={styles.button}>Create your poll now</button>
            </Link>
            <p className={styles.paralayout}>No registration required - it's 100% free and takes less than a minute.</p>
          </div>

          <div className={styles.glowing}>
            <div className={styles.rightsec}>
              <h4 className={styles.righthead}>WEB DESIGN</h4>
              <h1 className={styles.text}>What design tool do you use the most?</h1>
              <p className={styles.textpara}>Asked by anonymous about 3 hours ago</p>

              {/* Photoshop */}
              <div className={styles.card1}>
                <div className={styles.carddeatils1}>
                  <span className={styles.cardtitle}>Photoshop</span>
                  <span className={styles.carddigit}>4%</span>
                </div>
                <div className={styles.progressbar}>
                  <div className={styles.cardbar}></div>
                </div>
                <span className={styles.cardvote}>8 votes</span>
              </div>

              {/* Sketch */}
              <div className={styles.card2}>
                <div className={styles.carddeatils1}>
                  <span className={styles.cardtitle}>Sketch</span>
                  <span className={styles.carddigit}>8%</span>
                </div>
                <div className={styles.progressbar}>
                  <div className={styles.cardbar2}></div>
                </div>
                <span className={styles.cardvote}>85 votes</span>
              </div>

              {/* Adobe XD */}
              <div className={styles.card3}>
                <div className={styles.carddeatils1}>
                  <span className={styles.cardtitle}>Adobe XD</span>
                  <span className={styles.carddigit}>52%</span>
                </div>
                <div className={styles.progressbar}>
                  <div className={styles.cardbar3}></div>
                </div>
                <span className={styles.cardvote}>4 votes</span>
              </div>

              {/* Figma */}
              <div className={styles.card4}>
                <div className={styles.carddeatils1}>
                  <span className={styles.cardtitle}>Figma</span>
                  <span className={styles.carddigit}>36%</span>
                </div>
                <div className={styles.progressbar}>
                  <div className={styles.cardbar4}></div>
                </div>
                <span className={styles.cardvote}>86 votes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home;
