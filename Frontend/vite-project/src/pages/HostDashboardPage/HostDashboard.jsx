"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiAlertCircle, FiSettings, FiBell, FiZap, FiGrid, FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi"

import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import styles from "./Host.module.css"
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

import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import styles from "./Host.module.css";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [pollForms, setPollForms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadPolls = async () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setError("You must be logged in to view polls")
        navigate("/login") // Redirect to login page
        return
      }

      try {
        setIsLoading(true)
        console.log("[v0] Loading polls...")
        const polls = await fetchPolls()
        console.log("[v0] Received polls:", polls)

        if (!Array.isArray(polls)) {
          console.error("[v0] Polls is not an array:", polls)
          setPollForms([])
          setError("Received invalid data format from server")
          return
        }

        // Transform backend polls to match frontend structure
        const transformedPolls = polls.map((poll) => ({
          id: poll.id.toString(),
          question: poll.question,
          options: poll.options,
          sessionId: poll.session_id?.toString() || "",
          status: poll.status || "draft",
          backendId: poll.id,
        }))

        console.log("[v0] Transformed polls:", transformedPolls)
        setPollForms(transformedPolls)
        setError(null)
      } catch (err) {
        console.error("[v0] Failed to load polls:", err)
        setError("Failed to load polls. Please try again.")
        setPollForms([]) // Set empty array on error to prevent map errors
      } finally {
        setIsLoading(false)
      }
    }

    loadPolls()
  }, [navigate])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Add new poll
  const handleAddPoll = () => {
    const newPoll = {
      id: `temp-${Date.now()}`,
      question: "",
      options: [""],
      sessionId: "",
      status: "new",
      backendId: null,
    }
    setPollForms([...pollForms, newPoll])
  }

  // Save poll as draft
  const handleSavePoll = async (poll) => {
    try {
      if (!poll.question || !poll.options.length || !poll.sessionId) {
        setError("Please enter a valid question, options, and session ID.")
        return
      }

      const validOptions = poll.options.filter((opt) => opt.trim() !== "")
      if (validOptions.length < 2) {
        setError("Please provide at least 2 valid options.")
        return
      }

      const savedPoll = await createPoll({
        question: poll.question,
        options: validOptions,
        sessionId: Number.parseInt(poll.sessionId),
      })

      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.id === poll.id
            ? {
                ...p,
                backendId: savedPoll.id,
                status: savedPoll.status || "draft",
                id: savedPoll.id.toString(), // Update to use backend ID
              }
            : p,
        ),
      )

      setError(null)
      console.log("Poll saved as draft successfully!")
    } catch (err) {
      setError("Error saving poll: " + (err.response?.data?.message || err.message))
    }
  }

  // Publish poll
  const handlePublishPoll = async (poll) => {
    try {
      if (!poll.backendId) {
        setError("Please save the poll as draft first before publishing.")
        return
      }

      const updatedPoll = await publishPoll(poll.backendId)
      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.backendId === poll.backendId ? { ...p, status: updatedPoll.status || "published" } : p,
        ),
      )
      setError(null)
      console.log("Poll published successfully!")
    } catch (err) {
      setError("Error publishing poll: " + (err.response?.data?.message || err.message))
    }
  }

  // Hide poll
  const handleHidePoll = async (poll) => {
    try {
      if (!poll.backendId) {
        setError("Cannot hide a poll that hasn't been saved.")
        return
      }

      const updatedPoll = await hidePoll(poll.backendId)
      setPollForms((prevForms) =>
        prevForms.map((p) => (p.backendId === poll.backendId ? { ...p, status: updatedPoll.status || "hidden" } : p)),
      )
      setError(null)
      console.log("Poll hidden successfully!")
    } catch (err) {
      setError("Error hiding poll: " + (err.response?.data?.message || err.message))
    }
  }

  // Complete poll
  const handleCompletePoll = async (poll) => {
    try {
      if (!poll.backendId) {
        setError("Cannot complete a poll that hasn't been saved.")
        return
      }

      const updatedPoll = await completePoll(poll.backendId)
      setPollForms((prevForms) =>
        prevForms.map((p) =>
          p.backendId === poll.backendId ? { ...p, status: updatedPoll.status || "completed" } : p,
        ),
      )
      setError(null)
      console.log("Poll completed successfully!")
    } catch (err) {
      setError("Error completing poll: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDeletePoll = async (poll) => {
    try {
      // If poll has backendId, delete from backend
      if (poll.backendId) {
        await deletePoll(poll.backendId)
      }

      // Remove from frontend state
      setPollForms(pollForms.filter((p) => p.id !== poll.id))
      setError(null)
      console.log("Poll deleted successfully!")
    } catch (err) {
      setError("Error deleting poll: " + (err.response?.data?.message || err.message))
    }
  }

  // Input handlers
  const handleQuestionChange = (id, question) => {
    setPollForms(pollForms.map((poll) => (poll.id === id ? { ...poll, question } : poll)))
  }

  const handleSessionChange = (id, sessionId) => {
    setPollForms(pollForms.map((poll) => (poll.id === id ? { ...poll, sessionId } : poll)))
  }

  const handleOptionChange = (pollId, idx, value) => {
    setPollForms(
      pollForms.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((opt, i) => (i === idx ? value : opt)),
            }
          : poll,
      ),
    )
  }

  const handleAddOption = (pollId) => {
    setPollForms(pollForms.map((poll) => (poll.id === pollId ? { ...poll, options: [...poll.options, ""] } : poll)))
  }

  const handleRemoveOption = (pollId, idx) => {
    setPollForms(
      pollForms.map((poll) =>
        poll.id === pollId ? { ...poll, options: poll.options.filter((_, i) => i !== idx) } : poll,
      ),
    )
  }

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading polls...</div>
      </div>
    )
  }

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
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
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
        <main className={`${styles.mainContent} ${isSidebarOpen ? styles.mainWithSidebar : styles.mainWithoutSidebar}`}>
          <div className={styles.headerActions}>
            <h1>Create poll</h1>
            <div className={styles.buttonGroup}>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddPoll}>+ Add polls</Button>
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <FiAlertCircle size={20} />
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Poll Forms */}
          <div className={styles.pollsContainer}>
            {pollForms.map((poll) => (
              <div key={poll.id} className={styles.pollCard}>
                <div className={styles.pollHeader}>
                  <span className={`${styles.statusBadge} ${styles[poll.status]}`}>{poll.status}</span>
                </div>

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
                    <div key={idx} className={styles.optionRow}>
                      <Input
                        type="text"
                        value={opt}
                        placeholder={`Option ${idx + 1}`}
                        onChange={(e) => handleOptionChange(poll.id, idx, e.target.value)}
                        className={styles.optionInput}
                      />
                      {poll.options.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveOption(poll.id, idx)}>
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handleAddOption(poll.id)}>
                    + Add option
                  </Button>
                </div>

                {/* Actions */}
                <div className={styles.pollActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSavePoll(poll)}
                    disabled={poll.status === "published" || poll.status === "completed"}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublishPoll(poll)}
                    disabled={!poll.backendId || poll.status === "published" || poll.status === "completed"}
                  >
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompletePoll(poll)}
                    disabled={!poll.backendId || poll.status === "completed"}
                  >
                    Complete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleHidePoll(poll)} disabled={!poll.backendId}>
                    Hide
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePoll(poll)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {pollForms.length === 0 && (
              <div className={styles.noPolls}>No polls created yet. Click "Add polls" to create your first poll.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
