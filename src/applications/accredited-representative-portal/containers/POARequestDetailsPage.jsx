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
import ProcessingBanner from '../components/ProcessingBanner';

const DECISION_TYPES = {
  ACCEPTANCE: 'acceptance',
  DECLINATION: 'declination',
};

const DECLINATION_OPTIONS = {
  DECLINATION_HEALTH_RECORDS_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    reason: "Decline, because change of address isn't authorized",
  },
  DECLINATION_ADDRESS_CHANGE_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    reason: 'Decline, because protected medical record access is limited',
  },
  DECLINATION_BOTH_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    reason:
      "Decline, because change of address isn't authorized and protected medical record access is limited",
  },
  DECLINATION_NOT_ACCEPTING_CLIENTS: {
    type: DECISION_TYPES.DECLINATION,
    reason: "Decline, because the VSO isn't accepting new clients",
  },
  DECLINATION_OTHER: {
    type: DECISION_TYPES.DECLINATION,
    reason: 'Decline, because of another reason',
  },
};

const DECISION_OPTIONS = {
  ACCEPTANCE: {
    type: DECISION_TYPES.ACCEPTANCE,
    reason: null,
  },
  ...DECLINATION_OPTIONS,
};

const BANNER_TYPES = {
  PROCESSING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
};

const PROCESSING_BANNER = {
  HEADER: 'We’re processing the accepted POA request',
  ACCEPTED: 'You accepted the POA request on',
  COPY:
    'We’re processing your decision. This normally takes 1-2 minutes, but can sometimes take longer. We’ll update the status on the request once it finishes processing. You can refresh the page to check for updates.',
};
const ERROR_BANNER = {
  HEADER: 'We couldn’t process the accepted POA request',
  COPY:
    'We’re sorry, there was a problem with our system. We weren’t able to process your decision and update the status on the request. To try again, contact the claimant and ask them to resubmit VA Form 21-22.',
};

const Authorized = () => {
  return (
    <span>
      <va-icon
        height={20}
        maxWidth={20}
        icon="check_circle"
        class="vads-u-color--success-dark poa-request__card-icon"
      />
      Authorized
    </span>
  );
};

const NoAccess = () => {
  return (
    <span>
      <va-icon
        height={20}
        maxWidth={20}
        icon="warning"
        class="vads-u-color--warning-dark poa-request__card-icon"
      />
      No Access
    </span>
  );
};

const AccessToSome = () => {
  return (
    <span>
      <va-icon
        height={20}
        maxWidth={20}
        icon="warning"
        class="vads-u-color--warning-dark poa-request__card-icon"
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
    poaRequest.resolution?.decisionType ||
    poaRequest.resolution?.type ||
    'Pending';

  const relationship =
    poaRequest?.powerOfAttorneyForm.claimant.relationship || 'Self';
  const city = poaRequest?.powerOfAttorneyForm.claimant.address.city;
  const state = poaRequest?.powerOfAttorneyForm.claimant.address.stateCode;
  const zipCode = poaRequest?.powerOfAttorneyForm.claimant.address.zipCode;
  const phone = poaRequest?.powerOfAttorneyForm.claimant.phone;
  const email = poaRequest?.powerOfAttorneyForm.claimant.email;
  const claimantFirstName = poaRequest?.powerOfAttorneyForm.claimant.name.first;
  const claimantLastName = poaRequest?.powerOfAttorneyForm.claimant.name.last;
  const {
    recordDisclosureLimitations,
  } = poaRequest.powerOfAttorneyForm.authorizations;

  const poaRequestSubmission = poaRequest?.powerOfAttorneyFormSubmission.status;

  return (
    <section className="poa-request-details">
      <h1
        className="poa-request-details__header"
        data-testid="poa-request-details-header"
      >
        POA request
      </h1>
      <h2 className="poa-request-details__name">
        {claimantLastName}, {claimantFirstName}
        {poaStatus !== 'expired' && (
          <span
            className={`usa-label vads-u-font-family--sans poa-request-details__status status status--${poaStatus}`}
          >
            {formatStatus(poaStatus)}
          </span>
        )}
      </h2>

      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Requested representative</p>
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
              <p className="poa-request-details__title">Request declined on</p>
              {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
            </>
          )}
          {poaStatus === 'acceptance' && (
            <>
              <p className="poa-request-details__title">
                <va-icon
                  icon="check_circle"
                  class="vads-u-color--success-dark poa-request__card-icon"
                />{' '}
                Request accepted on
              </p>
              {resolutionDate(poaRequest.resolution?.createdAt, poaStatus.id)}
            </>
          )}
          {poaStatus === 'expiration' && (
            <>
              <p className="poa-request-details__title">Request expired on</p>
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
                Request expires on
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
        {poaRequestSubmission === BANNER_TYPES.PROCESSING && (
          <ProcessingBanner
            status="info"
            header={PROCESSING_BANNER.HEADER}
            accepted={PROCESSING_BANNER.ACCEPTED}
            date={poaRequest.resolution?.createdAt}
            copy={PROCESSING_BANNER.COPY}
          />
        )}

        {poaRequestSubmission === BANNER_TYPES.FAILED && (
          <ProcessingBanner
            status="error"
            header={ERROR_BANNER.HEADER}
            copy={ERROR_BANNER.COPY}
          />
        )}

        <h2>Claimant information</h2>
        <ul className="poa-request-details__list poa-request-details__list--info">
          <li>
            <p>Relationship to veteran</p>
            <p>{relationship}</p>
          </li>
          <li>
            <p>Address</p>
            <p>
              {city}, {state}, {zipCode}
            </p>
          </li>
          <li>
            <p>Phone</p>
            <p>{phone}</p>
          </li>
          <li>
            <p>Email</p>
            <p>{email}</p>
          </li>
          {relationship === 'Self' && (
            <>
              <li>
                <p>Social Security number</p>
                <p>{poaRequest?.powerOfAttorneyForm?.claimant?.ssn}</p>
              </li>
              <li>
                <p>VA file number</p>
                <p>{poaRequest?.powerOfAttorneyForm?.claimant?.vaFileNumber}</p>
              </li>
            </>
          )}
        </ul>

        {/* if there is a claimant that is a relative/friend to the veteran, their information will populate in the previous table under claimant,
        and the veteran information will show up here. if the veteran is filing themselves, they will appear as the claimant */}
        {poaRequest.powerOfAttorneyForm.veteran && (
          <>
            <h2>Veteran information</h2>
            <ul className="poa-request-details__list poa-request-details__list--info">
              <li>
                <p>Name</p>
                <p>
                  {poaRequest?.power_of_attorney_form?.veteran?.name?.last},{' '}
                  {poaRequest?.power_of_attorney_form?.veteran?.name?.first}
                </p>
              </li>
              <li>
                <p>Social security number</p>
                <p>{poaRequest?.power_of_attorney_form?.veteran?.ssn}</p>
              </li>
              <li>
                <p>VA file number</p>
                <p>
                  {poaRequest?.power_of_attorney_form?.veteran?.vaFileNumber}
                </p>
              </li>
            </ul>
          </>
        )}

        <h2>Authorization information</h2>
        <ul className="poa-request-details__list poa-request-details__list--info">
          <li>
            <p>Change of address</p>
            <p>
              {checkAuthorizations(
                poaRequest?.powerOfAttorneyForm.authorizations.addressChange,
              )}
            </p>
          </li>
          <li>
            <p>Protected medical records</p>
            <p>
              {recordDisclosureLimitations.length === 0 && <NoAccess />}
              {recordDisclosureLimitations.length < 4 &&
                recordDisclosureLimitations.length > 0 && <AccessToSome />}
              {recordDisclosureLimitations.length === 4 && <Authorized />}
            </p>
          </li>
          <li>
            <p>Alcoholism or alcohol abuse records</p>
            <p>{checkLimitations(recordDisclosureLimitations, 'ALCOHOLISM')}</p>
          </li>
          <li>
            <p>Drug abuse records</p>
            <p>{checkLimitations(recordDisclosureLimitations, 'DRUG_ABUSE')}</p>
          </li>
          <li>
            <p>HIV records</p>
            <p>{checkLimitations(recordDisclosureLimitations, 'HIV')}</p>
          </li>
          <li>
            <p>Sickle cell anemia records</p>
            <p>
              {checkLimitations(recordDisclosureLimitations, 'SICKLE_CELL')}
            </p>
          </li>
        </ul>

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
              label="Do you accept or decline this POA request?"
              label-header-level="4"
              class="poa-request-details__form-label"
              onVaValueChange={handleChange}
              required
            >
              <p>
                We’ll send the claimant an email letting them know your
                decision.
              </p>
              <VaRadioOption
                label="Accept"
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
