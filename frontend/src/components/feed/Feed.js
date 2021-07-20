import React, { useState, useEffect, useContext } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

// import { Posts } from "../../dummyData";

function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  console.log(user);
  console.log(username);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = username
        ? await axios.get(`/api/posts/profile/${username}`)
        : await axios.get(`api/posts/timeline/${user._id}/`);
      // const { data } = await axios.get(`api/posts/timeline/${user._id}/`);
      setPosts(
        data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );
      console.log(username, user.username);
    };
    fetchPosts();
  }, [username, user.username, user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
