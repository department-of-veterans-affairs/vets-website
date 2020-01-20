import React from 'react';
import classnames from 'classnames';

export default function Card({ heading, href, rel, target, description }) {
  const containerClassName = classnames(
    'vads-u-display--block',
    'vads-u-background-color--primary-alt-lightest',
    'vads-u-padding--2',
    'vads-u-height--full',
    'vads-u-text-decoration--none',
  );

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={containerClassName}
      aria-label={heading}
    >
      <div className="vads-u-font-weight--bold vads-u-text-decoration--underline">
        {heading}
      </div>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--3 vads-u-margin-top--1p5 vads-u-margin-bottom--1">
            <hr className="vads-u-margin--0 vads-u-border-color--cool-blue-lighter" />
          </div>
        </div>
      </div>
      <p className="vads-u-color--base">{description}</p>
    </a>
  );
}
