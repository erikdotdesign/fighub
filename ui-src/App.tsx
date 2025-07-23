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

  const handleCommit = () => {
    parent.postMessage?.({ pluginMessage: {
      type: 'add-commit',
      payload: commitMessage
    } }, '*');
  }

  const showTrackingUI = () => {
    parent.postMessage?.({ pluginMessage: { type: 'show-tracking-ui' } }, '*');
  }

  const showCommitUI = () => {
    parent.postMessage?.({ pluginMessage: { type: 'show-commit-ui' } }, '*');
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
              createdIds={createdIds}
              changedIds={changedIds}
              deletedIds={deletedIds} />
            <button 
              className="c-app__button c-app__button--accent c-app__button--add-commit"
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
              <div>Layers changed</div>
              <Diff 
                createdIds={createdIds}
                changedIds={changedIds}
                deletedIds={deletedIds} />
            </div>
            <div className="c-app__input">
              <textarea
                value={commitMessage}
                placeholder="Add message (required)..."
                onChange={(e) => setCommitMessage(e.target.value)} />
            </div>
            <div className="c-app__button-group">
              <button 
                className="c-app__button c-app__button--accent"
                onClick={showTrackingUI}>
                Cancel
              </button>
              <button 
                className="c-app__button"
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