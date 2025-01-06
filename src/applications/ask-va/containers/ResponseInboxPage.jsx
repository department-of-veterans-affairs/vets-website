import {
  VaAlert,
  VaButton,
  VaIcon,
  VaTextarea,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { parse } from 'date-fns';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import BreadCrumbs from '../components/BreadCrumbs';
import FileUpload from '../components/FileUpload';
import NeedHelpFooter from '../components/NeedHelpFooter';
import {
  convertDateForInquirySubheader,
  formatDate,
  getFiles,
  getVAStatusFromCRM,
  ServerErrorAlert,
} from '../config/helpers';
import { envUrl, RESPONSE_PAGE, URL } from '../constants';
import { mockInquiryResponse } from '../utils/mockData';

// Toggle this when testing locally to load dashboard cards
const mockTestingFlag = false;

const emptyMessage = message => (
  <p className="vads-u-background-color--gray-light-alt empty-message">
    {message}
  </p>
);

const getReplySubHeader = messageType => {
  if (!messageType) return 'No messageType';
  if (messageType === 'ResponseFromVA') return 'Response from VA';
  if (messageType === 'ReplyToVA') return 'Reply to VA';
  // Split the string at capital letters and join with spaces
  return messageType.split(/(?=[A-Z])/).join(' ');
};

const ResponseInboxPage = ({ router }) => {
  const [error, setError] = useState(false);
  const [replyTextError, setReplyTextError] = useState('');
  const [sendReply, setSendReply] = useState({ reply: '', files: [] });
  const [loading, setLoading] = useState(true);
  const [inquiryData, setInquiryData] = useState(null);
  // const [fileUploadError, setFileUploadError] = useState([]);

  const getLastSegment = () => {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1];
  };
  const inquiryId = getLastSegment();

  const postApiData = useCallback(
    url => {
      const localStorageFiles = localStorage.getItem('askVAFiles');
      const parsedLocalStoragefiles = JSON.parse(localStorageFiles);
      const transformedResponse = {
        ...sendReply,
        files: getFiles(parsedLocalStoragefiles),
      };
      const options = {
        method: 'POST',
        body: JSON.stringify(transformedResponse),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      setLoading(true);

      if (mockTestingFlag) {
        // Simulate API delay
        return new Promise(resolve => {
          setTimeout(() => {
            setLoading(false);
            localStorage.removeItem('askVAFiles');
            resolve(mockInquiryResponse);
            router.push('/response-sent');
          }, 500);
        });
      }

      return apiRequest(url, options)
        .then(() => {
          setLoading(false);
          localStorage.removeItem('askVAFiles');
          router.push('/response-sent');
        })
        .catch(() => {
          setLoading(false);
          localStorage.removeItem('askVAFiles');
          setError(true);
        });
    },
    [router, sendReply],
  );

  const handleInputChange = event => {
    setSendReply({ ...sendReply, reply: event.target.value });
  };

  const handleSubmitReply = event => {
    event.preventDefault();
    if (sendReply.reply) {
      postApiData(
        `${envUrl}${URL.GET_INQUIRIES}/${inquiryId}${URL.SEND_REPLY}`,
      );
    } else {
      setReplyTextError('Enter your message');
    }
  };

  const getApiData = useCallback(url => {
    setLoading(true);
    setError(false);

    if (mockTestingFlag) {
      // Simulate API delay
      return new Promise(resolve => {
        setTimeout(() => {
          setInquiryData(mockInquiryResponse.data);
          setLoading(false);
          resolve(mockInquiryResponse);
        }, 500);
      });
    }

    return apiRequest(url)
      .then(res => {
        setInquiryData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const handleRetry = () => {
    if (inquiryId) getApiData(`${envUrl}${URL.GET_INQUIRIES}/${inquiryId}`);
  };

  // const handleFileUpload = event => {
  //   const errors = [];
  //   const fileEntries = event.detail;

  //   fileEntries.forEach(fileEntry => {
  //     if (fileEntry) {
  //       let fileError;

  //       if (fileEntry.size > 25 * 1024 * 1024) {
  //         fileError = `File is ${
  //           fileEntry.size
  //         } MB. Please include files less than 25 MB`;
  //       }

  //       if (fileError) errors.push(fileError);
  //     }
  //   });
  //   console.log(errors);

  //   setFileUploadError(errors);
  //   console.log(event.detail);
  //   const reader = new FileReader();
  //   reader.onload = e => {
  //     setSendReply({
  //       ...sendReply,
  //       attachments: [
  //         ...sendReply.attachments,
  //         {
  //           name: file.name,
  //           file: e.target.result.split(',')[1],
  //         },
  //       ],
  //     });
  //   };
  //   reader.readAsDataURL(file);
  // };

  // { 'reply' => 'this is my reply', 'files' => [{ 'file_name' => nil, 'file_content' => nil }] }
  // reference submit tranformer

  useEffect(
    () => {
      if (inquiryId) getApiData(`${envUrl}${URL.GET_INQUIRIES}/${inquiryId}`);
    },
    [inquiryId, getApiData],
  );

  useEffect(
    () => {
      focusElement('h1');
    },
    [loading],
  );

  if (error) {
    return (
      <VaAlert status="error" className="vads-u-margin-y--4">
        <ServerErrorAlert />
        <VaButton onClick={handleRetry} text="Retry" />
      </VaAlert>
    );
  }

  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  if (!inquiryData) {
    return (
      <VaAlert status="info" className="vads-u-margin-y--4">
        No inquiry data available.
      </VaAlert>
    );
  }

  // Filter out "Notification" messages and create a new array with submitterQuestion
  const filteredCorrespondences = [
    {
      type: 'submitterQuestion',
      attributes: {
        createdOn: convertDateForInquirySubheader(
          inquiryData.attributes.createdOn,
        ),
        messageType: 'Your question',
        description: inquiryData.attributes.submitterQuestion,
        originalCreatedOn: inquiryData.attributes.createdOn,
      },
    },
    ...(inquiryData.attributes.correspondences.data
      ? inquiryData.attributes.correspondences.data
          .filter(corr => corr.attributes.messageType !== 'Notification')
          .map(corr => ({
            ...corr,
            attributes: {
              ...corr.attributes,
              createdOn: convertDateForInquirySubheader(
                corr.attributes.createdOn,
              ),
              modifiedOn: convertDateForInquirySubheader(
                corr.attributes.modifiedOn,
              ),
              originalCreatedOn: corr.attributes.createdOn,
            },
          }))
      : []),
  ].sort((a, b) => {
    const dateA = parse(
      a.attributes.originalCreatedOn,
      'MM/dd/yyyy h:mm:ss a',
      new Date(),
    );
    const dateB = parse(
      b.attributes.originalCreatedOn,
      'MM/dd/yyyy h:mm:ss a',
      new Date(),
    );
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="row vads-u-padding-x--1">
      <BreadCrumbs currentLocation={window.location.pathname} />
      <div className="usa-width-two-thirds medium-8 columns vads-u-padding--0">
        <h1 className="vads-u-margin-bottom--2p5">
          {RESPONSE_PAGE.QUESTION_DETAILS}
        </h1>
        <dl className="dashboard-dl">
          <div className="vads-u-margin-bottom--1p5">
            <dt className="sr-only">Status</dt>
            <dd>
              <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
                {getVAStatusFromCRM(inquiryData.attributes.status)}
              </span>
            </dd>
          </div>
          <div className="vads-u-margin-bottom--1">
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Submitted:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {formatDate(inquiryData.attributes.createdOn)}
            </dd>
          </div>
          <div className="vads-u-margin-bottom--1">
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Last updated:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {formatDate(inquiryData.attributes.lastUpdate)}
            </dd>
          </div>
          <div className="vads-u-margin-bottom--1">
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Category:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {inquiryData.attributes.categoryName}
            </dd>
          </div>
          <div>
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Reference number:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {inquiryData.attributes.inquiryNumber}
            </dd>
          </div>
        </dl>

        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline">
          <h2 className="vads-u-margin-y--2">
            {RESPONSE_PAGE.YOUR_CONVERSATION}
          </h2>
          <button
            className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center va-button-link vads-u-text-decoration--none"
            type="button"
            onClick={() => window.print()}
            aria-label="Print conversation"
          >
            <span className="vads-u-color--primary">
              <VaIcon
                size={3}
                icon="print"
                className="vads-u-margin-right--1"
              />
            </span>
            <span className="vads-u-font-weight--bold vads-u-color--primary vads-u-font-size--h3">
              PRINT
            </span>
          </button>
        </div>

        <div className="vads-u-border-color--gray-lighter vads-u-margin-top--3 vads-u-padding-top--3 vads-u-border-top--1px vads-u-margin-bottom--4 vads-u-padding-bottom--6 vads-u-border-bottom--1px">
          {filteredCorrespondences.length === 0 ? (
            <div className="no-messages">
              {emptyMessage(RESPONSE_PAGE.EMPTY_INBOX)}
            </div>
          ) : (
            <va-accordion openSingle={filteredCorrespondences.length === 1}>
              {filteredCorrespondences.map(correspondence => (
                <va-accordion-item
                  bordered
                  key={correspondence.id}
                  header={getReplySubHeader(
                    correspondence.attributes.messageType,
                  )}
                  subHeader={correspondence.attributes.createdOn}
                  level={3}
                >
                  {correspondence.attributes.attachments &&
                    correspondence.attributes.attachments.length > 0 && (
                      <VaIcon
                        icon="attach_file"
                        size={2}
                        alt="Attachment icon"
                        aria-hidden="true"
                        slot="subheader-icon"
                      />
                    )}
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        correspondence.attributes.description || '',
                      ),
                    }}
                    className="vads-u-margin--0 vads-u-margin-bottom--3"
                  />

                  {correspondence.attributes.attachments &&
                    correspondence.attributes.attachments.length > 0 && (
                      <h4 className="vads-u-font-weight--bold vads-u-margin-bottom--2 vads-u-margin-top--3">
                        {RESPONSE_PAGE.ATTACHMENTS}
                      </h4>
                    )}
                  <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-top--2">
                    {correspondence.attributes.attachments &&
                      correspondence.attributes.attachments.length > 0 &&
                      correspondence.attributes.attachments.map(
                        (attachment, index, array) => (
                          <div
                            key={attachment.id}
                            className={`vads-u-margin-bottom--2 ${
                              index === array.length - 1
                                ? 'vads-u-margin-bottom--0'
                                : ''
                            }`}
                          >
                            <va-link
                              href={`${URL.DOWNLOAD_ATTACHMENT}${
                                attachment.id
                              }`}
                              text={`${attachment.name}
                          ${
                            attachment.fileSize
                              ? `(${attachment.fileSize} kb)`
                              : ''
                          }`}
                              icon-name="attach_file"
                              icon-size={3}
                            />
                          </div>
                        ),
                      )}
                  </div>
                </va-accordion-item>
              ))}
            </va-accordion>
          )}
        </div>

        <h2 className="vads-u-margin-bottom--0 vads-u-margin-top--4">
          {RESPONSE_PAGE.SEND_REPLY}
        </h2>
        <form
          className="vads-u-margin-bottom--5 vads-u-margin-top--0"
          onSubmit={handleSubmitReply}
        >
          <fieldset>
            <VaTextarea
              className="resize-y"
              error={replyTextError}
              label={RESPONSE_PAGE.YOUR_MESSAGE}
              name="reply message"
              onInput={handleInputChange}
              value={sendReply.reply}
              required
            />

            {/* <VaFileInputMultiple
              accept={null}
              className=""
              label="Select optional files to upload"
              hint="You can upload a .pdf, .jpeg, or .png file that is less than 25 MB in size"
              name="my-file-input-multiple"
              onVaMultipleChange={handleFileUpload}
              error={fileUploadError}
              errors={fileUploadError}
              value={null}
            />
            {fileUploadError.length > 0 && (
              <VaAlert status="error">{fileUploadError}</VaAlert>
            )} */}

            <FileUpload />

            <VaButton
              onClick={handleSubmitReply}
              primary
              className="vads-u-margin-top--3"
              text={RESPONSE_PAGE.SUBMIT_MESSAGE}
              aria-label="Submit reply"
            />
          </fieldset>
        </form>
        <NeedHelpFooter />
      </div>
    </div>
  );
};

ResponseInboxPage.propTypes = {
  loggedIn: PropTypes.bool,
  params: PropTypes.object,
  router: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(withRouter(ResponseInboxPage));
