import React from 'react';
import classnames from 'classnames';

export default function Card({ heading, href, description }) {
  const containerClassName = classnames(
    'vads-u-display--block',
    'vads-u-background-color--primary-alt-lightest',
    'vads-u-padding--2',
    'vads-u-height--full',
    'vads-u-text-decoration--none',
  );

  return (
    <a href={href} className={containerClassName}>
      <div className="vads-u-font-family--serif vads-u-font-weight--bold vads-u-text-decoration--underline">
        {heading}
      </div>
      <div className="vads-l-gird-container">
        <div className="vads-l-row">
          <div className="vads-l-col--3 vads-u-margin-y--1">
            <hr className="vads-u-margin--0 vads-u-border-color--cool-blue-lighter" />
          </div>
        </div>
      </div>
      <p className="vads-u-color--base">{description}</p>
    </a>
  );
}
