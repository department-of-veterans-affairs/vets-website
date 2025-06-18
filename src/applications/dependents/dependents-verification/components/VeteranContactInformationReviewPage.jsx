import React from 'react';
import PropTypes from 'prop-types';

const VeteranContactInformationReviewPage = ({ data, goToPath }) => {
  const { veteranContactInformation = {} } = data || {};
  const {
    email,
    phone,
    mailingAddress = {},
    internationalPhone,
  } = veteranContactInformation;

  const handlers = {
    editMailingAddress: () => {
      sessionStorage.setItem('onReviewPage', 'true');
      goToPath('/veteran-contact-information/mailing-address');
    },
    editEmail: () => {
      sessionStorage.setItem('onReviewPage', 'true');
      goToPath('veteran-contact-information/email');
    },
    editPhone: () => {
      sessionStorage.setItem('onReviewPage', 'true');
      goToPath('veteran-contact-information/phone');
    },
    editInternationalPhone: () => {
      sessionStorage.setItem('onReviewPage', 'true');
      goToPath('veteran-contact-information/international-phone');
    },
  };

  const showError = message => (
    <span className="usa-input-error-message">{message}</span>
  );

  const isUSA = mailingAddress.countryCodeIso3 === 'USA';

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
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Country</dt>
          <dd>{mailingAddress.countryName ?? showError('Missing country')}</dd>
        </div>
        <div className="review-row">
          <dt>Street</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="address line 1"
          >
            <strong>
              {mailingAddress.addressLine1 ??
                showError('Missing street address line 1')}
            </strong>
          </dd>
        </div>
        {mailingAddress.addressLine2 ? (
          <div className="review-row">
            <dt>Street address line 2</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="address line 2"
            >
              <strong>{mailingAddress.addressLine2}</strong>
            </dd>
          </div>
        ) : null}
        {mailingAddress.addressLine3 ? (
          <div className="review-row">
            <dt>Street address line 3</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="address line 3"
            >
              <strong>{mailingAddress.addressLine3}</strong>
            </dd>
          </div>
        ) : null}
        <div className="review-row">
          <dt>City</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="city">
            <strong>{mailingAddress.city ?? showError('Missing city')}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>{isUSA ? 'State' : 'Province'}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="state or provice"
          >
            <strong>
              {mailingAddress[isUSA ? 'stateCode' : 'province'] ??
                showError(`Missing ${isUSA ? 'state' : 'province'}`)}
            </strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Postal code</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="postal code">
            <strong>
              {mailingAddress[isUSA ? 'zipCode' : 'internationalPostalCode'] ??
                showError('Missing postal code')}
            </strong>
          </dd>
        </div>
      </dl>

      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Email address
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editEmail}
          label="Edit email address"
          text="Edit"
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Email address</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="email address">
            <strong>{email ?? showError('Missing email address')}</strong>
          </dd>
        </div>
      </dl>

      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Home phone number
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editEmail}
          label="Edit homne phone number"
          text="Edit"
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Home phone number</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="home phone">
            <strong>
              {phone ? (
                <va-telephone contact={phone} not-clickable />
              ) : (
                showError('Missing home phone number')
              )}
            </strong>
          </dd>
        </div>
      </dl>

      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          International phone number
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.editEmail}
          label="Edit international phone number"
          text="Edit"
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>International phone number</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="international phone"
          >
            <strong>
              {internationalPhone ??
                showError('Missing internationalPhone phone number')}
            </strong>
          </dd>
        </div>
      </dl>
    </div>
  );
};

VeteranContactInformationReviewPage.propTypes = {
  data: PropTypes.shape({
    veteranContactInformation: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      mailingAddress: PropTypes.shape({
        countryCodeIso3: PropTypes.string,
        countryName: PropTypes.string,
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        addressLine3: PropTypes.string,
        city: PropTypes.string,
        stateCode: PropTypes.string,
        province: PropTypes.string,
        zipCode: PropTypes.string,
        internationalPostalCode: PropTypes.string,
      }),
      internationalPhone: PropTypes.string,
    }),
  }),
  goToPath: PropTypes.func,
};

export default VeteranContactInformationReviewPage;
