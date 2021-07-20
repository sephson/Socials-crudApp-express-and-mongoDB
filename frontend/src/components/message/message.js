import React from "react";
import "./message.css";

import { format } from "timeago.js";

const message = ({ message, user, own }) => {
  const pf = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={user.profilePicture ? user.profilePicture : `${pf}person/a.png`}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default message;
