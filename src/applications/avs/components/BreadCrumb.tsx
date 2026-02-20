import React from 'react';

const goBack = (e: React.MouseEvent<HTMLAnchorElement>): void => {
  e.preventDefault();
  const { history } = window;
  history.back();
};

const isPastAppointmentLink = (url: string): boolean => {
  const { pathname } = new URL(url);
  return pathname.match(/^\/my-health\/appointments\/past\/[^/]+$/) !== null;
};

const BreadCrumb: React.FC = () => {
  const { referrer } = document;
  if (referrer && isPastAppointmentLink(referrer)) {
    return (
      <div className="avs-breadcrumb vads-u-padding-top--1p5 vads-u-padding-bottom--1">
        <a onClick={goBack} href={referrer}>
          Back to appointment details
        </a>
      </div>
    );
  }

  return null;
};

export default BreadCrumb;
