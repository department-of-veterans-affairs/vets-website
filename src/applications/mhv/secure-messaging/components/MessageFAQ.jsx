/** 
MessageFAQ Component
@author Vic Saleem
*/
import React from 'react';
import PropTypes from 'prop-types';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';
import UnAuthBanner from './shared/UnAuthBanner';
import UnAuthSendMessageSection from './shared/UnAuthSendMessageSection';

const MessageFAQ = props => {
  const { isLoggedIn } = props;
  return (
    <>
      <div>
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
  isLoggedIn: PropTypes.bool,
};

export default MessageFAQ;
