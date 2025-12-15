import React, { useState, useEffect } from 'react';
import { useLoaderData, Form, redirect, useNavigation } from 'react-router-dom';
import {
  VaRadio,
  VaRadioOption,
  VaLoadingIndicator,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import {
  formatStatus,
  BANNER_TYPES,
  DETAILS_BC_LABEL,
  PROCESSING_BANNER,
  ERROR_BANNER,
  poaDetailsBreadcrumbs,
} from '../utilities/poaRequests';
import { recordDatalayerEvent } from '../utilities/analytics';
import api from '../utilities/api';
import ProcessingBanner from '../components/ProcessingBanner';
import POADetailsColumn from '../components/POADetailsColumn';
import POADetailsAuthorization from '../components/POADetailsAuthorization';

const DECISION_TYPES = {
  ACCEPTANCE: 'acceptance',
  DECLINATION: 'declination',
};

const DECLINATION_OPTIONS = {
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
  const addressChange =
    poaRequest?.powerOfAttorneyForm.authorizations.addressChange;
  const poaRequestSubmission =
    poaRequest?.powerOfAttorneyFormSubmission?.status;
  const navigation = useNavigation();
  useEffect(() => {
    focusElement('h1');
  }, []);
  useEffect(
    () => {
      document.title = title.title;
      focusElement('.poa__alert');
    },
    [title, poaRequestSubmission],
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
            Representation request
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

          <POADetailsColumn poaRequest={poaRequest} poaStatus={poaStatus} />

          <span
            className="poa-request-details__divider"
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className="poa-request-details__info">
            {poaRequestSubmission === BANNER_TYPES.PROCESSING && (
              <ProcessingBanner
                status="info"
                representative={
                  poaRequest?.resolution?.accreditedIndividual.fullName ||
                  'Your organization'
                }
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
                  {city}, {state} {zipCode}
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

            {/* Authorization component */}
            <POADetailsAuthorization
              recordDisclosureLimitations={recordDisclosureLimitations}
              addressChange={addressChange}
            />

            {poaStatus === 'Pending' && (
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
                    <strong>Note:</strong> If you’d like the claimant to make
                    changes to their request, ask them to resubmit online VA
                    Form 21-22 with those changes. Their new request will
                    replace this one in the portal.
                  </p>
                  <p>
                    If you accept or decline, we’ll send the claimant an email
                    letting them know your decision.
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
                  Submit response
                </button>
              </Form>
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
