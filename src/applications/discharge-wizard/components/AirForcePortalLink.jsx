import React from 'react';

const AirForcePortalLink = () => (
  <section className="vads-u-margin-bottom--9">
    <a
      className="airForce-portal-link vads-u-display--flex vads-u-align-items--center vads-u-text-decoration--none"
      href="https://afrba-portal.cce.af.mil/#portal"
    >
      <i
        aria-hidden="true"
        className="fas fa-chevron-circle-right fa-2x vads-u-margin-right--1 vads-u-color--green"
        role="presentation"
      />
      <span className="vads-u-text-decoration--underline vads-u-font-weight--bold">
        Get the form on the Air Force portal
      </span>
    </a>
  </section>
);

export default AirForcePortalLink;
