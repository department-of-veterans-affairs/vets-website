/** 
MessageFAQ Component
@author Vic Saleem
*/
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';
import UnAuthBanner from './shared/UnAuthBanner';
import UnAuthSendMessageSection from './shared/UnAuthSendMessageSection';
import AlertBox from './shared/AlertBox';
import { addAlert } from '../actions/alerts';

const MessageFAQ = props => {
  const { isLoggedIn } = props;
  return (
    <>
      <div>
        {/* Add validation logic to setAlert */}
        <AlertBox />
        {/* {isLoggedIn && console.log(addAlert('info', 'info', 'info'))} */}
        {
          // isMessage older than 45days?
          <VaAlert status="info" visible class="vads-u-margin-y--4">
            <h2 slot="headline">
              You cannot reply to a message that is older than 45 days.
            </h2>
            <p>
              Please select 'Compose' to create a new message and try again.
            </p>
          </VaAlert>
        }
        <h1 className="vads-u-margin-bottom--1p5">Messages FAQs</h1>
        <p className="va-introtext vads-u-margin-top--0">
          How secure messaging works, what to expect, and how to get help.
        </p>
        <p>
          With VA secure messaging you can communicate privately online with
          your VA health care team.
        </p>
      </div>
      {!isLoggedIn && (
        <div className="message-faq-unauth">
          <UnAuthBanner />
          <UnAuthSendMessageSection />
        </div>
      )}
      <FrequentlyAskedQuestions />
    </>
  );
};

MessageFAQ.propTypes = {
  addAlert: PropTypes.func,
  isLoggedIn: PropTypes.bool,
};

export default connect(
  null,
  { addAlert },
)(MessageFAQ);
