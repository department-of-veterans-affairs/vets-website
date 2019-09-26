import React from 'react';
import facilityLocator from '../../facility-locator/manifest.json';

export const facilityLocatorLink = (
  <span>
    <a href={facilityLocator.rootUrl} target="_blank" rel="noopener noreferrer">
      Look up VA facilities
    </a>
    .
  </span>
);
