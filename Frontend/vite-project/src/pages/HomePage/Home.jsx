import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Poll/Navbar";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <h1> Welcome to Real-Time Polls....</h1>
      <p>Create and join interactive polls in real time.</p>
      <div style={{ marginTop: "20px" }}>
        {/* <Link to="/register"><button>Host a Session</button></Link>
        <Link to="/join"><button>Join a Session</button></Link> */}
      </div>
    </div>
  );
};

export default Home;
