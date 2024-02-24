import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling
import { saveAs } from 'file-saver';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/messages', { message });
      console.log('Message posted:', response.data);
      setMessage('');
      fetchMessages();
      // Check if the message is not blank
    if (!message.trim()) {
      alert('Please enter a non-empty message');
      return;
    }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleClearMessages = async () => {
    try {
      const response = await axios.delete('http://127.0.0.1:5000/messages/clear');
      console.log('Messages cleared:', response.data);
      fetchMessages(); // Refresh messages after clearing
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  const handleExportToCSV = () => {
    const csvContent = messages.map(msg => msg.content).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'messages.csv');
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="App">
      <h1>Message Board</h1>
      <div className="message-form">
        <form onSubmit={handleMessageSubmit}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      </div>
      <div className="message-display">
        <h2>Messages:</h2>
        <button onClick={handleClearMessages}>Clear Messages</button>
        <button onClick={handleExportToCSV}>Export to CSV</button>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
