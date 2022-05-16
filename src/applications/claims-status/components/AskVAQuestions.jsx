import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import openOmniChannel, { OMNI_CHANNEL_URL } from '../utils/omniChannel';

export function AskVAQuestions({ showOmniChannelLink }) {
  const handler = {
    clickChatLink: event => {
      // prevent left mouse click & keyboard Enter from opening
      // link in the same tab
      if (event.button === 0 || event.key === 'Enter') {
        event.preventDefault();
      }
      openOmniChannel();
    },
  };

  return (
    <div>
      <h2 id="need-help">Need help?</h2>
      <p>
        If you have questions, please call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET. You can also{' '}
        <a href="https://www.va.gov/contact-us/">
          contact us online through Ask VA
        </a>
      </p>
      {showOmniChannelLink && (
        <p>
          <a
            id="live-chat"
            href={OMNI_CHANNEL_URL}
            onClick={handler.clickChatLink}
          >
            Open a live chat
          </a>
        </p>
      )}
    </div>
  );
}

AskVAQuestions.propTypes = {
  showOmniChannelLink: PropTypes.bool,
};

const mapStateToProps = state => ({
  showOmniChannelLink: toggleValues(state)[FEATURE_FLAG_NAMES.omniChannelLink],
});

export default connect(mapStateToProps)(AskVAQuestions);
