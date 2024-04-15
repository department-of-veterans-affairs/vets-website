import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Element } from 'react-scroll';

import AddressView from '@@vap-svc/components/AddressField/AddressView';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement, scrollTo, scrollAndFocus } from 'platform/utilities/ui';

import {
  getFormattedPhone,
  getReturnState,
  clearReturnState,
  readableList,
} from '../../utils/contactInformation';
import { content } from '../../pages/veteran/contactInformationContent';
import { REVIEW_CONTACT } from '../../constants';

const ContactInfo = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [hadError, setHadError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const wrapRef = useRef(null);
  window.sessionStorage.setItem(REVIEW_CONTACT, onReviewPage || false);
  const [editState] = useState(getReturnState());

  const { email = '', mobilePhone = {}, address = {} } =
    data?.personalData?.veteranContactInformation || {};

  const missingInfo = [
    mobilePhone?.phoneNumber ? '' : content.homeOrMobile,
    email ? '' : content.emailText,
    address?.addressLine1 ? '' : content.addressText,
  ].filter(Boolean);

  const list = readableList(missingInfo);
  const plural = missingInfo.length > 1;

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
      if (missingInfo.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        clearReturnState();
        goForward(data);
      }
    },
    updatePage: () => {
      setSubmitted(true);
      if (missingInfo.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        clearReturnState();
        updatePage();
      }
    },
  };

  useEffect(
    () => {
      if (editState) {
        const [lastEdited, returnState] = editState.split(',');
        setTimeout(() => {
          const target =
            returnState === 'canceled'
              ? `#edit-${lastEdited}`
              : `#updated-${lastEdited}`;
          scrollTo('topScrollElement');
          focusElement(target);
        });
      } else {
        scrollTo('h3');
        focusElement('topScrollElement');
      }
    },
    [editState],
  );

  useEffect(
    () => {
      if (missingInfo.length) {
        // page had an error flag, so we know when to show a success alert
        setHadError(true);
      }
    },
    [missingInfo],
  );

  const MainHeader = onReviewPage ? 'h4' : 'h3';
  const Headers = onReviewPage ? 'h5' : 'h4';
  const headerClassNames = ['vads-u-font-size--h4', 'vads-u-width--auto'].join(
    ' ',
  );

  const showSuccessAlert = (id, text) => {
    // keep alerts in DOM, so we don't have to delay focus; but keep the 100ms
    // delay to move focus away from the h3
    const isHidden =
      editState === `${id},updated` ? '' : 'vads-u-display--none';
    return (
      <va-alert
        id={`updated-${id}`}
        class={`vads-u-margin-y--1 ${isHidden}`}
        status="success"
        background-only
        role="alert"
        uswds
      >
        {`${text} updated`}
      </va-alert>
    );
  };

  // Loop to separate pages when editing
  // Each Link includes an ID for focus managements on the review & submit page
  const contactSection = (
    <>
      <Headers className={headerClassNames}>Mobile phone number</Headers>
      {showSuccessAlert('mobile-phone', 'Mobile phone number')}
      <span>{getFormattedPhone(mobilePhone)}</span>
      <p className="vads-u-margin-top--0p5">
        <Link
          id="edit-mobile-phone"
          to="/edit-mobile-phone"
          aria-label="Edit mobile phone number"
        >
          edit
        </Link>
      </p>

      <Headers className={headerClassNames}>Email address</Headers>
      {showSuccessAlert('email', 'Email address')}
      <span>{email || ''}</span>
      <p className="vads-u-margin-top--0p5">
        <Link
          id="edit-email"
          to="/edit-email-address"
          aria-label="Edit email address"
        >
          edit
        </Link>
      </p>

      <Headers className={headerClassNames}>Mailing address</Headers>
      {showSuccessAlert('address', 'Mailing address')}
      <div className="vads-u-display--flex">
        <AddressView data={address} />
      </div>
      <p className="vads-u-margin-top--0p5">
        <Link
          id="edit-address"
          to="/edit-mailing-address"
          aria-label="Edit mailing address"
        >
          edit
        </Link>
      </p>
    </>
  );

  const navButtons = onReviewPage ? (
    <va-button text={content.update} onClick={handlers.updatePage} uswds />
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
      <Element name="topScrollElement" />
      <form onSubmit={handlers.onSubmit}>
        <MainHeader
          id="confirmContactInformationHeader"
          className="vads-u-margin-top--5 vads-u-margin-bottom--3"
        >
          {content.title}
        </MainHeader>
        {content.description}

        <div ref={wrapRef}>
          {hadError &&
            missingInfo.length === 0 && (
              <div className="vads-u-margin-top--1p5">
                <va-alert status="success" background-only uswds>
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
                {missingInfo[0].startsWith('p') ? ' A ' : ' An '}
                {list} {plural ? 'are' : 'is'} required for this application.
              </p>
              {submitted && (
                <div className="vads-u-margin-top--1p5" role="alert">
                  <va-alert status="error" background-only uswds>
                    <div className="vads-u-font-size--base">
                      We still don’t have your {list}. Please edit and update
                      the field.
                    </div>
                  </va-alert>
                </div>
              )}
              <div className="vads-u-margin-top--1p5" role="alert">
                <va-alert status="warning" background-only uswds>
                  <div className="vads-u-font-size--base">
                    Your {list} {plural ? 'are' : 'is'} missing. Please edit and
                    update the {plural ? 'fields' : 'field'}.
                  </div>
                </va-alert>
              </div>
            </>
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
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      veteranContactInformation: PropTypes.shape({
        mobilePhone: PropTypes.shape({
          countryCode: PropTypes.string,
          areaCode: PropTypes.string,
          phoneNumber: PropTypes.string,
          extension: PropTypes.string,
        }),
      }).isRequired,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default ContactInfo;
