import React from 'react';
import LearnMoreLabel from '../LearnMoreLabel';

export default function({ label, learnMoreOnClick, value }) {
  return (
    <div className="vads-u-padding-bottom--1 small-screen-font">
      <strong>
        {label}
        <LearnMoreLabel
          onClick={learnMoreOnClick}
          buttonClassName="small-screen-font"
        />
        :
      </strong>
      &nbsp;
      {value}
    </div>
  );
}
