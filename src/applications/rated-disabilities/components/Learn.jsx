import React from 'react';

export const heading = 'Learn about VA disability ratings';

export default function Learn() {
  return (
    <div className="vads-u-margin-top--4">
      <h2
        id="learn"
        className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary vads-u-font-size--h3"
      >
        {heading}
      </h2>
      <p>
        To learn how we determined your VA combined disability rating, use our
        disability rating calculator and ratings table.
      </p>
      <va-link
        href="/disability/about-disability-ratings"
        text="About VA disability ratings"
        uswds="false"
      />
    </div>
  );
}
