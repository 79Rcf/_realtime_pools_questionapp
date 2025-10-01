"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../api/axiosInstance"
import styles from "./Signup.module.css"
import { FiUser, FiMail, FiLock } from "react-icons/fi"

const Signup = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const res = await API.post("/auth/signup", { username, email, password })

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token)
        localStorage.setItem("user", JSON.stringify({ username, email }))

        setMessage("Sign up successful!")

        // ✅ Navigate after 1 second to mimic signin behavior
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.maincontainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.leftPanelTitle}>WELCOME!</h2>
        <p className={styles.leftPanelText}>
          👥 Host a poll, join a session, and compete with others in real time.
        </p>
      </div>

      <div className={styles.container}>
        <h2 className={styles.texttitle}>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <FiUser className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FiMail className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FiLock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.signupButton} disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={
              message.includes("successful")
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {message}
          </p>
        )}

        <p className={styles.switchPanelText}>
          Already have an account? <a href="/signin" className={styles.switchLink}>Login</a>
        </p>
      </div>
    </div>
  )
}

export default Signup
