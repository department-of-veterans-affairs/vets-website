/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { Element, scrollTo, scrollAndFocus } from 'platform/utilities/scroll';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  selectProfile,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { generateMockUser } from 'platform/site-wide/user-nav/tests/mocks/user';
import AddressView from 'platform/user/profile/vap-svc/components/AddressField/AddressView';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  setReturnState,
  getReturnState,
  clearReturnState,
  renderTelephone,
  getMissingInfo,
  REVIEW_CONTACT,
  convertNullishObjectValuesToEmptyString,
  contactInfoPropTypes,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { getValidationErrors } from 'platform/forms-system/src/js/utilities/validations';

import { isFieldEmpty } from 'platform/user/profile/vap-svc/util';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import ContactInfoCard from './ContactInfoCard';

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
  keys,
  requiredKeys,
  uiSchema,
  testContinueAlert = false,
  contactInfoPageKey,
  disableMockContactInfo = false,
  contactSectionHeadingLevel,
  contactPath,
  ...rest
}) => {
  const { router } = rest;

  let urlPrefix = '';

  if (router && router?.routes && router?.routes?.length > 0) {
    urlPrefix = router?.routes?.[1]?.formConfig?.urlPrefix || '';
  }

  const baseEditPath = `${urlPrefix}${contactPath}`;
  const MISSING_ALERT_TEXT = 'Missing';
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

  const missingInfo = getMissingInfo({
    data: dataWrap,
    keys,
    content,
    requiredKeys,
  });

  const validationErrors = uiSchema?.['ui:required']?.(data)
    ? getValidationErrors(uiSchema?.['ui:validations'] || [], {}, data)
    : [];

  // Get the fieldTransactionMap from Redux store
  const { fieldTransactionMap } = useSelector(state => state.vapService) || {};

  // map missing fields to path/key; used in rendering error messages after page validation
  const errorMap = {
    'mailing address': { path: 'edit-mailing-address', key: keys.address },
    'home phone': { path: 'edit-home-phone', key: keys.homePhone },
    'mobile phone': { path: 'edit-mobile-phone', key: keys.mobilePhone },
    'email address': { path: 'edit-email-address', key: keys.email },
  };

  // Unified field configuration mapping
  const fieldConfig = {
    address: {
      id: 'address',
      fieldName: FIELD_NAMES.MAILING_ADDRESS,
      key: keys.address,
      path: 'mailingAddress',
      text: content.mailingAddress,
    },
    'home-phone': {
      id: 'home-phone',
      fieldName: FIELD_NAMES.HOME_PHONE,
      key: keys.homePhone,
      path: 'homePhone',
      text: content.homePhone,
    },
    'mobile-phone': {
      id: 'mobile-phone',
      fieldName: FIELD_NAMES.MOBILE_PHONE,
      key: keys.mobilePhone,
      path: 'mobilePhone',
      text: content.mobilePhone,
    },
    email: {
      id: 'email',
      fieldName: FIELD_NAMES.EMAIL,
      key: keys.email,
      path: 'email',
      text: content.email,
    },
  };

  // Check if we have a form-only update for the current field
  const [editField] = editState?.split(',') || [];
  const fieldName = fieldConfig[editField]?.fieldName;
  const hasFormOnlyUpdate = fieldName
    ? !!fieldTransactionMap?.[fieldName]
    : false;

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
    onUpdatePage: () => {
      setSubmitted(true);
      if (missingInfo.length || validationErrors.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        setReturnState('true');
        updatePage();
      }
    },
  };

  const lastSyncedData = useRef({});

  const syncProfileData = () => {
    const wrapper = { ...data[keys.wrapper] };
    const updatedWrapper = { ...wrapper };
    let needsUpdate = false;

    Object.values(fieldConfig).forEach(({ key, path }) => {
      const profileValue = contactInfo?.[path];
      const formValue = wrapper?.[key];

      const profileUpdated = profileValue?.updatedAt || '';
      const formUpdated = formValue?.updatedAt || '';

      // Prefer the more recent value between profile and form
      const isFormNewer = formUpdated && formUpdated > profileUpdated;
      const selectedValue = isFormNewer ? formValue : profileValue;

      if (
        selectedValue &&
        JSON.stringify(lastSyncedData.current[key]) !==
          JSON.stringify(selectedValue)
      ) {
        const cleanedValue =
          path === 'email'
            ? {
                ...selectedValue,
                emailAddress: selectedValue?.emailAddress || '',
              }
            : convertNullishObjectValuesToEmptyString(selectedValue);

        updatedWrapper[key] = cleanedValue;
        lastSyncedData.current[key] = selectedValue;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      setFormData({ ...data, [keys.wrapper]: updatedWrapper });
    }
  };

  useEffect(() => syncProfileData(), [contactInfo, data, keys, setFormData]);

  useEffect(
    () => {
      if (editState) {
        const [lastEdited, returnState] = editState.split(',');
        const scrollTimer = setTimeout(() => {
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

        const clearTimer = setTimeout(() => {
          clearReturnState();
        }, 1000);

        return () => {
          clearTimeout(scrollTimer);
          clearTimeout(clearTimer);
        };
      }
      return undefined;
    },
    [contactInfoPageKey, editState, onReviewPage],
  );

  useEffect(
    () => {
      if ((hasInitialized && missingInfo.length) || testContinueAlert) {
        // page had an error flag, so we know when to show a success alert
        setHadError(true);
      }
      const timer = setTimeout(() => {
        setHasInitialized(true);
      });

      return () => clearTimeout(timer);
    },
    [missingInfo, hasInitialized, testContinueAlert],
  );

  const MainHeader = onReviewPage ? 'h4' : 'h3';
  const headerLevel = contactSectionHeadingLevel || (onReviewPage ? '5' : '4');

  // Helper function to render email addresses consistently
  const renderEmail = emailData => {
    if (!emailData) return '';
    return typeof emailData === 'object'
      ? emailData.emailAddress || ''
      : emailData || '';
  };

  // Render alerts above contact sections
  const renderContactAlerts = () => {
    const alerts = [];

    Object.entries(fieldConfig).forEach(([id, { text, key }]) => {
      if (!key) return; // Skip if this field is not configured

      const isUpdated = editState === `${id},updated`;

      if (isUpdated) {
        alerts.push(
          <va-alert
            key={`success-${id}`}
            id={`updated-${id}`}
            class="vads-u-margin-y--1"
            status="success"
            role="alert"
          >
            <h2 slot="headline">We’ve updated your {text}</h2>
            <p className="vads-u-margin-y--0">
              {hasFormOnlyUpdate
                ? 'We’ve made these changes to only this form.'
                : 'We’ve made these changes to this form and your profile.'}
            </p>
          </va-alert>,
        );
      }
    });

    return alerts.length > 0 ? (
      <div className="vads-u-margin-bottom--2">{alerts}</div>
    ) : null;
  };

  // return boolean flag if a required field is among the missing info fields
  function hasMissingInfo(key) {
    // get config for a field
    const config = Object.values(fieldConfig).find(field => field.key === key);
    // check if a field in missing info matches a field's config
    return missingInfo.some(field =>
      config.text.toLowerCase().startsWith(field),
    );
  }

  // Extract contact section rendering
  const renderAddressSection = () => {
    if (!keys.address) return null;
    const missingAddress = hasMissingInfo(FIELD_NAMES.MAILING_ADDRESS);
    const cardContent = missingAddress ? (
      'None provided'
    ) : (
      <AddressView data={dataWrap[keys.address]} />
    );

    return (
      <ContactInfoCard
        key={FIELD_NAMES.MAILING_ADDRESS}
        error={missingAddress ? 'You must add your adress' : ''}
        contactPath={contactPath}
        required={requiredKeys.includes(FIELD_NAMES.MAILING_ADDRESS)}
        formKey={keys.address}
        wrapper={keys.wrapper}
        editPath={`${baseEditPath}/edit-mailing-address`}
        headerLevel={headerLevel}
        headerText={content.mailingAddress}
        tagText={missingAddress ? MISSING_ALERT_TEXT : ''}
        tagStatus={missingAddress ? 'error' : 'info'}
        linkText={
          isFieldEmpty(dataWrap[keys.address], FIELD_NAMES.MAILING_ADDRESS)
            ? `${content.add} mailing address`
            : `${content.edit} mailing address`
        }
      >
        {cardContent}
      </ContactInfoCard>
    );
  };

  const renderHomePhoneSection = () => {
    if (!keys.homePhone) return null;
    const missingHomePhone = hasMissingInfo(FIELD_NAMES.HOME_PHONE);
    const cardContent = missingHomePhone ? (
      'None provided'
    ) : (
      <div className="dd-privacy-hidden" data-dd-action-name="home phone">
        {renderTelephone(dataWrap[keys.homePhone])}
      </div>
    );
    return (
      <ContactInfoCard
        key={FIELD_NAMES.HOME_PHONE}
        error={missingHomePhone ? 'You must add your home phone number' : ''}
        contactPath={contactPath}
        required={requiredKeys.includes(FIELD_NAMES.HOME_PHONE)}
        formKey={keys.homePhone}
        wrapper={keys.wrapper}
        editPath={`${baseEditPath}/edit-home-phone`}
        headerLevel={headerLevel}
        headerText={content.homePhone}
        tagText={missingHomePhone ? MISSING_ALERT_TEXT : ''}
        tagStatus={missingHomePhone ? 'error' : 'info'}
        linkText={
          isFieldEmpty(dataWrap[keys.homePhone], FIELD_NAMES.HOME_PHONE)
            ? `${content.add} home phone number`
            : `${content.edit} home phone number`
        }
      >
        {cardContent}
      </ContactInfoCard>
    );
  };

  const renderMobilePhoneSection = () => {
    if (!keys.mobilePhone) return null;
    const missingMobilePhone = hasMissingInfo(FIELD_NAMES.MOBILE_PHONE);
    const cardContent = missingMobilePhone ? (
      'None provided'
    ) : (
      <div className="dd-privacy-hidden" data-dd-action-name="mobile phone">
        {renderTelephone(dataWrap[keys.mobilePhone])}
      </div>
    );

    return (
      <ContactInfoCard
        key={FIELD_NAMES.MOBILE_PHONE}
        error={
          missingMobilePhone ? 'You must add your mobile phone number' : ''
        }
        contactPath={contactPath}
        required={requiredKeys.includes(FIELD_NAMES.MOBILE_PHONE)}
        formKey={keys.mobilePhone}
        wrapper={keys.wrapper}
        editPath={`${baseEditPath}/edit-mobile-phone`}
        headerLevel={headerLevel}
        headerText={content.editMobilePhone}
        tagText={missingMobilePhone ? MISSING_ALERT_TEXT : ''}
        tagStatus={missingMobilePhone ? 'error' : 'info'}
        linkText={
          isFieldEmpty(dataWrap[keys.mobilePhone], FIELD_NAMES.MOBILE_PHONE)
            ? `${content.add} mobile phone number`
            : `${content.edit} mobile phone number`
        }
      >
        {cardContent}
      </ContactInfoCard>
    );
  };

  const renderEmailSection = () => {
    if (!keys.email) return null;
    const missingEmail = hasMissingInfo(FIELD_NAMES.EMAIL);
    const cardContent = missingEmail ? (
      'None provided'
    ) : (
      <div className="dd-privacy-hidden" data-dd-action-name="email">
        {renderEmail(dataWrap[keys.email])}
      </div>
    );

    return (
      <ContactInfoCard
        key={FIELD_NAMES.EMAIL}
        error={missingEmail ? 'You must add your email address' : ''}
        contactPath={contactPath}
        required={requiredKeys.includes(FIELD_NAMES.EMAIL)}
        formKey={keys.email}
        wrapper={keys.wrapper}
        editPath={`${baseEditPath}/edit-email-address`}
        headerLevel={headerLevel}
        headerText={content.editEmail}
        tagText={missingEmail ? MISSING_ALERT_TEXT : ''}
        tagStatus={missingEmail ? 'error' : 'info'}
        linkText={
          isFieldEmpty(dataWrap[keys.email], FIELD_NAMES.EMAIL)
            ? `${content.add} email address`
            : `${content.edit} email address`
        }
      >
        {cardContent}
      </ContactInfoCard>
    );
  };

  const renderValidationMessages = () => {
    return (
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
        {missingInfo.length > 0 &&
          submitted && (
            <div
              className="vads-u-margin-bottom--3 vads-u-margin-top--3"
              role="alert"
            >
              <va-alert status="error">
                <h3 slot="headline">
                  This information contains {missingInfo.length} error
                  {missingInfo.length > 1 ? 's' : ''}.
                </h3>
                <ul className="vads-u-font-size--base">
                  Complete all required fields
                  {missingInfo.map(field => {
                    return (
                      <li key={field}>
                        <va-link
                          text={`You must add your ${field}`}
                          href={errorMap[field].path}
                          onClick={e => {
                            e.preventDefault();
                            router.push({
                              pathname: `${baseEditPath}/${
                                errorMap[field].path
                              }`,
                              state: {
                                formKey: errorMap[field].key,
                                keys: { wrapper: keys.wrapper },
                              },
                            });
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </va-alert>
            </div>
          )}
        {submitted &&
          missingInfo.length === 0 &&
          validationErrors.length > 0 && (
            <div className="vads-u-margin-top--1p5" role="alert">
              <va-alert status="error">
                <div className="vads-u-font-size--base">
                  {validationErrors[0]}
                </div>
              </va-alert>
            </div>
          )}
      </div>
    );
  };

  const navButtons = onReviewPage ? (
    <va-button text={content.update} onClick={handlers.onUpdatePage} />
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
        {renderValidationMessages()}
        {renderContactAlerts()}
        <div className="vads-u-margin-top--3">
          <div
            className="va-profile-wrapper vads-l-grid-container vads-u-padding-x--0"
            onSubmit={handlers.onSubmit}
          >
            <div className="vads-l-row">
              <div
                className="vads-l-col--12 medium-screen:vads-l-col--8"
                style={{ maxWidth: '300px' }}
              >
                {[
                  renderAddressSection,
                  renderEmailSection,
                  renderHomePhoneSection,
                  renderMobilePhoneSection,
                ].map((func, i, arr) => (
                  <div
                    key={func.name}
                    className={`vads-u-margin-bottom--${
                      i === arr.length - 1 ? '5' : '3'
                    }`}
                  >
                    {func()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="vads-u-margin-top--4">{navButtons}</div>
    </div>
  );
};

ContactInfoBase.propTypes = {
  contactInfoPageKey: contactInfoPropTypes.contactInfoPageKey,
  contactPath: PropTypes.string,
  contactSectionHeadingLevel: PropTypes.string,
  content: contactInfoPropTypes.content, // content passed in from profileContactInfoPage
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
