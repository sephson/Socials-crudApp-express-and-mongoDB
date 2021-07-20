import "./convo.css";
import React, { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
const Convo = ({ convo, currentUser }) => {
  const [user, setUser] = useState(null);

  // const { user } = useContext(AuthContext);
  const pf = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = convo.members.find((m) => m !== currentUser._id); //this gives the uderid which isnt the user's id
    console.log(friendId);
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/users?userId=${friendId}`);
        // console.log(data);
        setUser(data);
      } catch (err) {}
    };

    getUser();
  }, [currentUser, convo]);

  console.log(user);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        // src={user.profilePicture ? user.profilePicture : `${pf}person/a.png`}
        alt=""
      />
      {user === null ? (
        <span className="conversationName">TOYIN</span>
      ) : (
        <span className="conversationName">{user.username}</span>
      )}
    </div>
  );
};

export default Convo;
