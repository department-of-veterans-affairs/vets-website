import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';

import { AOJS } from '../../utils/appeals-v2-helpers';
import AskVAQuestions from '../AskVAQuestions';

const vhaVersion = (
  <>
    <h2 className="help-heading">Need help?</h2>
    <p>Call Health Care Benefits</p>
    <p className="help-phone-number">
      <va-telephone
        contact={CONTACTS['222_VETS']}
        vanity="VETS"
        uswds="false"
      />
    </p>
    <p>Monday through Friday, 8:00 a.m. to 8:00 p.m. ET</p>
  </>
);

// NOTE: aoj stands for 'Agency of Original Jurisdiction'
const AppealHelpSidebar = ({ aoj }) => {
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
      return null;
  }
};

AppealHelpSidebar.propTypes = {
  aoj: PropTypes.oneOf(['vba', 'vha', 'nca', 'other']),
};

export default AppealHelpSidebar;
