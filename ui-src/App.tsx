import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [diff, setDiff] = useState({
    created: 0,
    changed: 0,
    deleted: 0
  });

  useEffect(() => {
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (message.type === "diff") {
        setDiff(message.payload);
      }
    };
  });

  return (
    <main className="c-app">
      <span className="c-app__diff c-app__diff--created">{`+${diff.created}`}</span>
      <span className="c-app__diff c-app__diff--changed">{`+${diff.changed}`}</span>
      <span className="c-app__diff c-app__diff--deleted">{`-${diff.deleted}`}</span>
    </main>
  )
};

export default App;