import React, { useState } from 'react';
import { Link, useLoaderData, Form, redirect } from 'react-router-dom';
import { formatDateShort } from 'platform/utilities/date/index';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import api from '../utilities/api';

const DECISION_TYPES = {
  ACCEPTANCE: 'acceptance',
  DECLINATION: 'declination',
};

const DECLINATION_OPTIONS = {
  DECLINATION_HEALTH_RECORDS_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    reason:
      "I decline the request, because the claimant didn't provide access to health records",
  },
  DECLINATION_ADDRESS_CHANGE_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    reason:
      "I decline the request, because the claimant didn't allow me to change their address",
  },
  DECLINATION_BOTH_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    reason:
      'I decline the request, because the claimant did not provide access to change address and to health records',
  },
  DECLINATION_NOT_ACCEPTING_CLIENTS: {
    type: DECISION_TYPES.DECLINATION,
    reason:
      'I decline the request, because the VSO is not currently accepting new clients',
  },
  DECLINATION_OTHER: {
    type: DECISION_TYPES.DECLINATION,
    reason: 'I decline for another reason',
  },
};

const DECISION_OPTIONS = {
  ACCEPTANCE: {
    type: DECISION_TYPES.ACCEPTANCE,
    reason: null,
  },
  ...DECLINATION_OPTIONS,
};

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
  const poaRequest = useLoaderData().attributes;
  const [error, setError] = useState(false);
  const handleChange = e => {
    e.preventDefault();
    const radioValue = e.detail?.value;
    if (radioValue) {
      setError(false);
    } else {
      setError(true);
    }
  };
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
        action="decision"
        className={
          error
            ? `poa-request-details__form poa-request-details__form--error`
            : `poa-request-details__form`
        }
      >
        <VaRadio
          header-aria-describedby={null}
          hint=""
          label="Do you accept or decline this POA request?"
          label-header-level="4"
          class="poa-request-details__form-label"
          onVaValueChange={handleChange}
          required
        >
          <VaRadioOption
            label="I accept the request"
            value="ACCEPTANCE"
            name="decision"
          />

          {Object.entries(DECLINATION_OPTIONS).map(([value, decision]) => (
            <VaRadioOption
              key={value}
              label={decision.reason}
              value={value}
              name="decision"
            />
          ))}
        </VaRadio>

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

POARequestDetailsPage.loader = ({ params, request }) => {
  return api.getPOARequest(params.id, {
    signal: request.signal,
  });
};

POARequestDetailsPage.createDecisionAction = async ({ params, request }) => {
  const key = (await request.formData()).get('decision');
  const decision = DECISION_OPTIONS[key];

  await api.createPOARequestDecision(params.id, decision, {
    signal: request.signal,
  });

  return redirect('..');
};

export default POARequestDetailsPage;
