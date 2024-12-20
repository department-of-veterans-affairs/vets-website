import PropTypes from 'prop-types';
import React from 'react';
import { useFormik } from 'formik';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { Link, useLoaderData, Form } from 'react-router-dom';
import { formatDateShort } from 'platform/utilities/date/index';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';

const checkAuthorizations = (
  isTreatmentDisclosureAuthorized,
  isAddressChangingAuthorized,
  status,
) => {
  const authorizations = [];
  if (isTreatmentDisclosureAuthorized === status) {
    authorizations.push('Health');
  }

  if (isAddressChangingAuthorized === status) {
    authorizations.push('Address');
  }
  return authorizations.length > 0 ? authorizations.join(', ') : 'None';
};

const POARequestDetailsPage = () => {
  const poaRequest = useLoaderData();

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    // onSubmit: values => {
    //   console.log(values);
    // },
  });

  return (
    <section className="poa-request-details">
      <h1>
        <span data-testid="poa-request-details-header">POA request:</span>
        {poaRequest?.claimant?.firstName} {poaRequest?.claimant?.lastName}
      </h1>
      <span
        className="poa-request-details__divider"
        aria-hidden="true"
        tabIndex={-1}
      />

      <h2>Veteran information</h2>
      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Name</p>
          <p className="poa-request-details__subtitle">
            {poaRequest?.veteran?.lastName}, {poaRequest?.veteran?.firstName}
          </p>
        </li>

        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">VA file number</p>
          <p className="poa-request-details__subtitle">xxx-xxx-1111</p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Social security number</p>
          <p className="poa-request-details__subtitle">xxx-xx-1234</p>
        </li>
      </ul>

      <h2>POA request information</h2>
      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">POA submission date</p>
          <p className="poa-request-details__subtitle">
            {poaRequest?.submittedAt &&
              formatDateShort(poaRequest?.submittedAt)}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">
            {poaRequest?.status === 'Declined' && (
              <va-icon
                icon="close"
                class="vads-u-color--error poa-request__card-icon"
              />
            )}
            {poaRequest?.status === 'Accepted' && (
              <va-icon
                icon="check_circle"
                class="vads-u-color--success poa-request__card-icon"
              />
            )}
            <span>POA status</span>
          </p>
          <p className="poa-request-details__subtitle">{poaRequest?.status}</p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Represented through</p>
          <p className="poa-request-details__subtitle">
            Disabled American Veterans
          </p>
        </li>
      </ul>

      <h2>Claimant information</h2>
      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Claimant name</p>
          <p className="poa-request-details__subtitle">
            {poaRequest?.claimant.lastName}, {poaRequest?.claimant.firstName}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Relationship to Veteran</p>
          <p className="poa-request-details__subtitle">
            {poaRequest?.claimant.relationshipToVeteran}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Address</p>
          <p className="poa-request-details__subtitle">
            {poaRequest?.claimantAddress.city},{' '}
            {poaRequest?.claimantAddress.state}
            <br />
            {poaRequest?.claimantAddress.zip}
          </p>
        </li>

        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Email</p>
          <p className="poa-request-details__subtitle">email</p>
        </li>

        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Phone</p>
          <p className="poa-request-details__subtitle">1231231234</p>
        </li>
      </ul>

      <h2>Limitations of consent</h2>
      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">
            <va-icon
              icon="check_circle"
              class="vads-u-color--success poa-request__card-icon"
            />
            Approves
          </p>
          {checkAuthorizations(
            poaRequest?.isTreatmentDisclosureAuthorized,
            poaRequest?.isAddressChangingAuthorized,
            true,
          )}
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">
            <va-icon
              icon="warning"
              class="vads-u-color--error poa-request__card-icon"
            />
            Declines
          </p>

          {checkAuthorizations(
            poaRequest?.isTreatmentDisclosureAuthorized,
            poaRequest?.isAddressChangingAuthorized,
            false,
          )}
        </li>
      </ul>
      <Link to="/poa-requests/">Back to power of attorney list</Link>

      <Form
        method="post"
        className="poa-request-details__form"
        onSubmit={formik.handleSubmit}
      >
        <fieldset
          label="Do you accept or decline this POA request?"
          className="poa-request-details__form-label"
          id="reason"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.reason}
          error={formik.errors.reason}
        >
          <legend className="vads-u-font-size--h3 vads-u-font-family--serif">
            Do you accept or decline this POA request?
          </legend>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              name="reason"
              value="opt1"
              id="reasonopt1input"
            />
            <label className="usa-radio__label" htmlFor="reasonopt1input">
              I accept the request
            </label>
          </div>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              name="reason"
              value="opt2"
              id="reasonopt2input"
            />
            <label className="usa-radio__label" htmlFor="reasonopt2input">
              I decline the request, because the claimant didn’t provide access
              to health records
            </label>
          </div>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              name="reason"
              value="opt3"
              id="reasonopt3input"
            />
            <label className="usa-radio__label" htmlFor="reasonopt3input">
              I decline the request, because the claimant didn’t allow me to
              change their address
            </label>
          </div>

          <div className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              name="reason"
              value="opt4"
              id="reasonopt4input"
            />
            <label className="usa-radio__label" htmlFor="reasonopt4input">
              I decline the request, because the claimant did not provide access
              to change address and to health records
            </label>
          </div>

          <div className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              name="reason"
              value="opt5"
              id="reasonopt5input"
            />
            <label className="usa-radio__label" htmlFor="reasonopt5input">
              I decline the request, because the VSO is not currently accepting
              new clients
            </label>
          </div>

          <div className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              name="reason"
              value="opt6"
              id="reasonopt6input"
            />
            <label className="usa-radio__label" htmlFor="reasonopt6input">
              I decline for another reason
            </label>
          </div>
        </fieldset>

        <va-alert
          status="info"
          class="poa-request-details__form-alert"
          visible
          aria-live="polite"
          slim
        >
          <p className="vads-u-margin-y--0">
            We will send the claimant an email letting them know your decision.
          </p>
        </va-alert>
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
        <button
          type="submit"
          className="usa-button poa-request-details__form-submit"
        >
          Submit Decision
        </button>
      </Form>
    </section>
  );
};

POARequestDetailsPage.propTypes = {
  usePOARequests: PropTypes.func.isRequired,
};

export default POARequestDetailsPage;

export async function poaRequestLoader({ params }) {
  const { id } = params;

  try {
    const response = await apiRequest(`/power_of_attorney_requests/${id}`, {
      apiVersion: 'accredited_representative_portal/v0',
    });
    return response.data;
  } catch (error) {
    // Return mock data if API fails (TODO: remove this before pilot and replace with commented throw below)
    // throwing the error will cause the app to show the error message configured in routes.jsx
    return mockPOARequestsResponse.data.find(r => r.id === Number(id))
      ?.attributes;
    // throw error;
  }
}
