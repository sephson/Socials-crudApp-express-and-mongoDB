import "./mess.css";
import Topbar from "../../components/Header";
import React, {
  createRef,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { AuthContext } from "../../context/AuthContext";
import Conversation from "../../components/convo/convo";
import Message from "../../components/message/message";
import ChatOnline from "../../components/chatOnline/chatOnline";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const { user } = useContext(AuthContext);
  const pf = process.env.REACT_APP_PUBLIC_FOLDER;
  const [convo, setConvo] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();
  const inputRef = createRef();
  const [chosenEmoji, setChosenEmoji] = useState(false);

  useEffect(() => {
    socket.current = io("https://whispering-mesa-94633.herokuapp.com/");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      return console.log(users);
    });
  }, [user]);

  useEffect(() => {
    socket.current.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);

  useEffect(() => {
    const getConvos = async () => {
      try {
        const { data } = await axios.get(`/api/convo/${user._id}`); //gets convo for the current user
        console.log(data);
        setConvo(data);
        console.log(data);
      } catch (e) {}
    };

    getConvos();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${currentChat?._id}`);
        setMessages(data);
      } catch (err) {}
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const { data } = await axios.post(`/api/messages/`, message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const handleEmoji = () => {
    // inputRef.current.focus();
    setChosenEmoji(!chosenEmoji);
  };

  console.log(messages);

  return (
    <>
      <Topbar user={user} />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="search for peeps" className="chatMenuInput" />
            {convo.map((c) => {
              return (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation currentUser={user} convo={c} />{" "}
                </div>
              );
            })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <div className="chatBoxTop">
                {messages.map((m) => {
                  return (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        user={user}
                        own={m.sender === user._id}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}

            <div className="chatBoxBottom">
              <textarea
                className="chatMessageInput"
                placeholder="write something"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></textarea>
              <button onClick={handleSubmit} className="chatSubmitButton">
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              currentId={user._id}
              user={user}
              onlineUsers={onlineUsers}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
