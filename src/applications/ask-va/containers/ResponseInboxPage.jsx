import {
  VaAlert,
  VaButton,
  VaFileInputMultiple,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { format, parse } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import BreadCrumbs from '../components/BreadCrumbs';
import NeedHelpFooter from '../components/NeedHelpFooter';
import { ServerErrorAlert } from '../config/helpers';
import { baseURL, envUrl, RESPONSE_PAGE, URL } from '../constants';
import { mockInquiryData } from '../utils/mockData';

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
const getReplySubHeader = messageType => messageType.split(':')[1].trim();

const ResponseInboxPage = ({ loggedIn }) => {
  const [error, hasError] = useState(false);
  const [sendReply, setSendReply] = useState({ reply: '', attachments: [] });
  const [loading, isLoading] = useState(true);
  const [inquiryData, setInquiryData] = useState([]);

  const getLastSegment = () => {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1];
  };
  const inquiryId = getLastSegment();

  const formatDate = dateString => {
    const parsedDate = parse(dateString, 'MM/dd/yy', new Date());
    return format(parsedDate, 'MMM d, yyyy');
  };

  const options = {
    body: JSON.stringify(sendReply),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postApiData = url => {
    isLoading(true);
    return apiRequest(url, options)
      .then(() => {
        isLoading(false);
      })
      .catch(() => {
        isLoading(false);
        hasError(true);
      });
  };

  const handlers = {
    onInput: event => {
      setSendReply({ ...sendReply, reply: event.target.value });
    },

    onSubmit: () => {
      if (sendReply.reply) {
        // Using a temporary test id provided by BE, will be replaced once inquiry endpoint is complete
        const temporaryTestInquiryId = 'A-20230305-306178';
        postApiData(
          `${envUrl}${baseURL}/inquiries/${temporaryTestInquiryId}${
            URL.SEND_REPLY
          }`,
        );
      }
    },
  };

  const getInquiryData = async () => {
    // using Mock data till static data is updated
    const inquiryMock = mockInquiryData.data.find(
      inquiry => inquiry.id === inquiryId,
    );
    setInquiryData(inquiryMock);
    hasError(false);
    isLoading(false);
  };

  useEffect(() => {
    getInquiryData();
  }, []);

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return !error && loggedIn ? (
    <div className="row">
      <BreadCrumbs currentLocation={location.pathname} />
      <div className="usa-width-two-thirds medium-8 columns vads-u-padding--0">
        <h1 className="">{RESPONSE_PAGE.QUESTION_DETAILS}</h1>

        <div className="vads-u-margin-bottom--3">
          <div>
            <span className="usa-label">{inquiryData.attributes.status}</span>
          </div>

          <div className="vads-u-margin-top--2">
            <p className="vads-u-margin--0">
              <span className="vads-u-font-weight--bold">Submitted:</span>{' '}
              {formatDate(inquiryData.attributes.createdOn)}
            </p>
            <p className="vads-u-margin--0">
              <span className="vads-u-font-weight--bold">Last updated:</span>{' '}
              {formatDate(inquiryData.attributes.lastUpdate)}
            </p>
            <p className="vads-u-margin--0">
              <span className="vads-u-font-weight--bold">Category:</span>{' '}
              {inquiryData.attributes.category}
            </p>
            <p className="vads-u-margin--0">
              <span className="vads-u-font-weight--bold">
                Reference number:
              </span>{' '}
              {inquiryData.attributes.inquiryNumber}
            </p>
          </div>
        </div>

        {/* Temporarily hidden for research study
        <h2 className="vad-u-margin-top--0">{RESPONSE_PAGE.ATTACHMENTS}</h2>
        {inboxMessage.attributes.attachments.length === 0
          ? emptyMessage(RESPONSE_PAGE.NO_ATTACHMENTS)
          : inboxMessage.attributes.attachments.map(attachment => (
              <div key={attachment.id}>{attachmentBox(attachment.name)}</div>
            ))}
        <hr /> */}
        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline">
          <h2 className="vads-u-margin-y--2">
            {RESPONSE_PAGE.YOUR_CONVERSATION}
          </h2>
          <button
            className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center va-button-link vads-u-text-decoration--none"
            type="button"
            onClick={() => window.print()}
          >
            <span className="vads-u-color--primary">
              <VaIcon
                size={3}
                icon="print"
                className="vads-u-margin-right--1"
                srtext="icon representing print"
                aria-hidden="true"
              />
            </span>
            <span className="vads-u-font-weight--bold vads-u-color--primary vads-u-font-size--h3">
              PRINT
            </span>
          </button>
        </div>

        <hr className="vads-u-border-color--gray-lightest" />
        {inquiryData.attributes.reply.data.length === 0 ? (
          <div className="no-messages">
            {emptyMessage(RESPONSE_PAGE.EMPTY_INBOX)}
          </div>
        ) : (
          <div className="inbox-replies">
            <va-accordion bordered>
              {inquiryData.attributes.reply.data.map(message => (
                <va-accordion-item
                  key={message.id}
                  header={message.modifiedOn}
                  subHeader={getReplySubHeader(message.messageType)}
                >
                  <p className="vads-u-margin--0">{message.attributes.reply}</p>
                  {message.attributes.attachmentNames.length > 0 && (
                    <p className="vads-u-font-size--h3">
                      {RESPONSE_PAGE.ATTACHMENTS}
                    </p>
                  )}
                  {message.attributes.attachmentNames.length > 0 &&
                    message.attributes.attachmentNames.map(attachment => (
                      <div key={attachment.id}>
                        {attachmentBox(attachment.name)}
                      </div>
                    ))}
                </va-accordion-item>
              ))}
            </va-accordion>
          </div>
        )}

        <h2 className="vads-u-margin-bottom--0">{RESPONSE_PAGE.SEND_REPLY}</h2>
        <form onSubmit={handlers.onSubmit}>
          <fieldset>
            <va-textarea
              class="resize-y"
              label={RESPONSE_PAGE.YOUR_MESSAGE}
              name="reply message"
              onInput={handlers.onInput}
              value={sendReply.reply}
              required
            />

            <h4 className="vads-u-margin-top--4">
              {RESPONSE_PAGE.ATTACHMENTS}
            </h4>
            <VaFileInputMultiple
              label="Select files to upload"
              hint="You can upload a .pdf, .jpeg, or .png file. that is less than 25 MB in size"
              name="my-file-input"
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
              uswds
            />

            <VaButton
              onClick={handlers.onSubmit}
              primary
              className="vads-u-margin-y--2"
              text={RESPONSE_PAGE.SUBMIT_MESSAGE}
            />
          </fieldset>
        </form>
        <NeedHelpFooter />
      </div>
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
