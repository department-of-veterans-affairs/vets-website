import React from 'react';
import * as Sentry from '@sentry/browser';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import { AOJS } from '../../utils/appeals-v2-helpers';
import AskVAQuestions from '../AskVAQuestions';

const vhaVersion = (
  <div>
    <h2 className="help-heading">Need help?</h2>
    <p>Call Health Care Benefits</p>
    <p className="help-phone-number">
      <Telephone contact={CONTACTS['222_VETS']} pattern="###-###-VETS (####)" />
    </p>
    <p>Monday through Friday, 8:00 a.m. to 8:00 p.m. ET</p>
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
      return <AskVAQuestions />;
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
