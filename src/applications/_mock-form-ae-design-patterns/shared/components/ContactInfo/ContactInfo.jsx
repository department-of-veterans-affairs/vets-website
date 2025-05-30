/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  Element,
  scrollTo,
  scrollAndFocus,
} from 'platform/utilities/scroll';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  selectProfile,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';

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

  const list = readableList(missingInfo);
  const plural = missingInfo.length > 1;

  const validationErrors = uiSchema?.['ui:required']?.(data)
    ? getValidationErrors(uiSchema?.['ui:validations'] || [], {}, data)
    : [];

  // Get the fieldTransactionMap from Redux store
  const { fieldTransactionMap } = useSelector(state => state.vapService) || {};

  // Map editState field names to actual field names
  const fieldNameMap = {
    address: FIELD_NAMES.MAILING_ADDRESS,
    'home-phone': FIELD_NAMES.HOME_PHONE,
    'mobile-phone': FIELD_NAMES.MOBILE_PHONE,
    email: FIELD_NAMES.EMAIL,
  };

  // Check if we have a form-only update for the current field
  const [editField] = editState?.split(',') || [];
  const fieldName = fieldNameMap[editField];
  const hasFormOnlyUpdate = fieldName
    ? fieldTransactionMap?.[fieldName]?.formOnlyUpdate
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

  const lastSyncedData = useRef({});

  const syncProfileData = () => {
    const wrapper = { ...data[keys.wrapper] };
    const updatedWrapper = { ...wrapper };
    let needsUpdate = false;

    const fields = [
      { key: keys.email, path: 'email' },
      { key: keys.homePhone, path: 'homePhone' },
      { key: keys.mobilePhone, path: 'mobilePhone' },
      { key: keys.address, path: 'mailingAddress' },
    ];

    fields.forEach(({ key, path }) => {
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

  const handleEditStateScroll = () => {
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
        setTimeout(() => {
          clearReturnState();
        }, 1000);
      });
    }
  };

  const handleInitialErrorState = () => {
    if ((hasInitialized && missingInfo.length) || testContinueAlert) {
      // page had an error flag, so we know when to show a success alert
      setHadError(true);
    }
    setTimeout(() => {
      setHasInitialized(true);
    });
  };

  useEffect(() => syncProfileData(), [contactInfo, data, keys, setFormData]);
  useEffect(() => handleEditStateScroll(), [
    contactInfoPageKey,
    editState,
    onReviewPage,
  ]);
  useEffect(() => handleInitialErrorState(), [
    missingInfo,
    hasInitialized,
    testContinueAlert,
  ]);

  const MainHeader = onReviewPage ? 'h4' : 'h3';
  const Headers = contactSectionHeadingLevel || (onReviewPage ? 'h5' : 'h4');
  const headerClassNames = [
    'vads-u-font-size--h4',
    'vads-u-width--auto',
    'vads-u-margin-top--0',
  ].join(' ');

  // Extract alert rendering functions
  const showSuccessAlertInField = (id, text) => (
    <va-alert
      id={`updated-${id}`}
      visible={editState === `${id},updated` && !hasFormOnlyUpdate}
      class="vads-u-margin-y--1"
      status="success"
      slim
    >
      {`${text} ${content.updated}`}
    </va-alert>
  );

  const showFormOnlyAlert = id => (
    <va-alert
      id="form-only-update-alert"
      visible={
        hasFormOnlyUpdate &&
        editState?.includes(`${id}`) &&
        editState?.includes('updated')
      }
      class="vads-u-margin-y--1"
      status="error"
      uswds
      slim
    >
      <p>
        <strong>
          We couldn’t update your VA.gov profile, but your changes were saved to
          this form.{' '}
        </strong>
        You can try again later to update your profile, or continue with the
        form using the information you entered.
      </p>
    </va-alert>
  );

  // Helper function to render email addresses consistently
  const renderEmail = emailData => {
    if (!emailData) return '';
    return typeof emailData === 'object'
      ? emailData.emailAddress || ''
      : emailData || '';
  };

  // Extract contact section rendering
  const renderAddressSection = () => {
    if (!keys.address) return null;

    return (
      <React.Fragment key="mailing">
        <va-card class="vads-u-margin-bottom--3">
          <Headers name="header-address" className={headerClassNames}>
            {content.mailingAddress}
            {!requiredKeys.includes(FIELD_NAMES.MAILING_ADDRESS) &&
              ' (optional)'}
          </Headers>
          {hasFormOnlyUpdate
            ? showFormOnlyAlert('address')
            : showSuccessAlertInField('address', content.mailingAddress)}
          <AddressView data={dataWrap[keys.address]} />
          {loggedIn && (
            <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
              <VaLink
                href={`${baseEditPath}/edit-mailing-address`}
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
                  // router.push(`${baseEditPath}/edit-mailing-address`);
                  router.push({
                    pathname: `${baseEditPath}/edit-mailing-address`,
                    state: {
                      formKey: keys.address,
                      keys: { wrapper: keys.wrapper },
                    },
                  });
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    );
  };

  const renderHomePhoneSection = () => {
    if (!keys.homePhone) return null;

    return (
      <React.Fragment key="home">
        <va-card class="vads-u-margin-bottom--3">
          <Headers
            name="header-home-phone"
            className={`${headerClassNames} vads-u-margin-top--0p5`}
          >
            {content.homePhone}
            {!requiredKeys.includes(FIELD_NAMES.HOME_PHONE) && ' (optional)'}
          </Headers>
          {hasFormOnlyUpdate
            ? showFormOnlyAlert('home-phone')
            : showSuccessAlertInField('home-phone', content.homePhone)}
          <span className="dd-privacy-hidden" data-dd-action-name="home phone">
            {renderTelephone(dataWrap[keys.homePhone])}
          </span>
          {loggedIn && (
            <p className="vads-u-margin-top--0p5">
              <VaLink
                href={`${baseEditPath}/edit-home-phone`}
                label={content.editHomePhone}
                text={
                  getPhoneString(dataWrap[keys.homePhone])
                    ? content.edit
                    : content.add
                }
                onClick={e => {
                  e.preventDefault();
                  router.push({
                    pathname: `${baseEditPath}/edit-home-phone`,
                    state: {
                      formKey: keys.homePhone,
                      keys: { wrapper: keys.wrapper },
                    },
                  });
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    );
  };

  const renderMobilePhoneSection = () => {
    if (!keys.mobilePhone) return null;

    return (
      <React.Fragment key="mobile">
        <va-card class="vads-u-margin-bottom--3">
          <Headers
            name="header-mobile-phone"
            className={`${headerClassNames} vads-u-margin-top--0p5`}
          >
            {content.mobilePhone}
            {!requiredKeys.includes(FIELD_NAMES.MOBILE_PHONE) && ' (optional)'}
          </Headers>
          {hasFormOnlyUpdate
            ? showFormOnlyAlert('mobile-phone')
            : showSuccessAlertInField('mobile-phone', content.mobilePhone)}
          <span
            className="dd-privacy-hidden"
            data-dd-action-name="mobile phone"
          >
            {renderTelephone(dataWrap[keys.mobilePhone])}
          </span>
          {loggedIn && (
            <p className="vads-u-margin-top--0p5">
              <VaLink
                href={`${baseEditPath}/edit-mobile-phone`}
                label={content.editMobilePhone}
                text={
                  getPhoneString(dataWrap[keys.mobilePhone])
                    ? content.edit
                    : content.add
                }
                onClick={e => {
                  e.preventDefault();
                  router.push({
                    pathname: `${baseEditPath}/edit-mobile-phone`,
                    state: {
                      formKey: keys.mobilePhone,
                      keys: { wrapper: keys.wrapper },
                    },
                  });
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    );
  };

  const renderEmailSection = () => {
    if (!keys.email) return null;

    return (
      <React.Fragment key="email">
        <va-card>
          <Headers name="header-email" className={headerClassNames}>
            {content.email}
            {!requiredKeys.includes(FIELD_NAMES.EMAIL) && ' (optional)'}
          </Headers>
          {hasFormOnlyUpdate
            ? showFormOnlyAlert('email')
            : showSuccessAlertInField('email', content.email)}
          <span className="dd-privacy-hidden" data-dd-action-name="email">
            {renderEmail(dataWrap[keys.email])}
          </span>
          {loggedIn && (
            <p className="vads-u-margin-top--0p5">
              <VaLink
                href={`${baseEditPath}/edit-email-address`}
                label={content.editEmail}
                text={
                  isFieldEmpty(dataWrap[keys.email], FIELD_NAMES.EMAIL)
                    ? content.add
                    : content.edit
                }
                onClick={e => {
                  e.preventDefault();
                  router.push({
                    pathname: `${baseEditPath}/edit-email-address`,
                    state: {
                      formKey: keys.email,
                      keys: { wrapper: keys.wrapper },
                    },
                  });
                }}
                active
              />
            </p>
          )}
        </va-card>
      </React.Fragment>
    );
  };

  const contactSection = [
    renderAddressSection(),
    renderHomePhoneSection(),
    renderMobilePhoneSection(),
    renderEmailSection(),
  ];

  const renderValidationMessages = () => (
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
                  We still don’t have your {list}. Please edit and update the
                  field.
                </div>
              </va-alert>
            </div>
          )}
          <div className="vads-u-margin-top--1p5" role="alert">
            <va-alert status="warning" slim>
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
            <va-alert status="error" slim>
              <div className="vads-u-font-size--base">
                {validationErrors[0]}
              </div>
            </va-alert>
          </div>
        )}
    </div>
  );

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
