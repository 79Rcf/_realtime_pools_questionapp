import React, { useState } from 'react';
import styles from './Host.module.css';
import PollItem from '../../components/CreatePoll/CreatePoll';
import { createPoll } from '../../api/polls';


const pollsData = [
  { id: 1, text: "1. What do you value most when working for My Gym?" },
  { id: 2, text: "2. What words spring to mind when you think of My Gym?" },
  { id: 3, text: "3. Which of these exercises do you enjoy teaching the most?" },
];

function App() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  /* testing purpose */
    
  const handleAddPoll = async () => {
    // For now, using prompt for quick testing
    const question = prompt("Enter your poll question:");
    const options = prompt("Enter options separated by commas:").split(",");
    const sessionId = "123456"; // Replace with your session ID logic

    try {
      const newPoll = await createPoll({ question, options, sessionId });
      console.log("Poll created:", newPoll);
      alert("Poll created successfully!");
    } catch (error) {
      alert("Failed to create poll.");
    }
  };

  /* testing purpose */

  return (
    <div className={styles.appContainer}>
      {/* Top Bar (Header) */}
      <header className={styles.topBar}>
        <div className={styles.topBar__sessionInfo}>My Gym employee session 986-051-194</div>
        <div className={styles.topBar__userInfo}>0 / 1500 RV</div>
      </header>

      <div className={styles.mainLayout}>
        {/* Left Sidebar */}
        <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ""}`}>
          <div className={styles.sidebar__back} onClick={toggleSidebar}>
            ← Back to sessions
          </div>

          {isOpen && (
            <nav className={styles.sidebar__menu}>
              <button className={styles.sidebar__item}>Join Session</button>
              <button className={`${styles.sidebar__item} ${styles.sidebar__itemActive}`}>Draft Polls</button>
              <button className={`${styles.sidebar__item} ${styles.sidebar__itemActive}`}>Completed Polls</button>
              <button className={styles.sidebar__item}>Q&A</button>
            </nav>
          )}
        </aside>

        {/* Main Content Area */}
        <main className={styles.contentArea}>
          <header className={styles.contentHeader}>
            <h1>Polls</h1>
            <button className={styles.addContentButton} onClick={handleAddPoll}>+ ADD CONTENT</button>
          </header>

          <div className={styles.contentControls}>
            <input type="checkbox" id="selectAll" />
            <label htmlFor="selectAll">Select all</label>
          </div>

          <ul className={styles.pollList}>
            {pollsData.map(poll => (
              <PollItem key={poll.id} question={poll.text} isImagePoll={poll.id === 2} />
            ))}
          </ul>
        </main>

        {/* Right Panel */}
        <aside className={styles.rightPanel}>
          <div className={styles.rightPanel__ready}>
            <h2>Ready to start presenting?</h2>
            <p>Present live polling and Q&A to your audience...</p>
          </div>
          <div className={styles.rightPanel__scores}>
            <h3>Scores after 4 questions</h3>
            {/* Table or score data here */}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
