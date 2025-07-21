import React, { useEffect } from 'react';
import Logo from './Logo';
import './App.css';

const App = () => {
  useEffect(() => {
    if (typeof parent !== undefined) {
      parent?.postMessage?.({ pluginMessage: 'hello' }, '*')
    }
  }, [])

  return (
    <main className="c-app">
      <div className="c-app__body">
        <Logo />
      </div>
      <div className="c-app__footer">
        <button 
          onClick={() => {
            parent?.postMessage?.({ pluginMessage: 'hide' }, '*')
          }}
          className="c-app__commit-button">
          Add to canvas
        </button>
      </div>
    </main>
  )
};

export default App;