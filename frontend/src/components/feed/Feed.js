import React, { useState, useEffect, useContext } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

// import { Posts } from "../../dummyData";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = user
        ? await axios.get(`/api/posts/profile/${user.username}`)
        : await axios.get(`api/posts/timeline/${user._id}`);
      setPosts(data);
    };
    fetchPosts();
  }, [user]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
