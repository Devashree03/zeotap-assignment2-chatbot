// client/src/App.js

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  chatWindow: {
    height: '400px',
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    marginBottom: '16px',
    borderRadius: '8px',
  },
  messageUser: {
    textAlign: 'right',
    backgroundColor: '#e1f5fe',
    padding: '8px 12px',
    borderRadius: '12px',
    marginBottom: '8px',
    display: 'inline-block',
    maxWidth: '80%',
  },
  messageBot: {
    textAlign: 'left',
    backgroundColor: '#eeeeee',
    padding: '8px 12px',
    borderRadius: '12px',
    marginBottom: '8px',
    display: 'inline-block',
    maxWidth: '80%',
  },
  form: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flexGrow: 1,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
  },
});

function App() {
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Append user's message
    setChat((prev) => [...prev, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setChat((prev) => [
        ...prev,
        { sender: 'bot', text: data.answer },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error: Unable to fetch response.' },
      ]);
    }
    setLoading(false);
    setQuery('');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">CDP Support Chatbot</Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} className={classes.chatWindow}>
            <List>
              {chat.map((msg, idx) => (
                <ListItem key={idx} disableGutters>
                  <ListItemText
                    primary={
                      <Box
                        className={
                          msg.sender === 'bot'
                            ? classes.messageBot
                            : classes.messageUser
                        }
                      >
                        {msg.text}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {loading && (
                <ListItem>
                  <ListItemText
                    primary={
                      <div className={classes.loader}>
                        <CircularProgress size={24} />
                      </div>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
          <form onSubmit={sendQuery} className={classes.form}>
            <TextField
              variant="outlined"
              label="Enter your question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={classes.input}
            />
            <Button variant="contained" color="primary" type="submit">
              Send
            </Button>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default App;
