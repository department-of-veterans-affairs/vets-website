import React from 'react';
import LearnMoreLabel from '../LearnMoreLabel';

export default function({ label, learnMoreOnClick, value }) {
  return (
    <div className="vads-u-padding-bottom--1">
      <strong>
        {label} <LearnMoreLabel onClick={learnMoreOnClick} />:
      </strong>
      &nbsp;
      {value}
    </div>
  );
}
