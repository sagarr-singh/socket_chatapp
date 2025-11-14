import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button, Input } from "antd"
import Login from './Login';
import { Navigate, useNavigate } from 'react-router-dom';
const socket = io('http://192.160.162.152:4000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isNameSet, setIsNameSet] = useState(false);
  const chatRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);



  useEffect(() => {
    socket.on("online-users", (users) => {
      // console.log("Online users:", users); // ✅ this must log user names
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  useEffect(() => {
    // console.log("Joining chat with name:", name);
    if (name) {
      socket.emit("join", name);
    }
  }, [name]);




  const sendMessage = () => {
    if (input.trim()) {
      const msg = { name, text: input, time: new Date().toLocaleTimeString() };
      socket.emit('chat message', msg);
      setInput('');
    }
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      setIsNameSet(true);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);


  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div
      style={{
        minHeight: '50vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#fff',
          margin: '0 auto',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Logout Button */}
        <Button
          type="primary"
          onClick={logout}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontSize: '0.9rem',
            padding: '6px 12px',
            zIndex: 10,
          }}
        >
          Logout
        </Button>

        <h2
          style={{
            textAlign: 'center',
            padding: '20px 10px 10px',
            margin: 0,
            fontSize: '1.4rem',
          }}
        >
          💬 React Chat App
        </h2>

        {!isNameSet ? (
          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <h4 style={{ alignSelf: 'flex-start', fontSize: '1rem' }}>
              Enter your name to join chat room:
            </h4>
            <Input
              size="large"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%' }}
            />
            <Button type="primary" onClick={handleNameSubmit} size="large" block>
              Join
            </Button>
          </div>
        ) : (
          <>
            {/* ✅ Online Users Display */}
            {onlineUsers.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#f7f7f7',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <strong style={{ marginRight: '10px' }}>Active:</strong>
                {onlineUsers.map(({ username }, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'green',
                      color: '#2e7d32',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {username === name ? 'You' : username}
                  </span>
                ))}
              </div>
            )}

            {/* Chat messages */}
            <div
              ref={chatRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#ece5dd',
              }}
            >
              Start Chatting...
              {messages.map((msg, idx) => {
                const isSelf = msg.name === name;
                const isOnline = onlineUsers.includes(msg.name);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: isSelf ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        backgroundColor: isSelf ? '#dcf8c6' : '#fff',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
                        wordBreak: 'break-word',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {isSelf ? 'You' : msg.name}
                        {!isSelf && isOnline && (
                          <span
                            style={{
                              backgroundColor: '#4CAF50',
                              color: '#fff',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              marginLeft: '8px',
                            }}
                          >
                            Online
                          </span>
                        )}
                      </div>
                      <div>{msg.text}</div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'gray',
                          textAlign: 'right',
                          marginTop: 6,
                        }}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message input */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px',
                borderTop: '1px solid #ddd',
                backgroundColor: '#fff',
                flexWrap: 'wrap',
              }}
            >
              <Input
                size="large"
                value={input}
                placeholder="Type a message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{ flex: '1 1 auto', minWidth: 0 }}
              />
              <Button type="primary" size="large" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

}
export default Chat;
