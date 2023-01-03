import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import AddressView from '@@vap-svc/components/AddressField/AddressView';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus } from 'platform/utilities/ui';

import { readableList } from '../utils/helpers';
import { getFormatedPhone } from '../utils/contactInfo';
import { content } from '../content/contactInfo';

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
  window.sessionStorage.setItem('onReviewPage', onReviewPage || false);

  const { email = '', homePhone = {}, mobilePhone = {}, address = {} } =
    data?.veteran || {};

  const missingInfo = [
    homePhone?.phoneNumber || mobilePhone?.phoneNumber
      ? ''
      : content.homeOrMobile,
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
    onGoForward: () => {
      setSubmitted(true);
      if (missingInfo.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        goForward(data);
      }
    },
    updatePage: () => {
      setSubmitted(true);
      if (missingInfo.length) {
        scrollAndFocus(wrapRef.current);
      } else {
        updatePage();
      }
    },
  };

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

  // loop to separate pages when editing
  const contactSection = (
    <>
      <Headers className="vads-u-font-size--h3 vads-u-margin-top--0p5 vads-u-width--auto vads-u-display--inline-block">
        Home phone number
      </Headers>
      <Link
        to="/edit-home-phone"
        aria-label="Edit home phone number"
        className="vads-u-margin-left--2"
      >
        edit
      </Link>
      <div>{getFormatedPhone(homePhone)}</div>

      <Headers className="vads-u-font-size--h3 vads-u-width--auto vads-u-display--inline-block">
        Mobile phone number
      </Headers>
      <Link
        to="/edit-mobile-phone"
        aria-label="Edit mobile phone number"
        className="vads-u-margin-left--2"
      >
        edit
      </Link>
      <div>{getFormatedPhone(mobilePhone)}</div>

      <Headers className="vads-u-font-size--h3 vads-u-width--auto vads-u-display--inline-block">
        Email address
      </Headers>
      <Link
        to="/edit-email-address"
        aria-label="Edit email address"
        className="vads-u-margin-left--2"
      >
        edit
      </Link>
      <div>{email || ''}</div>

      <Headers className="vads-u-font-size--h3 vads-u-width--auto vads-u-display--inline-block">
        Mailing address
      </Headers>
      <Link
        to="/edit-mailing-address"
        aria-label="Edit mailing address"
        className="vads-u-margin-left--2"
      >
        edit
      </Link>
      <div>
        <AddressView data={address} />
      </div>
    </>
  );

  const navButtons = onReviewPage ? (
    <va-button text={content.update} onClick={handlers.updatePage} />
  ) : (
    <>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
      {contentAfterButtons}
    </>
  );

  return (
    <div className="vads-u-margin-y--2">
      <form onSubmit={handlers.onSubmit}>
        <MainHeader className="vads-u-margin-top--0">
          {content.title}
        </MainHeader>
        {content.description}
        <div ref={wrapRef}>
          {hadError &&
            missingInfo.length === 0 && (
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
                {missingInfo[0].startsWith('p') ? ' A ' : ' An '}
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
    veteran: PropTypes.shape({
      homePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mobilePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
    }).isRequired,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default ContactInfo;
