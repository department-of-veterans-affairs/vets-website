import React, { useState, useEffect } from 'react';
import { useLoaderData, Form, redirect, useNavigation } from 'react-router-dom';
import {
  VaRadio,
  VaRadioOption,
  VaLoadingIndicator,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui';
import {
  expiresSoon,
  formatStatus,
  resolutionDate,
  BANNER_TYPES,
  DETAILS_BC_LABEL,
  poaDetailsBreadcrumbs,
} from '../utilities/poaRequests';
import { recordDatalayerEvent } from '../utilities/analytics';
import api from '../utilities/api';
import ProcessingBanner from '../components/ProcessingBanner';

const DECISION_TYPES = {
  ACCEPTANCE: 'acceptance',
  DECLINATION: 'declination',
};

const DECLINATION_OPTIONS = {
  DECLINATION_HEALTH_RECORDS_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason: "Decline, because change of address isn't authorized",
  },
  DECLINATION_ADDRESS_CHANGE_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason:
      'Decline, because protected medical record access is limited',
  },
  DECLINATION_BOTH_WITHHELD: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason:
      "Decline, because change of address isn't authorized and protected medical record access is limited",
  },
  DECLINATION_NOT_ACCEPTING_CLIENTS: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason: "Decline, because the VSO isn't accepting new clients",
  },
  DECLINATION_OTHER: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason: 'Decline, because of another reason',
  },
};

const DECLINATION_OPTIONS_UPDATE = {
  DECLINATION_LIMITED_AUTH: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason: 'Decline, because authorization is limited',
  },
  DECLINATION_OUTSIDE_SERVICE_TERRITORY: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason:
      'Decline, because the claimant is outside of the organization’s service territory',
  },
  DECLINATION_OTHER: {
    type: DECISION_TYPES.DECLINATION,
    declinationReason: 'Decline, because of another reason',
  },
};

const DECISION_OPTIONS = {
  ACCEPTANCE: {
    type: DECISION_TYPES.ACCEPTANCE,
    declinationReason: null,
  },
  ...DECLINATION_OPTIONS,
  ...DECLINATION_OPTIONS_UPDATE,
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
    return <NoAccess />;
  }
  return <Authorized />;
};
const checkLimitations = (limitations, limit) => {
  const checkLimitation = limitations.includes(limit);
  return checkAuthorizations(checkLimitation);
};

const POARequestDetailsPage = title => {
  const poaRequest = useLoaderData();
  const [error, setError] = useState();
  const [decisionValue, setDecisionValue] = useState();
  const handleChange = e => {
    e.preventDefault();
    const radioValue = e.detail?.value;
    if (radioValue) {
      setError();
    } else {
      setError(true);
    }
    setDecisionValue(radioValue);
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
  const formattedPhone = phone.replace(/[^a-zA-Z0-9]/g, '');
  const email = poaRequest?.powerOfAttorneyForm.claimant.email;
  const claimantFirstName = poaRequest?.powerOfAttorneyForm.claimant.name.first;
  const claimantLastName = poaRequest?.powerOfAttorneyForm.claimant.name.last;
  const {
    recordDisclosureLimitations,
  } = poaRequest.powerOfAttorneyForm.authorizations;

  const poaRequestSubmission =
    poaRequest?.powerOfAttorneyFormSubmission?.status;
  const navigation = useNavigation();
  useEffect(
    () => {
      focusElement('h1');
      document.title = title.title;
    },
    [title],
  );

  const handleSubmit = e => {
    if (!decisionValue) {
      setError('Select an option to continue');
      e.preventDefault();
    }
    return true;
  };

  setTimeout(() => {
    if (document.querySelector('va-radio')) {
      document
        .querySelector('va-radio')
        .shadowRoot?.querySelector('h2')
        .setAttribute('style', 'font-size:1.0625rem;');
      document
        .querySelector('va-radio')
        .shadowRoot?.querySelector('legend')
        .setAttribute('style', 'max-width:100%;');
    }
  }, '1000');

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={poaDetailsBreadcrumbs}
        label={DETAILS_BC_LABEL}
        homeVeteransAffairs={false}
      />
      {navigation.state === 'loading' ? (
        <VaLoadingIndicator message="Loading..." />
      ) : (
        <section className="poa-request-details">
          <h1
            className="poa-request-details__header"
            data-testid="poa-request-details-header"
            tabIndex={-1}
          >
            POA request
            <p className="poa-request-details__name">
              {claimantLastName}, {claimantFirstName}
              {poaStatus !== 'expired' && (
                <span
                  className={`usa-label vads-u-font-family--sans poa-request-details__status status status--processing ${poaRequestSubmission ===
                    BANNER_TYPES.FAILED && 'vads-u-display--none'}`}
                >
                  {poaRequestSubmission === BANNER_TYPES.PROCESSING
                    ? 'processing'
                    : formatStatus(poaStatus)}
                </span>
              )}
            </p>
          </h1>

          <ul className="poa-request-details__list poa-request-details__list--col">
            <li className="poa-request-details__list-item">
              <p className="poa-request-details__title">
                Requested representative
              </p>
              <p className="poa-request-details__subtitle">
                {poaRequest?.powerOfAttorneyHolder?.name}
              </p>
            </li>
            <li className="poa-request-details__list-item">
              {poaRequest?.createdAt && (
                <>
                  <p className="poa-request-details__title">
                    Request submitted on
                  </p>
                  {resolutionDate(poaRequest?.createdAt, poaStatus.id)}
                </>
              )}
            </li>
            <li className="poa-request-details__list-item">
              {poaStatus === 'declination' && (
                <>
                  <p className="poa-request-details__title">
                    Request declined on
                  </p>
                  {resolutionDate(
                    poaRequest.resolution?.createdAt,
                    poaStatus.id,
                  )}
                </>
              )}
              {poaStatus === 'acceptance' && (
                <span
                  className={
                    (poaRequestSubmission === BANNER_TYPES.PROCESSING ||
                      poaRequestSubmission === BANNER_TYPES.FAILED) &&
                    'vads-u-display--none'
                  }
                >
                  <p className="poa-request-details__title">
                    <va-icon
                      icon="check_circle"
                      class="vads-u-color--success-dark poa-request__card-icon"
                    />{' '}
                    Request accepted on
                  </p>
                  {resolutionDate(
                    poaRequest.resolution?.createdAt,
                    poaStatus.id,
                  )}
                </span>
              )}
              {poaStatus === 'expiration' && (
                <>
                  <p className="poa-request-details__title">
                    Request expired on
                  </p>
                  {resolutionDate(
                    poaRequest.resolution?.createdAt,
                    poaStatus.id,
                  )}
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

            <h2 className="poa-request-details__h2">Claimant information</h2>
            <ul className="poa-request-details__list poa-request-details__list--info">
              <li>
                <p>Relationship to Veteran</p>
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
                <p>
                  <va-telephone contact={formattedPhone} not-clickable />
                </p>
              </li>
              <li>
                <p>Email</p>
                <p>{email}</p>
              </li>
              {relationship === 'Self' && (
                <>
                  <li>
                    <p>Last 4 digits of Social Security number</p>
                    <p>{poaRequest?.powerOfAttorneyForm?.claimant?.ssn}</p>
                  </li>
                  <li>
                    <p>Last 4 digits of VA file number</p>
                    <p>
                      {poaRequest?.powerOfAttorneyForm?.claimant?.vaFileNumber}
                    </p>
                  </li>
                </>
              )}
            </ul>

            {/* if there is a claimant that is a relative/friend to the veteran, their information will populate in the previous table under claimant,
        and the veteran information will show up here. if the veteran is filing themselves, they will appear as the claimant */}
            {poaRequest.powerOfAttorneyForm.veteran && (
              <>
                <h2 className="poa-request-details__h2">
                  Veteran identification information
                </h2>
                <ul className="poa-request-details__list poa-request-details__list--info">
                  <li>
                    <p>Name</p>
                    <p>
                      {poaRequest?.powerOfAttorneyForm?.veteran?.name?.last},{' '}
                      {poaRequest?.powerOfAttorneyForm?.veteran?.name?.first}
                    </p>
                  </li>
                  <li>
                    <p>Last 4 digits of Social security number</p>
                    <p>{poaRequest?.powerOfAttorneyForm?.veteran?.ssn}</p>
                  </li>
                  <li>
                    <p>Last 4 digits of VA file number</p>
                    <p>
                      {poaRequest?.powerOfAttorneyForm?.veteran?.vaFileNumber}
                    </p>
                  </li>
                </ul>
              </>
            )}

            <h2 className="poa-request-details__h2">
              Authorization information
            </h2>
            <ul className="poa-request-details__list poa-request-details__list--info">
              <li>
                <p>Change of address</p>
                <p>
                  {poaRequest?.powerOfAttorneyForm.authorizations
                    .addressChange ? (
                    <Authorized />
                  ) : (
                    <NoAccess />
                  )}
                </p>
              </li>
              <li>
                <p>Protected medical records</p>
                <p>
                  {recordDisclosureLimitations.length === 0 && <Authorized />}
                  {recordDisclosureLimitations.length < 4 &&
                    recordDisclosureLimitations.length > 0 && <AccessToSome />}
                  {recordDisclosureLimitations.length === 4 && <NoAccess />}
                </p>
              </li>
              <li>
                <p>Alcoholism or alcohol abuse records</p>
                <p>
                  {checkLimitations(recordDisclosureLimitations, 'ALCOHOLISM')}
                </p>
              </li>
              <li>
                <p>Drug abuse records</p>
                <p>
                  {checkLimitations(recordDisclosureLimitations, 'DRUG_ABUSE')}
                </p>
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
              <Toggler
                toggleName={
                  Toggler.TOGGLE_NAMES.accreditedRepresentativePortalForm
                }
              >
                <Toggler.Enabled>
                  <Form
                    method="post"
                    action="decision"
                    onSubmit={handleSubmit}
                    className={
                      error
                        ? `poa-request-details__form poa-request-details__form--error`
                        : `poa-request-details__form`
                    }
                  >
                    <VaRadio
                      header-aria-describedby={null}
                      label="Do you accept or decline this representation request?"
                      label-header-level={2}
                      class="poa-request-details__form-label"
                      onVaValueChange={handleChange}
                      required
                      error={error}
                      onRadioOptionSelected={recordDatalayerEvent}
                      enable-analytics="false"
                    >
                      <p>
                        <strong>Note:</strong> If you’d like the claimant to
                        make changes to their request, ask them to resubmit
                        online VA Form 21-22 with those changes. Their new
                        request will replace this one in the portal.
                      </p>
                      <p>
                        If you accept or decline, we’ll send the claimant an
                        email letting them know your decision.
                      </p>
                      <VaRadioOption
                        label="Accept"
                        value="ACCEPTANCE"
                        name="decision"
                        data-eventname="int-radio-button-option-click"
                      />

                      {Object.entries(DECLINATION_OPTIONS_UPDATE).map(
                        ([value, decision]) => (
                          <VaRadioOption
                            key={value}
                            label={decision.declinationReason}
                            value={value}
                            name="decision"
                            data-eventname="int-radio-button-option-click"
                          />
                        ),
                      )}
                    </VaRadio>

                    {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                    <button
                      type="submit"
                      className="usa-button poa-request-details__form-submit"
                    >
                      Submit response
                    </button>
                  </Form>
                </Toggler.Enabled>
                <Toggler.Disabled>
                  <Form
                    method="post"
                    action="decision"
                    onSubmit={handleSubmit}
                    className={
                      error
                        ? `poa-request-details__form poa-request-details__form--error`
                        : `poa-request-details__form`
                    }
                  >
                    <VaRadio
                      header-aria-describedby={null}
                      label="Do you accept or decline this POA request?"
                      label-header-level={2}
                      class="poa-request-details__form-label"
                      onVaValueChange={handleChange}
                      required
                      error={error}
                      onRadioOptionSelected={recordDatalayerEvent}
                      enable-analytics="false"
                    >
                      <p>
                        We’ll send the claimant an email letting them know your
                        decision.
                      </p>
                      <VaRadioOption
                        label="Accept"
                        value="ACCEPTANCE"
                        name="decision"
                        data-eventname="int-radio-button-option-click"
                      />

                      {Object.entries(DECLINATION_OPTIONS).map(
                        ([value, decision]) => (
                          <VaRadioOption
                            key={value}
                            label={decision.declinationReason}
                            value={value}
                            name="decision"
                            data-eventname="int-radio-button-option-click"
                          />
                        ),
                      )}
                    </VaRadio>

                    {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                    <button
                      type="submit"
                      className="usa-button poa-request-details__form-submit"
                    >
                      Submit decision
                    </button>
                  </Form>
                </Toggler.Disabled>
              </Toggler>
            )}
          </div>
        </section>
      )}
    </>
  );
};

POARequestDetailsPage.loader = ({ params, request }) => {
  return api.getPOARequest(params.id, {
    signal: request.signal,
  });
};

POARequestDetailsPage.createDecisionAction = async ({ params, request }) => {
  const key = (await request.formData()).get('decision');
  const decision = {
    ...DECISION_OPTIONS[key], // Spread the existing decision object
    key, // Add the key field with the value of the key
  };

  await api.createPOARequestDecision(params.id, decision, {
    signal: request.signal,
  });

  return redirect('..');
};

export default POARequestDetailsPage;
