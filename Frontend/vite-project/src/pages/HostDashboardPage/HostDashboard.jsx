import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiSettings,
  FiBell,
  FiZap,
  FiGrid,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import styles from "./Host.module.css";
import { createPoll, publishPoll, completePoll, hidePoll } from "../../api/polls";

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

  // Add new poll
  const handleAddPoll = () => {
    const newPoll = {
      id: Date.now().toString(),
      question: "",
      options: [""],
      sessionId: "",
      status: "new", // new, draft, published, completed, hidden
      backendId: null, // store backend poll id here
    };
    setPollForms([...pollForms, newPoll]);
  };

  // Save poll as draft
  const handleSavePoll = async (poll) => {
    try {
      if (!poll.question || !poll.options.length || !poll.sessionId) {
        return alert("Please enter a valid question, options, and session ID.");
      }

      const savedPoll = await createPoll({
        question: poll.question,
        options: poll.options,
        sessionId: parseInt(poll.sessionId),
      });

      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.id === poll.id
            ? { ...p, backendId: savedPoll.id, status: "draft" }
            : p
        )
      );

      alert("Poll saved as draft successfully!");
    } catch (error) {
      alert("Error saving poll: " + (error.response?.data?.message || error.message));
    }
  };

  // Publish poll
  const handlePublishPoll = async (pollId) => {
    try {
      await publishPoll(pollId);
      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.backendId === pollId ? { ...p, status: "published" } : p
        )
      );
      alert("Poll published successfully!");
    } catch (error) {
      alert("Error publishing poll: " + (error.response?.data?.message || error.message));
    }
  };

  // Hide poll
  const handleHidePoll = async (pollId) => {
    try {
      await hidePoll(pollId);
      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.backendId === pollId ? { ...p, status: "hidden" } : p
        )
      );
      alert("Poll hidden successfully!");
    } catch (error) {
      alert("Error hiding poll: " + (error.response?.data?.message || error.message));
    }
  };

  // Complete poll
  const handleCompletePoll = async (pollId) => {
    try {
      await completePoll(pollId);
      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.backendId === pollId ? { ...p, status: "completed" } : p
        )
      );
      alert("Poll completed successfully!");
    } catch (error) {
      alert("Error completing poll: " + (error.response?.data?.message || error.message));
    }
  };

  // Delete poll (frontend only)
  const handleDeletePoll = (id) => {
    setPollForms(pollForms.filter((poll) => poll.id !== id));
  };

  // Input handlers
  const handleQuestionChange = (id, question) => {
    setPollForms(
      pollForms.map((poll) => (poll.id === id ? { ...poll, question } : poll))
    );
  };

  const handleSessionChange = (id, sessionId) => {
    setPollForms(
      pollForms.map((poll) => (poll.id === id ? { ...poll, sessionId } : poll))
    );
  };

  const handleOptionChange = (pollId, idx, value) => {
    setPollForms(
      pollForms.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((opt, i) => (i === idx ? value : opt)),
            }
          : poll
      )
    );
  };

  const handleAddOption = (pollId) => {
    setPollForms(
      pollForms.map((poll) =>
        poll.id === pollId ? { ...poll, options: [...poll.options, ""] } : poll
      )
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
            <Link
              to="/configuration"
              className={`${styles.navLink} ${styles.activeLink}`}
            >
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
              <Button onClick={handleAddPoll}>+ Add polls</Button>
            </div>
          </div>

          {/* Poll Forms */}
          <div className={styles.pollsContainer}>
            {pollForms.map((poll) => (
              <div key={poll.id} className={styles.pollCard}>
                {/* Question */}
                <Input
                  type="text"
                  placeholder="Enter your question"
                  value={poll.question}
                  onChange={(e) => handleQuestionChange(poll.id, e.target.value)}
                  className={styles.pollInput}
                />

                {/* Session ID */}
                <Input
                  type="number"
                  placeholder="Enter session ID"
                  value={poll.sessionId}
                  onChange={(e) => handleSessionChange(poll.id, e.target.value)}
                  className={styles.pollInput}
                />

                {/* Options */}
                <div className={styles.options}>
                  {poll.options.map((opt, idx) => (
                    <Input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(poll.id, idx, e.target.value)
                      }
                      className={styles.optionInput}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(poll.id)}
                  >
                    + Add option
                  </Button>
                </div>

                {/* Actions */}
                <div className={styles.pollActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSavePoll(poll)}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublishPoll(poll.backendId)}
                    disabled={!poll.backendId}
                  >
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompletePoll(poll.backendId)}
                    disabled={!poll.backendId}
                  >
                    Complete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHidePoll(poll.backendId)}
                    disabled={!poll.backendId}
                  >
                    Hide
                  </Button>
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
