import React from 'react';
import * as Sentry from '@sentry/browser';

import { AOJS } from '../../utils/appeals-v2-helpers';

const vbaVersion = (
  <div>
    <h2 className="help-heading">Need help?</h2>
    <p>Call Veterans Affairs Benefits and Services</p>
    <p className="help-phone-number">
      <a className="help-phone-number-link" href="tel:1-800-827-1000">
        800-827-1000
      </a>
    </p>
    <p>Monday - Friday, 8:00am - 9:00pm ET</p>
  </div>
);

const vhaVersion = (
  <div>
    <h2 className="help-heading">Need help?</h2>
    <p>Call Health Care Benefits</p>
    <p className="help-phone-number">
      <a className="help-phone-number-link" href="tel:1-877-222-8387">
        877-222-VETS (8387)
      </a>
    </p>
    <p>Monday - Friday, 8:00am - 8:00pm ET</p>
  </div>
);

/**
 * Displays the "Need help?" sidebar content based on the appeal's location.
 *
 * @param {String} aoj       The Agency of Original Jurisdiction.
 *                            Used if the location is 'aoj'
 *                            Possible options:
 *                            ['vba', 'vha', 'nca', 'other']
 */
export default function AppealHelpSidebar({ aoj }) {
  switch (aoj) {
    case AOJS.vba:
      return vbaVersion;
    case AOJS.vha:
      return vhaVersion;
    case AOJS.nca:
      return null; // nca version (coming soon to a sidebar near you!)
    case AOJS.other:
      return null;
    default:
      Sentry.captureMessage(`appeal-status-unexpected-aoj: ${aoj}`);
  }
}
