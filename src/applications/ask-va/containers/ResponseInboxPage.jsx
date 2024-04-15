import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import moment from 'moment';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import {
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NeedHelpFooter from '../components/NeedHelpFooter';
import { ServerErrorAlert } from '../config/helpers';
import { RESPONSE_PAGE } from '../constants';
import { replyMessage } from './mockInquiryReplyData';

const attachmentBox = fileName => (
  <div className="attachment-box vads-u-display--flex vads-u-justify-content--space-between vads-u-background-color--gray-light-alt">
    <p>
      <strong>{fileName}</strong>
    </p>
    <p>
      {' '}
      <VaButton onClick={() => {}} secondary text={RESPONSE_PAGE.DELETE_FILE} />
    </p>
  </div>
);
const emptyMessage = message => (
  <p className="vads-u-background-color--gray-light-alt empty-message">
    {message}
  </p>
);
const getReplyHeader = messageType => messageType.split(':')[1].trim();
const getMessageDate = date => moment(date).format('MMM D, YYYY');

const ResponseInboxPage = ({ loggedIn }) => {
  const [error, hasError] = useState(false);
  const [inboxMessage, setInboxMessage] = useState({});
  const [sendReply, setSendReply] = useState({ reply: '', attachments: [] });
  const [loading, isLoading] = useState(true);

  const handlers = {
    onInput: event => {
      setSendReply({ ...sendReply, reply: event.target.value });
    },

    onSubmit: () => {
      if (sendReply.reply) {
        // TODO: Add endpoint to submit the reply
      }
    },
  };
  // params will come from props
  // const INQUIRY_DATA = `${environment.API_URL}/ask_va_api/v0/inquiries/${
  //   params.id
  // }?mock=true`;

  const getInquiry = async () => {
    // using Mock data till static data is updated
    setInboxMessage(replyMessage);
    hasError(false);
    isLoading(false);
    /// ///
    // await apiRequest(INQUIRY_DATA)
    // eslint-disable-next-line no-unused-vars
    // .then(res => {
    //   setInboxMessage(res.data);
    //   isLoading(false);
    // })
    // .catch(() => {
    //   hasError(true);
    //   isLoading(false);
    // });
  };

  useEffect(() => {
    getInquiry();
  }, []);

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }
  return !error && loggedIn ? (
    <div className="row">
      <article>
        <h1 className="vad-u-margin-top--0">
          {RESPONSE_PAGE.QUESTION_DETAILS}
        </h1>
        <p>
          <strong>{RESPONSE_PAGE.INQUIRY_NUM}</strong>{' '}
          {inboxMessage.attributes.inquiryNumber}
        </p>
        <p>
          <strong>{RESPONSE_PAGE.STATUS}</strong>{' '}
          {inboxMessage.attributes.processingStatus}
        </p>
        <h2 className="vad-u-margin-top--0">{RESPONSE_PAGE.YOUR_QUESTION}</h2>

        <p className="vads-u-margin-top--2p5 vads-u-margin-bottom--5">
          {inboxMessage.attributes.question}
        </p>
        <h2 className="vad-u-margin-top--0">{RESPONSE_PAGE.ATTACHMENTS}</h2>
        {inboxMessage.attributes.attachments.length === 0
          ? emptyMessage(RESPONSE_PAGE.NO_ATTACHMENTS)
          : inboxMessage.attributes.attachments.map(attachment => (
              <div key={attachment.id}>{attachmentBox(attachment.name)}</div>
            ))}
        <hr />
        <h2 className="vads-u-margin-y--1p5">{RESPONSE_PAGE.INBOX}</h2>
        {inboxMessage.attributes.reply.data.length === 0 ? (
          <div className="no-messages">
            {emptyMessage(RESPONSE_PAGE.EMPTY_INBOX)}
          </div>
        ) : (
          <div className="inbox-replies">
            <va-accordion bordered>
              {inboxMessage.attributes.reply.data.map(message => (
                <va-accordion-item
                  key={message.id}
                  header={getReplyHeader(message.message_type)}
                  subHeader={getMessageDate(message.modifiedon)}
                >
                  <p>{message.attributes.reply}</p>
                  <p className="vads-u-font-size--h3">
                    {RESPONSE_PAGE.ATTACHMENTS}
                  </p>
                  {message.attributes.attachmentNames.length === 0
                    ? emptyMessage(RESPONSE_PAGE.NO_ATTACHMENTS)
                    : message.attributes.attachmentNames.map(attachment => (
                        <div key={attachment.id}>
                          {attachmentBox(attachment.name)}
                        </div>
                      ))}
                </va-accordion-item>
              ))}
            </va-accordion>
          </div>
        )}

        <h3 className="vad-u-margin-top--0">{RESPONSE_PAGE.SEND_REPLY}</h3>
        <form onSubmit={handlers.onSubmit}>
          <fieldset>
            <va-textarea
              class="resize-y"
              label={RESPONSE_PAGE.YOUR_MESSAGE}
              name="reply message"
              onInput={handlers.onInput}
              value={sendReply.reply}
            />

            <h3>{RESPONSE_PAGE.UPLOAD_YOUR_FILES}</h3>
            <p>{RESPONSE_PAGE.UPLOAD_INFO.MESSAGE}</p>
            <p>{RESPONSE_PAGE.UPLOAD_INFO.LIST_HEADING}</p>
            <ul>
              <li>{RESPONSE_PAGE.UPLOAD_INFO.LIST_ITEM_1}</li>
              <li>{RESPONSE_PAGE.UPLOAD_INFO.LIST_ITEM_2}</li>
            </ul>

            <VaButton
              onClick={() => {
                setSendReply({
                  ...sendReply,
                  attachments: [
                    ...sendReply.attachments,
                    {
                      name: 'new_file_name.pdf',
                      file: 'c2RncmRmaHMgZGZmc2ZkZ3Nj',
                    },
                  ],
                });
              }}
              secondary
              text={RESPONSE_PAGE.UPLOAD_BTN}
            />
            <h4>{RESPONSE_PAGE.ATTACHMENTS}</h4>
            {sendReply.attachments.length === 0
              ? emptyMessage(RESPONSE_PAGE.NO_ATTACHMENTS)
              : sendReply.attachments.map(attachment => (
                  <div key={attachment.id}>
                    {attachmentBox(attachment.name)}
                  </div>
                ))}
            <VaButton
              onClick={handlers.onSubmit}
              primary
              className="vads-u-margin-y--2"
              text={RESPONSE_PAGE.SUBMIT_MESSAGE}
            />
          </fieldset>
        </form>
        <Link to="/contact-us/ask-va-too/introduction">
          Return to dashboard
        </Link>
        <NeedHelpFooter />
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
  loggedIn: PropTypes.bool,
  params: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(ResponseInboxPage);
