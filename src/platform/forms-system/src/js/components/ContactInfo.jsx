import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Element } from 'react-scroll';

import {
  focusElement,
  scrollTo,
  scrollAndFocus,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  selectProfile,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

// import { generateMockUser } from 'platform/site-wide/user-nav/tests/mocks/user';
import { generateMockUser } from '../../../../site-wide/user-nav/tests/mocks/user';

// import { AddressView } from '@department-of-veterans-affairs/platform-user/exports';
// import AddressView from '@@vap-svc/components/AddressField/AddressView';
import AddressView from '../../../../user/profile/vap-svc/components/AddressField/AddressView';

// import FormNavButtons from '@department-of-veterans-affairs/platform-forms-system/FormNavButtons';
// import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import FormNavButtons from './FormNavButtons';

import readableList from '../utilities/data/readableList';
import {
  setReturnState,
  getReturnState,
  clearReturnState,
  renderTelephone,
  getMissingInfo,
  REVIEW_CONTACT,
  convertNullishObjectValuesToEmptyString,
  contactInfoPropTypes,
} from '../utilities/data/profile';
import { getValidationErrors } from '../utilities/validations';

/**
 * Render contact info page
 * @param {Object} data - full form data
 * @param {Function} goBack - CustomPage param
 * @param {Function} goForward - CustomPage param
 * @param {Boolean} onReviewPage - CustomPage param
 * @param {Function} updatePage - CustomPage param
 * @param {Element} contentBeforeButtons - CustomPage param
 * @param {Element} contentAfterButtons - CustomPage param
 * @param {Function} setFormData - CustomPage param
 * @param {Object} content - Contact info page content
 * @param {String} contactPath - Contact info path; used in edit page path
 * @parma {import('../utilities/data/profile').ContactInfoKeys} keys - contact info data key
 * @param {String[]} requiredKeys - list of keys of required fields
 * @returns
 */
const ContactInfo = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  contentBeforeButtons,
  contentAfterButtons,
  setFormData,
  content,
  contactPath,
  keys,
  requiredKeys,
  uiSchema,
  testContinueAlert = false,
  contactInfoPageKey,
}) => {
  const wrapRef = useRef(null);
  window.sessionStorage.setItem(REVIEW_CONTACT, onReviewPage || false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editState] = useState(getReturnState());

  // vapContactInfo is an empty object locally, so mock it
  const profile = useSelector(selectProfile) || {};
  const loggedIn = useSelector(isLoggedIn) || false;
  const contactInfo =
    loggedIn && environment.isLocalhost()
      ? generateMockUser({ authBroker: 'iam' }).data.attributes
          .vet360ContactInformation
      : profile.vapContactInfo || {};

  const dataWrap = data[keys.wrapper] || {};
  const email = dataWrap[keys.email] || '';
  const homePhone = dataWrap[keys.homePhone] || {};
  const mobilePhone = dataWrap[keys.mobilePhone] || {};
  const address = dataWrap[keys.address] || {};

  const missingInfo = getMissingInfo({
    data: dataWrap,
    keys,
    content,
    requiredKeys,
  });

  const list = readableList(missingInfo);
  const plural = missingInfo.length > 1;

  const validationErrors = uiSchema?.['ui:required']?.(data)
    ? getValidationErrors(uiSchema?.['ui:validations'] || [], {}, data)
    : [];

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    onGoBack: () => {
      clearReturnState();
      goBack();
    },
    onGoForward: () => {
      setSubmitted(true);
      if (missingInfo.length || validationErrors.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        clearReturnState();
        goForward(data);
      }
    },
    updatePage: () => {
      setSubmitted(true);
      if (missingInfo.length || validationErrors.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        setReturnState('true');
        updatePage();
      }
    },
  };

  useEffect(
    () => {
      if (
        (keys.email && (contactInfo.email?.emailAddress || '') !== email) ||
        (keys.homePhone &&
          contactInfo.homePhone?.updatedAt !== homePhone?.updatedAt) ||
        (keys.mobilePhone &&
          contactInfo.mobilePhone?.updatedAt !== mobilePhone?.updatedAt) ||
        (keys.address &&
          contactInfo.mailingAddress?.updatedAt !== address?.updatedAt)
      ) {
        const wrapper = { ...data[keys.wrapper] };
        if (keys.address) {
          wrapper[keys.address] = convertNullishObjectValuesToEmptyString(
            contactInfo.mailingAddress,
          );
        }
        if (keys.homePhone) {
          wrapper[keys.homePhone] = convertNullishObjectValuesToEmptyString(
            contactInfo.homePhone,
          );
        }
        if (keys.mobilePhone) {
          wrapper[keys.mobilePhone] = convertNullishObjectValuesToEmptyString(
            contactInfo.mobilePhone,
          );
        }
        if (keys.email) {
          wrapper[keys.email] = contactInfo.email?.emailAddress;
        }
        setFormData({ ...data, [keys.wrapper]: wrapper });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contactInfo, setFormData, data, keys],
  );

  useEffect(
    () => {
      if (editState) {
        const [lastEdited, returnState] = editState.split(',');
        setTimeout(() => {
          const target =
            returnState === 'canceled'
              ? `#edit-${lastEdited}`
              : `#updated-${lastEdited}`;
          scrollTo(
            onReviewPage
              ? `${contactInfoPageKey}ScrollElement`
              : 'topScrollElement',
          );
          focusElement(onReviewPage ? `#${contactInfoPageKey}Header` : target);
        });
      }
    },
    [editState, onReviewPage],
  );

  useEffect(
    () => {
      if ((hasInitialized && missingInfo.length) || testContinueAlert) {
        // page had an error flag, so we know when to show a success alert
        setHadError(true);
      }
      setTimeout(() => {
        setHasInitialized(true);
      });
    },
    [missingInfo, hasInitialized, testContinueAlert],
  );

  const MainHeader = onReviewPage ? 'h4' : 'h3';
  const Headers = onReviewPage ? 'h5' : 'h4';
  const headerClassNames = ['vads-u-font-size--h4', 'vads-u-width--auto'].join(
    ' ',
  );

  // keep alerts in DOM, so we don't have to delay focus; but keep the 100ms
  // delay to move focus away from the h3
  const showSuccessAlert = (id, text) => (
    <va-alert
      id={`updated-${id}`}
      visible={editState === `${id},updated`}
      class="vads-u-margin-y--1"
      status="success"
      background-only
      role="alert"
    >
      {`${text} ${content.updated}`}
    </va-alert>
  );

  const editText = content.edit.toLowerCase();

  // Loop to separate pages when editing
  // Each Link includes an ID for focus management on the review & submit page
  const contactSection = [
    keys.homePhone ? (
      <React.Fragment key="home">
        <Headers className={`${headerClassNames} vads-u-margin-top--0p5`}>
          {content.homePhone}
        </Headers>
        {showSuccessAlert('home-phone', content.homePhone)}
        <span className="dd-privacy-hidden" data-dd-action-name="home phone">
          {renderTelephone(dataWrap[keys.homePhone])}
        </span>
        {loggedIn && (
          <p className="vads-u-margin-top--0p5">
            <Link
              id="edit-home-phone"
              to={`/edit-${contactPath}-home-phone`}
              aria-label={content.editHomePhone}
            >
              {editText}
            </Link>
          </p>
        )}
      </React.Fragment>
    ) : null,

    keys.mobilePhone ? (
      <React.Fragment key="mobile">
        <Headers className={headerClassNames}>{content.mobilePhone}</Headers>
        {showSuccessAlert('mobile-phone', content.mobilePhone)}
        <span className="dd-privacy-hidden" data-dd-action-name="mobile phone">
          {renderTelephone(dataWrap[keys.mobilePhone])}
        </span>
        {loggedIn && (
          <p className="vads-u-margin-top--0p5">
            <Link
              id="edit-mobile-phone"
              to={`/edit-${contactPath}-mobile-phone`}
              aria-label={content.editMobilePhone}
            >
              {editText}
            </Link>
          </p>
        )}
      </React.Fragment>
    ) : null,

    keys.email ? (
      <React.Fragment key="email">
        <Headers className={headerClassNames}>{content.email}</Headers>
        {showSuccessAlert('email', content.email)}
        <span className="dd-privacy-hidden" data-dd-action-name="email">
          {dataWrap[keys.email] || ''}
        </span>
        {loggedIn && (
          <p className="vads-u-margin-top--0p5">
            <Link
              id="edit-email"
              to={`/edit-${contactPath}-email-address`}
              aria-label={content.editEmail}
            >
              {editText}
            </Link>
          </p>
        )}
      </React.Fragment>
    ) : null,

    keys.address ? (
      <React.Fragment key="mailing">
        <Headers className={headerClassNames}>{content.mailingAddress}</Headers>
        {showSuccessAlert('address', content.mailingAddress)}
        <AddressView data={dataWrap[keys.address]} />
        {loggedIn && (
          <p className="vads-u-margin-top--0p5">
            <Link
              id="edit-address"
              to={`/edit-${contactPath}-mailing-address`}
              aria-label={content.editMailingAddress}
            >
              {editText}
            </Link>
          </p>
        )}
      </React.Fragment>
    ) : null,
  ];

  const navButtons = onReviewPage ? (
    <va-button text={content.update} onClick={handlers.updatePage} />
  ) : (
    <>
      {contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.onGoBack}
        goForward={handlers.onGoForward}
      />
      {contentAfterButtons}
    </>
  );

  return (
    <div className="vads-u-margin-y--2">
      <Element name={`${contactInfoPageKey}ScrollElement`} />
      <form onSubmit={handlers.onSubmit}>
        <MainHeader
          id={`${contactInfoPageKey}Header`}
          className="vads-u-margin-top--0"
        >
          {content.title}
        </MainHeader>
        {content.description}
        {!loggedIn && (
          <strong className="usa-input-error-message">
            You must be logged in to enable view and edit this page.
          </strong>
        )}
        <div ref={wrapRef}>
          {hadError &&
            missingInfo.length === 0 &&
            validationErrors.length === 0 && (
              <div className="vads-u-margin-top--1p5">
                <va-alert status="success" background-only>
                  <div className="vads-u-font-size--base">
                    {content.alertContent}
                  </div>
                </va-alert>
              </div>
            )}
          {missingInfo.length > 0 && (
            <>
              <p className="vads-u-margin-top--1p5">
                <strong>Note:</strong>
                {missingInfo[0].startsWith('e') ? ' An ' : ' A '}
                {list} {plural ? 'are' : 'is'} required for this application.
              </p>
              {submitted && (
                <div className="vads-u-margin-top--1p5" role="alert">
                  <va-alert status="error" background-only>
                    <div className="vads-u-font-size--base">
                      We still don’t have your {list}. Please edit and update
                      the field.
                    </div>
                  </va-alert>
                </div>
              )}
              <div className="vads-u-margin-top--1p5" role="alert">
                <va-alert status="warning" background-only>
                  <div className="vads-u-font-size--base">
                    Your {list} {plural ? 'are' : 'is'} missing. Please edit and
                    update the {plural ? 'fields' : 'field'}.
                  </div>
                </va-alert>
              </div>
            </>
          )}
          {submitted &&
            missingInfo.length === 0 &&
            validationErrors.length > 0 && (
              <div className="vads-u-margin-top--1p5" role="alert">
                <va-alert status="error" background-only>
                  <div className="vads-u-font-size--base">
                    {validationErrors[0]}
                  </div>
                </va-alert>
              </div>
            )}
        </div>
        <div className="blue-bar-block vads-u-margin-top--4">
          <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
            {contactSection}
          </div>
        </div>
      </form>
      <div className="vads-u-margin-top--4">{navButtons}</div>
    </div>
  );
};

ContactInfo.propTypes = {
  contactInfoPageKey: contactInfoPropTypes.contactInfoPageKey,
  contactPath: PropTypes.string,
  content: contactInfoPropTypes.content, // content passed in from profileContactInfo
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: contactInfoPropTypes.data,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  keys: contactInfoPropTypes.keys,
  requiredKeys: PropTypes.shape([PropTypes.string]),
  setFormData: PropTypes.func,
  testContinueAlert: PropTypes.bool, // for unit testing only
  uiSchema: PropTypes.shape({
    'ui:required': PropTypes.func,
    'ui:validations': PropTypes.array,
  }),
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default ContactInfo;
