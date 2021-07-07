import React, { useState, useEffect } from "react";
import "./profile.css";
import Topbar from "../../components/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
export default function Profile() {
  const [user, setUser] = useState({});
  const pf = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`/api/users?username=new`);
      setUser(data);
      console.log(data);
    };

    fetchUser();
  }, []);

  console.log(user.username);
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={`${pf}/post/3.jpeg`}
                alt=""
              />
              <img
                className="profileUserImg"
                src={`${pf}/person/7.jpeg`}
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username="new" />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
