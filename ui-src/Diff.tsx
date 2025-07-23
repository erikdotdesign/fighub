import React from 'react';
import './Diff.css';

const Diff = ({
  createdIds,
  changedIds,
  deletedIds
}: {
  createdIds: string[];
  changedIds: string[];
  deletedIds: string[];
}) => {
  return (
    <div className="c-diff">
      <span className="c-diff__item c-diff__item--created">{`+${createdIds.length}`}</span>
      <span className="c-diff__item c-diff__item--changed">{`+${changedIds.length}`}</span>
      <span className="c-diff__item c-diff__item--deleted">{`-${deletedIds.length}`}</span>
    </div>
  )
};

export default Diff;