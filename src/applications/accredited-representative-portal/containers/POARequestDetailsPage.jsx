import React, { useState } from 'react';
import { useLoaderData, Form, redirect } from 'react-router-dom';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  expiresSoon,
  formatStatus,
  resolutionDate,
} from '../utilities/poaRequests';
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

const Authorized = () => {
  return (
    <span>
      <va-icon
        icon="check_circle"
        class="vads-u-color--success poa-request__card-icon"
      />
      Authorized
    </span>
  );
};

const NoAccess = () => {
  return (
    <span>
      <va-icon
        icon="warning"
        class="vads-u-color--error poa-request__card-icon"
      />
      No Access
    </span>
  );
};

const AccessToSome = () => {
  return (
    <span>
      <va-icon
        icon="warning"
        class="vads-u-color--error poa-request__card-icon"
      />
      Access to some
    </span>
  );
};
const checkAuthorizations = x => {
  if (x) {
    return <Authorized />;
  }
  return <NoAccess />;
};
const checkLimitations = (limitations, limit) => {
  const checkLimitation = limitations.includes(limit);
  return checkAuthorizations(checkLimitation);
};

const POARequestDetailsPage = () => {
  const poaRequest = useLoaderData();
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

  const poaStatus =
    poaRequest.resolution?.decision_type ||
    poaRequest.resolution?.type ||
    'Pending';

  const relationship = poaRequest?.powerOfAttorneyForm.claimant.relationship;
  const city = poaRequest?.powerOfAttorneyForm.claimant.address.city;
  const state = poaRequest?.powerOfAttorneyForm.claimant.address.stateCode;
  const zipCode = poaRequest?.powerOfAttorneyForm.claimant.address.zipCode;
  const phone = poaRequest?.powerOfAttorneyForm.claimant.phone;
  const email = poaRequest.powerOfAttorneyForm.claimant.emaill;
  const claimantFirstName = poaRequest?.powerOfAttorneyForm.claimant.name.first;
  const claimantLastName = poaRequest?.powerOfAttorneyForm.claimant.name.last;
  const {
    recordDisclosureLimitations,
  } = poaRequest.powerOfAttorneyForm.authorizations;
  return (
    <section className="poa-request-details">
      <h1 data-testid="poa-request-details-header">POA request</h1>
      <h2 className="poa-request-details__name">
        {claimantLastName}, {claimantFirstName}
        <span
          className={`usa-label vads-u-font-family--sans poa-request-details__status ${poaStatus}`}
        >
          {formatStatus(poaStatus)}
        </span>
      </h2>

      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">
            Requesting representation through
          </p>
          <p className="poa-request-details__subtitle">
            {poaRequest?.powerOfAttorneyHolder?.name}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          {poaRequest?.createdAt && (
            <>
              <p className="poa-request-details__title">Request submitted on</p>
              {resolutionDate(poaRequest?.createdAt, poaStatus.id)}
            </>
          )}
        </li>
        <li className="poa-request-details__list-item">
          {poaStatus === 'declination' && (
            <>
              <p className="poa-request-details__title">
                POA request declined on
              </p>
              {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
            </>
          )}
          {poaStatus === 'acceptance' && (
            <>
              <p className="poa-request-details__title">
                <va-icon
                  icon="check_circle"
                  class="vads-u-color--success poa-request__card-icon"
                />{' '}
                POA request accepted on
              </p>
              {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
            </>
          )}
          {poaStatus === 'expiration' && (
            <>
              <p className="poa-request-details__title">
                <va-icon
                  icon="warning"
                  class="vads-u-color--error poa-request__card-icon"
                />{' '}
                POA request expired on
              </p>
              {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
            </>
          )}
          {poaStatus === 'Pending' && (
            <>
              <p className="poa-request-details__title">
                {expiresSoon(poaRequest.expiresAt) && (
                  <va-icon
                    class="poa-request__card-icon"
                    icon="warning"
                    size={2}
                    srtext="warning"
                    aria-hidden="true"
                  />
                )}
                POA request expires on
              </p>
              {resolutionDate(poaRequest?.expiresAt, poaStatus.id)}
            </>
          )}
        </li>
      </ul>

      <span
        className="poa-request-details__divider"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="poa-request-details__info">
        <h2>Claimant information</h2>
        <table className="poa-request-details__table">
          <tr>
            <th scope="row">Relationship to veteran</th>
            <td>{relationship}</td>
          </tr>
          <tr>
            <th scope="row">Address</th>
            <td>
              {city}, {state}, {zipCode}
            </td>
          </tr>
          <tr>
            <th scope="row">Phone</th>
            <td>{phone}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>{email}</td>
          </tr>
          {relationship === 'Self' && (
            <>
              <tr>
                <th scope="row">Social security number</th>
                <td>{poaRequest?.powerOfAttorneyForm?.claimant?.ssn}</td>
              </tr>
              <tr>
                <th scope="row">VA file number</th>
                <td>
                  {poaRequest?.powerOfAttorneyForm?.claimant?.va_file_number}
                </td>
              </tr>
            </>
          )}
        </table>

        {/* if there is a claimant that is a relative/friend to the veteran, their information will populate in the previous table under claimant,
        and the veteran information will show up here. if the veteran is filing themselves, they will appear as the claimant */}
        {poaRequest.powerOfAttorneyForm.veteran && (
          <>
            <h2>Veteran information</h2>
            <table className="poa-request-details__table">
              <tr>
                <th scope="row">Name</th>
                <td>
                  {poaRequest?.powerOfAttorneyForm?.veteran?.name?.last},{' '}
                  {poaRequest?.powerOfAttorneyForm?.veteran?.name?.first}
                </td>
              </tr>
              <tr>
                <th scope="row">Social security number</th>
                <td>{poaRequest?.powerOfAttorneyForm?.veteran?.ssn}</td>
              </tr>
              <tr>
                <th scope="row">VA file number</th>
                <td>
                  {poaRequest?.powerOfAttorneyForm?.veteran?.vaFileNumber}
                </td>
              </tr>
            </table>
          </>
        )}

        <h2>Authorization information</h2>
        <table className="poa-request-details__table">
          <tr>
            <th scope="row">Change of address</th>
            <td>
              {checkAuthorizations(
                poaRequest?.powerOfAttorneyForm.authorizations.address_change,
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Protected medical records</th>
            <td>
              {recordDisclosureLimitations.length === 0 && <NoAccess />}
              {recordDisclosureLimitations.length < 4 &&
                recordDisclosureLimitations.length > 0 && <AccessToSome />}
              {recordDisclosureLimitations.length === 4 && <Authorized />}
            </td>
          </tr>
          <tr>
            <th scope="row">Alcoholism or alcohol abuse records</th>
            <td>
              {checkLimitations(recordDisclosureLimitations, 'ALCOHOLISM')}
            </td>
          </tr>
          <tr>
            <th scope="row">Drug abuse records</th>
            <td>
              {checkLimitations(recordDisclosureLimitations, 'DRUG_ABUSE')}
            </td>
          </tr>
          <tr>
            <th scope="row">HIV records</th>
            <td>{checkLimitations(recordDisclosureLimitations, 'HIV')}</td>
          </tr>
          <tr>
            <th scope="row">Sickle cell anemia records</th>
            <td>
              {checkLimitations(recordDisclosureLimitations, 'SICKLE_CELL')}
            </td>
          </tr>
        </table>

        {poaStatus === 'Pending' && (
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
                We will send the claimant an email letting them know your
                decision.
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
        )}
      </div>
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
