import { useState } from "react";
import { signIn } from "../../api/auth";
import styles from "./SignIn.module.css";

const SignIn = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn(form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      onLogin && onLogin();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error signing in");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Sign In
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default SignIn;
