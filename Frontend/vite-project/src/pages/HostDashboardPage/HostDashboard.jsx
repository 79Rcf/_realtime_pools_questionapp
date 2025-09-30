"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Host.module.css";
import {
  FiUser,
  FiTruck,
  FiAlertCircle,
  FiCrosshair,
  FiEye,
  FiCamera,
  FiSettings,
  FiBell,
  FiZap,
  FiGrid,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdPets, MdLocalFireDepartment } from "react-icons/md";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedObject, setSelectedObject] = useState("vehicle");
  const [selectedAlertType, setSelectedAlertType] = useState("appearing");
  const [whitelistEnabled, setWhitelistEnabled] = useState(true);
  const [blacklistEnabled, setBlacklistEnabled] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const objectOptions = [
    { id: "person", label: "Person", icon: <FiUser /> },
    { id: "vehicle", label: "Vehicle", icon: <FiTruck /> },
    { id: "pet", label: "Pet", icon: <MdPets /> },
    { id: "weapon", label: "Weapon", icon: <FiCrosshair /> },
    { id: "fire", label: "Fire", icon: <MdLocalFireDepartment /> },
    { id: "multiple", label: "Multiple", icon: <FiGrid /> },
  ];

  const alertTypes = [
    {
      id: "appearing",
      label: "Appearing",
      description: "Alert is being sent as soon as person appears.",
      icon: <FiEye />,
    },
    {
      id: "disappearing",
      label: "Disappearing",
      description: "Alert is being sent as soon as person disappears.",
      icon: <FiAlertCircle />,
    },
    {
      id: "lineCrossing",
      label: "Line crossing",
      description: "Alert is being sent when person crosses a line.",
      icon: <FiZap />,
    },
    {
      id: "trafficControl",
      label: "Traffic control",
      description: "Alert is being sent when person crosses a line.",
      icon: <FiAlertCircle />,
    },
    {
      id: "motion",
      label: "Motion",
      description: "Alert is being sent when camera notices a movement.",
      icon: <FiZap />,
    },
    {
      id: "tampering",
      label: "Tampering",
      description: "Alert is being sent when tampering is detected.",
      icon: <FiAlertCircle />,
    },
    {
      id: "loitering",
      label: "Loitering",
      description: "Person is staying in the zone for a specific period of time.",
      icon: <FiUser />,
    },
    {
      id: "occupancy",
      label: "Occupancy",
      description: "Specific number of people appears within the zone.",
      icon: <FiUser />,
    },
    {
      id: "tailgating",
      label: "Tailgating",
      description: "As soon as tailgating happens.",
      icon: <FiUser />,
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <FiGrid size={24} />
            </div>
          </div>
        </div>
        <div className={styles.topBarRight}>
          <button className={styles.themeToggle} onClick={toggleDarkMode}>
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            !isSidebarOpen ? styles.sidebarClosed : ""
          }`}
        >
          <nav className={styles.sidebarNav}>
            <Link to="/Session" className={styles.navItem}>
              <FiBell className={styles.navIcon} />
              {isSidebarOpen && <span>Join a session</span>}
            </Link>
            <Link to="/polls" className={styles.navItem}>
              <FiZap className={styles.navIcon} />
              {isSidebarOpen && <span>completed polls</span>}
            </Link>
            <Link to="/hide polls" className={styles.navItem}>
              <FiAlertCircle className={styles.navIcon} />
              {isSidebarOpen && <span>hide polls</span>}
            </Link>
            <Link to="/configuration" className={`${styles.navItem} ${styles.navItemActive}`}>
              <FiSettings className={styles.navIcon} />
              {isSidebarOpen && <span>polls history</span>}
            </Link>

            <Link to="/settings" className={styles.navItem}>
              <FiSettings className={styles.navIcon} />
              {isSidebarOpen && <span>draft polls</span>}
            </Link>   
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h1 className={styles.pageTitle}>Create poll</h1>
            <div className={styles.actionButtons}>
              <button className={styles.btnSecondary}>Cancel</button>
              <button className={styles.btnSecondary}>Save</button>
              <button className={styles.btnPrimary}>+ Add polls</button>
            </div>
          </div>

          <div className={styles.configSection}>
            <h2 className={styles.sectionTitle}></h2>
            <p className={styles.sectionDescription}>

            </p>

            
          </div>

          <div className={styles.configSection}>
            
            

            <div>
         
            </div>
          </div>

          <div className={styles.configSection}>

           

            <div className={styles.filtersList}>
              <div className={styles.filterItem}>
                <div className={styles.filterInfo}>

                  
                </div>
               
              </div>

              <div>
              
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
