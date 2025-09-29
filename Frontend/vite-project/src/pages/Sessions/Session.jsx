import { useState } from "react";
import API from "../../api/axiosInstance"
import styles from "./Session.module.css";

const CreateSession = () => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  
    const handleCreateSession = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
  
      try {
        const res = await API.post("/sessions", { host_id: 32 }); // Replace 1 with logged-in user id
        setCode(res.data.session.join_link);
        setMessage("Session created successfully!");
      } catch (err) {
        setMessage(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className={styles.container}>
        <h2>Create a New Session</h2>
        <form onSubmit={handleCreateSession} className={styles.form}>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Session"}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {code && (
          <p className={styles.code}>
            Join link: <a href={code}>{code}</a>
          </p>
        )}
      </div>
    );
  };
  
  export default CreateSession;