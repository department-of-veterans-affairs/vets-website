import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { openReviewChapter } from 'platform/forms-system/src/js/actions';
import { scrollTo } from 'platform/utilities/scroll';

import { electronicCorrespondenceMessage } from '../config/chapters/veteran-contact-information/editEmailPage';

/**
 * Veteran contact information Review Component
 * @typedef {object} VeteranContactInformationReviewProps
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 *
 * @param {VeteranContactInformationReviewProps} props - Component props
 * @returns {React.Component} - Veteran contact information review page
 */
const VeteranContactInformationReviewPage = ({ data, goToPath }) => {
  const dispatch = useDispatch();
  const {
    email,
    phone,
    address = {},
    internationalPhone,
    electronicCorrespondence,
  } = data || {};

  const [focusSection, setFocusSection] = useState(null);
  const didFocusRef = useRef(false);

  const mailingAddressRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const internationalPhoneRef = useRef(null);

  const refsBySection = useMemo(
    () => ({
      mailingAddress: mailingAddressRef,
      email: emailRef,
      phone: phoneRef,
      internationalPhone: internationalPhoneRef,
    }),
    [],
  );

  useEffect(() => {
    const section = sessionStorage.getItem('onReviewPage');
    if (section) {
      setFocusSection(section);
      sessionStorage.removeItem('onReviewPage');
    }
  }, []);

  // open accordion + focus
  useEffect(() => {
    if (focusSection && !didFocusRef.current) {
      didFocusRef.current = true;
      dispatch(openReviewChapter('veteranContactInformation'));

      setTimeout(() => {
        const vaBtn = refsBySection[focusSection]?.current;
        if (vaBtn?.shadowRoot) {
          const realBtn = vaBtn.shadowRoot.querySelector('button');
          if (realBtn) {
            scrollTo(realBtn, { offset: -20 });
            realBtn.focus();
          }
        }
      }, 300);

      setFocusSection(null);
    }
  }, [focusSection, dispatch, refsBySection]);

  const goEditPath = (path, sectionKey) => {
    sessionStorage.setItem('onReviewPage', sectionKey);
    goToPath(path, { force: true });
  };

  const handlers = {
    editMailingAddress: () =>
      goEditPath(
        '/veteran-contact-information/mailing-address',
        'mailingAddress',
      ),
    editEmail: () => goEditPath('veteran-contact-information/email', 'email'),
    editPhone: () => goEditPath('veteran-contact-information/phone', 'phone'),
    editInternationalPhone: () =>
      goEditPath(
        'veteran-contact-information/international-phone',
        'internationalPhone',
      ),
  };

  const showError = message => (
    <span className="usa-input-error-message">{message}</span>
  );
  const isUSA = address.country === 'USA';
  const phoneSource = data['view:phoneSource'] || 'Mobile';

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Mailing address
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editMailingAddress}
          label="Edit mailing address"
          text="Edit"
          ref={mailingAddressRef}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Country</dt>
          <dd>
            <strong>{address.country ?? showError('Missing country')}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Street</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="address line 1"
          >
            <strong>
              {address.street ?? showError('Missing street address line 1')}
            </strong>
          </dd>
        </div>
        {address.street2 && (
          <div className="review-row">
            <dt>Street address line 2</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="address line 2"
            >
              <strong>{address.street2}</strong>
            </dd>
          </div>
        )}
        {address.street3 && (
          <div className="review-row">
            <dt>Street address line 3</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="address line 3"
            >
              <strong>{address.street3}</strong>
            </dd>
          </div>
        )}
        <div className="review-row">
          <dt>City</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="city">
            <strong>{address.city ?? showError('Missing city')}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>{isUSA ? 'State' : 'Province'}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="state or province"
          >
            <strong>
              {address.state ??
                showError(`Missing ${isUSA ? 'state' : 'province'}`)}
            </strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Postal code</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="postal code">
            <strong>
              {address.postalCode ?? showError('Missing postal code')}
            </strong>
          </dd>
        </div>
      </dl>

      <div className="form-review-panel-page-header-row vads-u-margin-top--4">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Email address
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editEmail}
          label="Edit email address"
          text="Edit"
          ref={emailRef}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Email address</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="email address">
            <strong>{email ?? showError('Missing email address')}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Electronic correspondence agreement</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="email address">
            <strong>
              {electronicCorrespondenceMessage(electronicCorrespondence)}
            </strong>
          </dd>
        </div>
      </dl>

      <div className="form-review-panel-page-header-row vads-u-margin-top--4">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {`${phoneSource} phone number`}
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editPhone}
          label={`Edit ${phoneSource} phone number`}
          text="Edit"
          ref={phoneRef}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{`${phoneSource} phone number`}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name={`${phoneSource} phone number`}
          >
            <strong>
              {phone ? (
                <va-telephone contact={phone} not-clickable />
              ) : (
                'None provided'
              )}
            </strong>
          </dd>
        </div>
      </dl>

      <div className="form-review-panel-page-header-row vads-u-margin-top--4">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          International number
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editInternationalPhone}
          label="Edit international phone number"
          text="Edit"
          ref={internationalPhoneRef}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>International number</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="international phone"
          >
            <strong>{internationalPhone || 'None provided'}</strong>
          </dd>
        </div>
      </dl>
    </div>
  );
};

VeteranContactInformationReviewPage.propTypes = {
  goToPath: PropTypes.func.isRequired,
  data: PropTypes.shape({
    email: PropTypes.string,
    'view:phoneSource': PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.shape({
      country: PropTypes.string,
      street: PropTypes.string,
      street2: PropTypes.string,
      street3: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postalCode: PropTypes.string,
    }),
    internationalPhone: PropTypes.string,
  }),
};

export default VeteranContactInformationReviewPage;
