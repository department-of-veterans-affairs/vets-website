import React from 'react';

const goBack = e => {
  e.preventDefault();
  const { history } = window;
  history.back();
};

const BreadCrumb = () => {
  const { referrer } = document;
  const link = referrer || '#';

  return (
    <div className="vads-u-padding-top--1p5 vads-u-padding-bottom--3">
      &lt;{' '}
      <a onClick={goBack} href={link}>
        Back to appointment details
      </a>
    </div>
  );
};

export default BreadCrumb;
