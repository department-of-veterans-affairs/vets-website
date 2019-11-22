import React from 'react';
import classnames from 'classnames';

function Card({ heading, href, description }) {
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

function CardRow({ children: cards }) {
  const columnClassName = classnames(
    'vads-l-col--12',
    'vads-u-margin-bottom--1',
    'vads-u-margin-right--1',
    'medium-screen:vads-l-col',
  );

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        {cards.map((card, index) => (
          <div key={index} className={columnClassName}>
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopTasks() {
  return (
    <>
      <h2>Top tasks for frequently downloaded VA forms</h2>
      <p>
        Whether you’re looking for a form to file a disability claim or apply
        for the GI Bill, many top tasks are now also available as secure online
        applications. To get started online, go to a top task below. We’ll walk
        you step-by-step through the process. You can even save your work online
        and come back to it later.
      </p>
      <CardRow>
        <Card
          heading="File a VA disability claim"
          description="Equal to VA Form 21-526EZ"
          href="/disability/file-disability-claim-form-21-526ez"
        />
        <Card
          heading="Apply for the GI Bill and other education benefits"
          description="Equal to VA Forms 22-1990 and 22-1995"
          href="/education/apply-for-education-benefits/application/1990"
        />
        <Card
          heading="Apply for VA health care benefits"
          description="Equal to VA Form 10-10EZ"
          href="/health-care/apply/application"
        />
      </CardRow>
    </>
  );
}
