import {
  VaAlert,
  VaButton,
  VaIcon,
  VaTextarea,
  VaLink,
  VaTelephone,
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
} from '../config/helpers';
import {
  envUrl,
  getMockTestingFlagForAPI,
  RESPONSE_PAGE,
  URL,
} from '../constants';
import manifest from '../manifest.json';
import { mockInquiryResponse, mockAttachmentResponse } from '../utils/mockData';
import { askVAAttachmentStorage } from '../utils/StorageAdapter';

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

  const getLastSegment = () => {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1];
  };
  const inquiryId = getLastSegment();

  const postApiData = useCallback(
    async url => {
      const files = await askVAAttachmentStorage.get('attachments');
      const transformedResponse = {
        ...sendReply,
        files: getFiles(files),
      };
      const options = {
        method: 'POST',
        body: JSON.stringify(transformedResponse),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      setLoading(true);

      if (getMockTestingFlagForAPI()) {
        // Simulate API delay
        return new Promise(resolve => {
          setTimeout(() => {
            setLoading(false);
            askVAAttachmentStorage.clear();
            resolve(mockInquiryResponse);
            router.push('/response-sent');
          }, 500);
        });
      }

      return apiRequest(url, options)
        .then(() => {
          setLoading(false);
          askVAAttachmentStorage.clear();
          router.push('/response-sent');
        })
        .catch(() => {
          setLoading(false);
          askVAAttachmentStorage.clear();
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

    if (getMockTestingFlagForAPI() && !window.Cypress) {
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

  const getDownload = (fileName, fileContent) => {
    const fileExtension = fileName.split('.');
    const extension = fileExtension.pop();
    const fileType =
      extension === 'pdf' ? 'application/pdf' : `image/${extension}`;

    const decoded = atob(fileContent);
    const base64String =
      decoded.split(',')[1] === undefined ? decoded : decoded.split(',')[1];
    const byteCharacters = atob(base64String);
    const byteArray = Uint8Array.from(byteCharacters, char =>
      char.charCodeAt(0),
    );
    const blob = new Blob([byteArray], { type: fileType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const getDownloadData = url => {
    setError(false);

    if (getMockTestingFlagForAPI()) {
      // Simulate API delay
      return new Promise(resolve => {
        setTimeout(() => {
          const res = mockAttachmentResponse;
          getDownload(
            res.data.attributes.fileName,
            res.data.attributes.fileContent,
          );
          resolve(mockAttachmentResponse);
        }, 500);
      });
    }

    return apiRequest(url)
      .then(res => {
        getDownload(
          res.data.attributes.fileName,
          res.data.attributes.fileContent,
        );
      })
      .catch(() => {
        setError(true);
      });
  };

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
      <>
        <VaAlert status="error" className="vads-u-margin-y--4">
          <h2
            slot="headline"
            className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
          >
            We’ve run into a problem
          </h2>
          <p className="vads-u-font-size--base">
            We’re sorry. Something went wrong on our end. Try again later or
            call us at <VaTelephone contact="800-698-2411" /> (
            <VaTelephone contact="711" tty />
            ). We’re here 24/7.
          </p>
        </VaAlert>
      </>
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
        attachments: inquiryData.attributes.attachments,
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
              <p className="vads-u-background-color--gray-light-alt empty-message">
                {RESPONSE_PAGE.EMPTY_INBOX}
              </p>
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
                        (file, index, array) => {
                          return (
                            <div
                              key={file.id}
                              className={`vads-u-margin-bottom--2 ${
                                index === array.length - 1
                                  ? 'vads-u-margin-bottom--0'
                                  : ''
                              }`}
                            >
                              <va-icon
                                icon="attach_file"
                                size={3}
                                className="vads-u-margin--right-1p5"
                              />
                              <VaLink
                                text={file.name}
                                onClick={() =>
                                  getDownloadData(
                                    `${envUrl}${URL.DOWNLOAD_ATTACHMENT}${
                                      file.id
                                    }`,
                                  )
                                }
                              />
                            </div>
                          );
                        },
                      )}
                  </div>
                </va-accordion-item>
              ))}
            </va-accordion>
          )}
        </div>

        {inquiryData.attributes?.allowReplies ? (
          <>
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

                {inquiryData.attributes?.allowAttachments && <FileUpload />}

                <VaButton
                  onClick={handleSubmitReply}
                  primary
                  className="vads-u-margin-top--3"
                  text={RESPONSE_PAGE.SUBMIT_MESSAGE}
                  aria-label="Submit reply"
                />
              </fieldset>
            </form>
          </>
        ) : (
          <div className="vads-u-margin-top--6 vads-u-margin-bottom--7">
            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
            >
              <h3 id="track-your-status-on-mobile" slot="headline">
                Send a reply
              </h3>
              <p className="vads-u-margin-y--0">
                To send a reply,{' '}
                <a
                  className="usa-link"
                  href={`${manifest.rootUrl}/introduction`}
                >
                  ask a new question
                </a>
                .
              </p>
            </va-alert>
          </div>
        )}

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
