import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';

import {
  focusElement,
  scrollTo,
  scrollAndFocus,
} from '@department-of-veterans-affairs/platform-utilities/ui';

import {
  selectProfile,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

import AddressView from '@@vap-svc/components/AddressField/AddressView';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import { getValidationErrors } from 'platform/forms-system/src/js/utilities/validations';
import { Element } from 'platform/utilities/scroll';

import {
  setReturnState,
  getReturnState,
  clearReturnState,
  getMissingInfo,
  REVIEW_CONTACT,
  convertNullishObjectValuesToEmptyString,
  contactInfoPropTypes,
} from '../../../../../utils/data/task-gray/profile';
import { InfoSection } from '../../../../../shared/components/InfoSection';
import { isOnReviewPage } from '../../../TaskOrange/utils/reviewPage';
import { formatPhoneNumber } from '../../../../../utils/helpers/general';

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

export const ContactInformationBase = ({ location }) => {
  const profile = useSelector(selectProfile) || {};
  const contactInfo = profile.vapContactInfo || {};
  const { areaCode, phoneNumber } = contactInfo.mobilePhone;
  const fullNumber = areaCode + phoneNumber;

  const isReviewPage = isOnReviewPage(location?.pathname);
  const title = isReviewPage ? null : 'Contact information';
  return (
    <InfoSection title={title} titleLevel={3}>
      <InfoSection.SubHeading level={4} text="Mailing Address" editLink="/" />
      <InfoSection.InfoBlock
        label="Street address"
        value={contactInfo?.mailingAddress?.addressLine1}
      />
      <InfoSection.InfoBlock
        label="Street address line 2"
        value={contactInfo?.mailingAddress?.addressLine2 || 'Not provided'}
      />
      <InfoSection.InfoBlock
        label="City"
        value={contactInfo?.mailingAddress?.city}
      />
      <InfoSection.InfoBlock
        label="State"
        value={contactInfo?.mailingAddress?.stateCode}
      />
      <InfoSection.InfoBlock
        label="Zip code"
        value={contactInfo?.mailingAddress?.zipCode}
      />

      <InfoSection.SubHeading
        text="Additional contact information"
        editLink="/"
        level={4}
      />
      <InfoSection.InfoBlock
        label="Phone number"
        value={formatPhoneNumber(fullNumber)}
      />
      <InfoSection.InfoBlock
        label="Email address"
        value={contactInfo?.email.emailAddress}
      />
    </InfoSection>
  );
};
ContactInformationBase.propTypes = {
  location: PropTypes.object,
};

export const ContactInformationInfoSection = withRouter(ContactInformationBase);

export const ContactInfo = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  contentBeforeButtons,
  contentAfterButtons,
  setFormData,
  content,
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
  const contactInfo = profile.vapContactInfo || {};
  const dataWrap = data[keys.wrapper] || {};
  const email = dataWrap[keys.email] || '';
  const homePhone = dataWrap[keys.homePhone] || {};
  const mobilePhone = dataWrap[keys.mobilePhone] || {};
  const address = contactInfo[keys.address] || {};

  const missingInfo = getMissingInfo({
    // data: dataWrap,
    data: contactInfo,
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
    [contactInfoPageKey, editState, onReviewPage],
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

  const Headers = onReviewPage ? 'h5' : 'h3';
  const headerClassNames = [
    'vads-u-font-size--h3',
    'vads-u-width--auto',
    'vads-u-margin-top--0',
  ].join(' ');

  const showSuccessAlert = id => (
    <va-alert
      id={`updated-${id}`}
      visible={editState === `${id},updated`}
      class="vads-u-margin-y--1"
      status="success"
      background-only
      role="alert"
    >
      <h2 slot="headline">We’ve updated your mailing address</h2>
      <p className="vads-u-margin-y--0">
        We’ve made these changes to this form and your VA.gov profile.
      </p>
    </va-alert>
  );

  const editText = content.edit;

  // Loop to separate pages when editing
  // Each Link includes an ID for focus management on the review & submit page
  const contactSection = [
    keys.address ? (
      <va-card
        data-testid="mini-summary-card"
        class="vads-u-margin-y--3 gray-task contact-info-card"
        key="mailing"
        uswds
      >
        <Headers className={headerClassNames}>{content.mailingAddress}</Headers>
        <AddressView className="vads-u-margin--2" data={address} />
        {/* <AddressView
          className="vads-u-margin--2"
          data={dataWrap[keys.address]}
        /> */}
        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-top--1 vads-u-margin-bottom--neg1">
          <Link
            id="edit-mailing-address"
            to="2/task-gray/veteran-information/edit-mailing-address"
            aria-label={content.editMailingAddress}
            className="vads-u-padding--0p25 vads-u-padding-x--0p5 vads-u-margin-left--neg0p5 vads-u-margin-top--1 vads-u-margin-bottom--1"
          >
            <span>
              <strong>{editText}</strong>
              <va-icon
                icon="navigate_next"
                size={3}
                className="vads-u-padding-left--0p5"
              />
            </span>
          </Link>
        </div>
      </va-card>
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
    <>
      {editState !== 'address,updated' ? (
        <va-alert>
          We’ve prefilled some of your information. If you need to make changes,
          you can select edit on this screen.{' '}
          <strong>
            Your changes will affect this form and your VA.gov profile.
          </strong>
        </va-alert>
      ) : null}
      <div className="vads-u-margin-y--2">
        <Element name={`${contactInfoPageKey}ScrollElement`} />
        <form onSubmit={handlers.onSubmit}>
          {showSuccessAlert('address')}
          <p>We’ll send any updates about your request to this address.</p>
          {!loggedIn && (
            <strong className="usa-input-error-message">
              You must be logged in to enable view and edit this page.
            </strong>
          )}
          <div ref={wrapRef}>
            {hadError &&
              missingInfo.length === 0 &&
              validationErrors.length === 0 && (
                <div className="vads-u-margin-top--1p5 vads-u-margin-bottom--2">
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
                      Your {list} {plural ? 'are' : 'is'} missing. Please edit
                      and update the {plural ? 'fields' : 'field'}.
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
          <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
            {contactSection}
          </div>
        </form>
        <div className="vads-u-margin-top--4">{navButtons}</div>
      </div>
    </>
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
  location: PropTypes.object,
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
