import React from 'react';
import { EditBreadcrumb } from './EditBreadcrumb';

export const EditFallbackContent = ({ routesForNav }) => {
  return (
    <>
      <EditBreadcrumb href="/profile">Back to profile</EditBreadcrumb>

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
