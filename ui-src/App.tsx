import React, { useEffect, useState } from 'react';
import Diff from './Diff';
import './App.css';

const App = () => {
  const [uiType, setUpType] = useState("tracking");
  const [commitId, setCommitId] = useState<number>(0);
  const [createdIds, setCreatedIds] = useState<string[]>([]);
  const [changedIds, setChangedIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [error, setError] = useState(false);

  const handleCommit = () => {
    if (createdIds.length || changedIds.length || deletedIds.length) {
      if (commitMessage.trim().length) {
        parent.postMessage?.({ pluginMessage: {
          type: 'new-commit',
          payload: commitMessage
        } }, '*');
      } else {
        setError(true);
      }
    } else {
      parent.postMessage?.({ pluginMessage: { type: 'nothing-to-commit' } }, '*');
    }
  }

  const showTrackingUI = () => {
    parent.postMessage?.({ pluginMessage: { type: 'show-tracking-ui' } }, '*');
  }

  const showCommitUI = () => {
    parent.postMessage?.({ pluginMessage: { type: 'show-commit-ui' } }, '*');
  }

  const handleTextAreaChange = (e) => {
    if (error) {
      setError(false);
    }

    setCommitMessage(e.target.value);
  }

  useEffect(() => {
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (message.type === "hydrate-state") {
        const { payload } = message;
        setCommitId(payload.commitId);
        setCreatedIds(payload.createdIds);
        setChangedIds(payload.changedIds);
        setDeletedIds(payload.deletedIds);
      } else if (message.type === "ui-type") {
        setUpType(message.payload);
      }
    };
  }, []);

  return (
    <main className="c-app">
      {
        uiType === "tracking"
        ? <div className="c-app__tracker">
            <Diff
              diff={{
                created: createdIds.length,
                changed: changedIds.length,
                deleted: deletedIds.length
              }} />
            <button 
              className="c-app__button c-app__button--add-commit"
              onClick={showCommitUI}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>
          </div>
        : <div className="c-app__body">
            <div className="c-app__logo">
              fighub
            </div>
            <div className="c-app__metric">
              <div>Commit</div>
              <div>{commitId}</div>
            </div>
            <div className="c-app__metric">
              <div>Diff</div>
              <Diff 
                diff={{
                  created: createdIds.length,
                  changed: changedIds.length,
                  deleted: deletedIds.length
                }} />
            </div>
            <div className={`c-app__input ${error ? "c-app__input--error" : ""}`}>
              <textarea
                value={commitMessage}
                placeholder="Add message (required)..."
                onChange={handleTextAreaChange} />
            </div>
            <div className="c-app__button-group">
              <button 
                className="c-app__button"
                onClick={showTrackingUI}>
                Cancel
              </button>
              <button 
                className="c-app__button c-app__button--primary"
                onClick={handleCommit}>
                Commit
              </button>
            </div>
            <div className="c-app__tracker-warning">
              Closing this window (X) will terminate tracking
            </div>
          </div>
      }
    </main>
  )
};

export default App;