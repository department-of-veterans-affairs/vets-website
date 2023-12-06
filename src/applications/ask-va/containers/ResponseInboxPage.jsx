import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { selectProfile } from 'platform/user/selectors';
import {
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ServerErrorAlert } from '../config/helpers';

const replyMessage = {
  attributes: {
    inquiryNumber: '',
    processingStatus: '',
    question: '',
    reply: {
      data: {
        attributes: {
          reply: '',
        },
      },
    },
  },
};

const ResponseInboxPage = ({ profile, params }) => {
  const [error, hasError] = useState(false);
  const [inboxMessage, setInboxMessage] = useState(replyMessage);

  const INQUIRY_DATA = `${environment.API_URL}/ask_va_api/v0/inquiries/${
    params.id
  }?mock=true`;

  const getInquiry = async () => {
    await apiRequest(INQUIRY_DATA)
      .then(res => {
        return setInboxMessage(res.data);
      })
      .catch(() => {
        hasError(true);
      });
  };

  useEffect(() => {
    getInquiry();
  }, []);

  const {
    inquiryNumber,
    processingStatus,
    question,
    reply,
  } = inboxMessage.attributes;
  // TODO: Add a loading Spinner
  return !error ? (
    <div className="row">
      <article className="schemaform-intro">
        <h1 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Response Inbox
        </h1>
        {`${profile.userFullName.first} ${profile.userFullName.last}`}
        <p>
          <strong>Inquiry Number:</strong> {inquiryNumber}
        </p>
        <p>
          Status: <em>{processingStatus}</em>
        </p>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">Question:</h2>
        <br />
        <p>{question}</p>
        <br />
        <hr />
        <Link
          aria-label="Go to Dashboard"
          to="/contact-us/ask-va-too/introduction"
        >
          <VaButton onClick={() => {}} primary text="Return to Dashboard" />
        </Link>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">Activity</h2>
        <p>
          <strong>Reply:</strong>
        </p>
        <p>{reply.data.attributes.reply}</p>
      </article>
    </div>
  ) : (
    <VaAlert status="info" className="row vads-u-margin-y--4">
      <ServerErrorAlert />
      <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
        <VaButton
          onClick={() => {}}
          primary
          text="Sign in with Approved User"
        />
      </Link>
    </VaAlert>
  );
};

ResponseInboxPage.propTypes = {
  params: PropTypes.object,
  profile: PropTypes.shape({
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
  }),
};

function mapStateToProps(state) {
  return {
    profile: selectProfile(state),
  };
}

export default connect(mapStateToProps)(ResponseInboxPage);
