import PropTypes from 'prop-types';
import React from 'react';

export const EditFallbackContent = ({ routesForNav }) => {
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="vads-u-margin-top--3 vads-u-margin-bottom--3"
      >
        <va-link back href="/profile" text="Back to profile" />
      </nav>

      <h1 className="vads-u-font-size--h2 medium-screen:vads-u-margin-top--1p5 vads-u-margin-top--4">
        Edit your profile information
      </h1>

      <p className="medium-screen:vads-u-margin-bottom--2 vads-u-margin-bottom--0p5 vads-u-margin-top--0">
        Choose a section to get started:
      </p>

      <ul className="vads-u-margin-top--0">
        {routesForNav.map(route => (
          <li key={route.name}>
            <va-link href={route.path} text={route.name} />
          </li>
        ))}
      </ul>
    </>
  );
};

EditFallbackContent.propTypes = {
  routesForNav: PropTypes.array.isRequired,
};
