import React from 'react';
import './Diff.css';

const Diff = ({
  diff
}: {
  diff: {
    created: number;
    changed: number;
    deleted: number;
  }
}) => {
  return (
    <div className="c-diff">
      <span className="c-diff__item c-diff__item--created">{`+${diff.created}`}</span>
      <span className="c-diff__item c-diff__item--changed">{`±${diff.changed}`}</span>
      <span className="c-diff__item c-diff__item--deleted">{`-${diff.deleted}`}</span>
    </div>
  )
};

export default Diff;