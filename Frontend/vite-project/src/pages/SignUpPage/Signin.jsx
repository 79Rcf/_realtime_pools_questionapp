"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../api/axiosInstance"
import styles from "./Signin.module.css"
import { FiMail, FiLock } from "react-icons/fi"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate() // ✅ useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const res = await API.post("/auth/signin", { email, password })

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: res.data.email || email,
            id: res.data.userId || res.data.id,
          })
        )

        setMessage("Sign in successful!")

        // ✅ navigate after 1 second
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h1 className={styles.welcomeTitle}>WELCOME BACK!</h1>
        <p className={styles.welcomeText}>
          Explore questions and create polls
        </p>

        {/* Session Join Input + Button */}
        <div className={styles.sessionJoinBox}>
          <input
            type="text"
            placeholder="Enter session code"
            className={styles.sessionInput}
          />
          <button className={styles.sessionButton}>Join Session</button>
        </div>
      </div>


      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Sign In</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <FiMail className={styles.icon} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <FiLock className={styles.icon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
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

          <p className={styles.switchText}>
            Don't have an account?{" "}
            <a href="/signup" className={styles.switchLink}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
