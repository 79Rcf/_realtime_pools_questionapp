import { useState } from "react";
import { Link } from "react-router-dom";

// Feather icons
import {
  FiUser,
  FiTruck,
  FiAlertCircle,
  FiTarget,
  FiEye,
  FiSettings,
  FiBell,
  FiZap,
  FiGrid,
  FiSun,
  FiMoon,
  FiMenu,
  FiX
} from "react-icons/fi";

// Game icons for missing icons
import { GiPawPrint, GiFlame } from "react-icons/gi";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import styles from "./Host.module.css";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pollForms, setPollForms] = useState([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddPoll = () => {
    const newPoll = {
      id: Date.now().toString(),
      question: "",
      options: ["Yes", "No"],
    };
    setPollForms([...pollForms, newPoll]);
  };

  const handleDeletePoll = (id) => {
    setPollForms(pollForms.filter((poll) => poll.id !== id));
  };

  const handleQuestionChange = (id, question) => {
    setPollForms(
      pollForms.map((poll) => (poll.id === id ? { ...poll, question } : poll))
    );
  };

  return (
    <div className={styles.dashboard}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </Button>
          <div className={styles.logoContainer}>
            <FiGrid size={24} />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </Button>
      </header>

      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
        >
          <nav className={styles.nav}>
            <Link to="/session" className={styles.navLink}>
              <FiBell size={20} className={styles.icon} />
              {isSidebarOpen && <span>Join a session</span>}
            </Link>
            <Link to="/polls" className={styles.navLink}>
              <FiZap size={20} className={styles.icon} />
              {isSidebarOpen && <span>Completed polls</span>}
            </Link>
            <Link to="/hide-polls" className={styles.navLink}>
              <FiAlertCircle size={20} className={styles.icon} />
              {isSidebarOpen && <span>Hide polls</span>}
            </Link>
            <Link to="/configuration" className={`${styles.navLink} ${styles.activeLink}`}>
              <FiSettings size={20} className={styles.icon} />
              {isSidebarOpen && <span>Polls history</span>}
            </Link>
            <Link to="/settings" className={styles.navLink}>
              <FiSettings size={20} className={styles.icon} />
              {isSidebarOpen && <span>Draft polls</span>}
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`${styles.mainContent} ${
            isSidebarOpen ? styles.mainWithSidebar : styles.mainWithoutSidebar
          }`}
        >
          <div className={styles.headerActions}>
            <h1>Create poll</h1>
            <div className={styles.buttonGroup}>
              <Button variant="outline">Cancel</Button>
              <Button variant="outline">Save</Button>
              <Button onClick={handleAddPoll}>+ Add polls</Button>
            </div>
          </div>

          {/* Poll Forms */}
          <div className={styles.pollsContainer}>
            {pollForms.map((poll) => (
              <div key={poll.id} className={styles.pollCard}>
                <Input
                  type="text"
                  placeholder="Enter your question"
                  value={poll.question}
                  onChange={(e) => handleQuestionChange(poll.id, e.target.value)}
                  className={styles.pollInput}
                />
                <div className={styles.options}>
                  {poll.options.map((opt, idx) => (
                    <Input
                      key={idx}
                      type="text"
                      value={opt}
                      readOnly
                      className={styles.optionInput}
                    />
                  ))}
                </div>
                <div className={styles.pollActions}>
                  <Button variant="outline" size="sm">Save</Button>
                  <Button variant="outline" size="sm">Publish</Button>
                  <Button variant="outline" size="sm">Complete</Button>
                  <Button variant="outline" size="sm">Hide</Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePoll(poll.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {pollForms.length === 0 && (
              <div className={styles.noPolls}>
                No polls created yet. Click "Add polls" to create your first poll.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
