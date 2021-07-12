import React from 'react';

export const OnThisPageLink = props => {
  return (
    <a className="arrow-down-link" href={props.link}>
      <p>
        <span className="icon-with-info">
          <i
            className="fa fa-arrow-down vads-u-padding-right--1"
            aria-hidden="true"
          />
          {props.text}
        </span>
      </p>
    </a>
  );
};
