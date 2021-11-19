import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import openOmniChannel, { OMNI_CHANNEL_URL } from '../utils/omniChannel';

export function AskVAQuestions({ showOmniChannelLink }) {
  return (
    <div>
      <h2 className="help-heading">Need help?</h2>
      <p>Call Veterans Affairs Benefits and Services:</p>
      <p>
        <Telephone contact={CONTACTS.VA_BENEFITS} />
      </p>
      <p>Monday through Friday, 8:00 a.m. to 9:00 p.m. ET</p>
      <p>
        <a href="https://www.va.gov/contact-us/">
          Contact us online through Ask VA
        </a>
      </p>
      {showOmniChannelLink && (
        <p>
          <a
            id="live-chat"
            href={OMNI_CHANNEL_URL}
            onClick={event => {
              // prevent left mouse click & keyboard Enter from opening
              // link in the same tab
              if (event.button === 0 || event.key === 'Enter') {
                event.preventDefault();
              }
              openOmniChannel();
            }}
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
