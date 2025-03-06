import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

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

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { Element } from 'platform/utilities/scroll';

import { generateMockUser } from 'platform/site-wide/user-nav/tests/mocks/user';
import AddressView from 'platform/user/profile/vap-svc/components/AddressField/AddressView';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import {
  setReturnState,
  getReturnState,
  clearReturnState,
  renderTelephone,
  getMissingInfo,
  REVIEW_CONTACT,
  convertNullishObjectValuesToEmptyString,
  contactInfoPropTypes,
  getPhoneString,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { getValidationErrors } from 'platform/forms-system/src/js/utilities/validations';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isFieldEmpty } from 'platform/user/profile/vap-svc/util';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import { ContactInfoLoader } from './ContactInfoLoader';
import { ContactInfoSuccessAlerts } from './ContactInfoSuccessAlerts';

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
export const ContactInfoBase = ({
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
  disableMockContactInfo = false,
  contactSectionHeadingLevel,
  prefillPatternEnabled,
  ...rest
}) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const aedpPrefillToggleEnabled = useToggleValue(TOGGLE_NAMES.aedpPrefill);

  const { router } = rest;

  const { pathname } = router?.location || { pathname: '' };

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
    loggedIn && environment.isLocalhost() && !disableMockContactInfo
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
              : `header-${lastEdited}`,
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

  const MainHeader = onReviewPage ? 'h4' : 'h3';
  const Headers = contactSectionHeadingLevel || (onReviewPage ? 'h5' : 'h4');
  const headerClassNames = [
    'vads-u-font-size--h4',
    'vads-u-width--auto',
    'vads-u-margin-top--0',
  ].join(' ');

  // keep alerts in DOM, so we don't have to delay focus; but keep the 100ms
  // delay to move focus away from the h3
  const showSuccessAlertInField = (id, text) => {
    if (prefillPatternEnabled && aedpPrefillToggleEnabled) {
      return null;
    }
    return (
      <va-alert
        id={`updated-${id}`}
        visible={editState === `${id},updated`}
        class="vads-u-margin-y--1"
        status="success"
        slim
      >
        {`${text} ${content.updated}`}
      </va-alert>
    );
  };

  // Loop to separate pages when editing
  // Each Link includes an ID for focus management on the review & submit page

  const contactSection = [
    keys.address ? (
      <React.Fragment key="mailing">
        <va-card class="vads-u-margin-bottom--3">
          <Headers name="header-address" className={headerClassNames}>
            {content.mailingAddress}
            {!requiredKeys.includes(FIELD_NAMES.MAILING_ADDRESS) &&
              ' (optional)'}
          </Headers>
          {showSuccessAlertInField('address', content.mailingAddress)}
          <AddressView data={dataWrap[keys.address]} />
          {loggedIn && (
            <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
              <VaLink
                href={`${pathname}/edit-mailing-address`}
                label={content.editMailingAddress}
                text={
                  isFieldEmpty(
                    dataWrap[keys.address],
                    FIELD_NAMES.MAILING_ADDRESS,
                  )
                    ? content.add
                    : content.edit
                }
                onClick={e => {
                  e.preventDefault();
                  router.push(`${pathname}/edit-mailing-address`);
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    ) : null,

    keys.homePhone ? (
      <React.Fragment key="home">
        <va-card class="vads-u-margin-bottom--3">
          <Headers
            name="header-home-phone"
            className={`${headerClassNames} vads-u-margin-top--0p5`}
          >
            {content.homePhone}
            {!requiredKeys.includes(FIELD_NAMES.HOME_PHONE) && ' (optional)'}
          </Headers>
          {showSuccessAlertInField('home-phone', content.homePhone)}
          <span className="dd-privacy-hidden" data-dd-action-name="home phone">
            {renderTelephone(dataWrap[keys.homePhone])}
          </span>
          {loggedIn && (
            <p className="vads-u-margin-top--0p5">
              <VaLink
                href={`${pathname}/edit-home-phone`}
                label={content.editHomePhone}
                text={
                  getPhoneString(dataWrap[keys.homePhone])
                    ? content.edit
                    : content.add
                }
                onClick={e => {
                  e.preventDefault();
                  router.push(`${pathname}/edit-home-phone`);
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    ) : null,

    keys.mobilePhone ? (
      <React.Fragment key="mobile">
        <va-card class="vads-u-margin-bottom--3">
          <Headers name="header-mobile-phone" className={headerClassNames}>
            {content.mobilePhone}
            {!requiredKeys.includes(FIELD_NAMES.MOBILE_PHONE) && ' (optional)'}
          </Headers>
          {showSuccessAlertInField('mobile-phone', content.mobilePhone)}
          <span
            className="dd-privacy-hidden"
            data-dd-action-name="mobile phone"
          >
            {renderTelephone(dataWrap[keys.mobilePhone])}
          </span>
          {loggedIn && (
            <p className="vads-u-margin-top--0p5">
              <VaLink
                href={`${pathname}/edit-mobile-phone`}
                label={content.editMobilePhone}
                text={
                  getPhoneString(dataWrap[keys.mobilePhone])
                    ? content.edit
                    : content.add
                }
                onClick={e => {
                  e.preventDefault();
                  router.push(`${pathname}/edit-mobile-phone`);
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    ) : null,

    keys.email ? (
      <React.Fragment key="email">
        <va-card>
          <Headers name="header-email" className={headerClassNames}>
            {content.email}
            {!requiredKeys.includes(FIELD_NAMES.EMAIL) && ' (optional)'}
          </Headers>
          {showSuccessAlertInField('email', content.email)}
          <span className="dd-privacy-hidden" data-dd-action-name="email">
            {dataWrap[keys.email] || ''}
          </span>
          {loggedIn && (
            <p className="vads-u-margin-top--0p5">
              <VaLink
                href={`${pathname}/edit-email-address`}
                label={content.editEmail}
                text={
                  isFieldEmpty(dataWrap[keys.email], FIELD_NAMES.EMAIL)
                    ? content.add
                    : content.edit
                }
                onClick={e => {
                  e.preventDefault();
                  router.push(`${pathname}/edit-email-address`);
                }}
                active
              />
            </p>
          )}
        </va-card>
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
    <ContactInfoLoader
      data={data}
      goBack={goBack}
      goForward={goForward}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      contentBeforeButtons={contentBeforeButtons}
      contentAfterButtons={contentAfterButtons}
      setFormData={setFormData}
      content={content}
      contactPath={contactPath}
      keys={keys}
      requiredKeys={requiredKeys}
      uiSchema={uiSchema}
      testContinueAlert={testContinueAlert}
      contactInfoPageKey={contactInfoPageKey}
      disableMockContactInfo={disableMockContactInfo}
      contactSectionHeadingLevel={contactSectionHeadingLevel}
      router={router}
      prefillPatternEnabled={prefillPatternEnabled && aedpPrefillToggleEnabled}
    >
      <div className="vads-u-margin-y--2">
        <Element name={`${contactInfoPageKey}ScrollElement`} />
        <ContactInfoSuccessAlerts
          submitted={submitted}
          missingInfo={missingInfo}
          contactInfoPageKey={contactInfoPageKey}
          editState={editState}
          prefillPatternEnabled={
            prefillPatternEnabled && aedpPrefillToggleEnabled
          }
        />
        <form onSubmit={handlers.onSubmit}>
          <MainHeader
            id={`${contactInfoPageKey}Header`}
            className="vads-u-margin-top--3 vads-u-margin-bottom--0"
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
                  <va-alert status="success" slim>
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
                    <va-alert status="error" slim>
                      <div className="vads-u-font-size--base">
                        We still don’t have your {list}. Please edit and update
                        the field.
                      </div>
                    </va-alert>
                  </div>
                )}
                <div className="vads-u-margin-top--1p5" role="alert">
                  <va-alert status="warning" slim>
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
                  <va-alert status="error" slim>
                    <div className="vads-u-font-size--base">
                      {validationErrors[0]}
                    </div>
                  </va-alert>
                </div>
              )}
          </div>
          <div className="vads-u-margin-top--3">
            <div
              className="va-profile-wrapper vads-l-grid-container vads-u-padding-x--0"
              onSubmit={handlers.onSubmit}
            >
              <div className="vads-l-row">
                <div className="vads-l-col--12 medium-screen:vads-l-col--6">
                  {contactSection}
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="vads-u-margin-top--4">{navButtons}</div>
      </div>
    </ContactInfoLoader>
  );
};

ContactInfoBase.propTypes = {
  contactInfoPageKey: contactInfoPropTypes.contactInfoPageKey,
  contactPath: PropTypes.string,
  contactSectionHeadingLevel: PropTypes.string,
  content: contactInfoPropTypes.content, // content passed in from profileContactInfo
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: contactInfoPropTypes.data,
  disableMockContactInfo: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  immediateRedirect: PropTypes.bool,
  keys: contactInfoPropTypes.keys,
  prefillPatternEnabled: PropTypes.bool,
  requiredKeys: PropTypes.arrayOf(PropTypes.string),
  setFormData: PropTypes.func,
  testContinueAlert: PropTypes.bool,
  // for unit testing only
  uiSchema: PropTypes.shape({
    'ui:required': PropTypes.func,
    'ui:validations': PropTypes.array,
  }),
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

const ContactInfo = withRouter(ContactInfoBase);

export default ContactInfo;
