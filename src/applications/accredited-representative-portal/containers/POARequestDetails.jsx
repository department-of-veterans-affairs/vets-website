import PropTypes from 'prop-types';
import React from 'react';
import { useParams, Link } from 'react-router-dom-v5-compat';
import { formatDateShort } from 'platform/utilities/date/index';
import usePOARequests from '../hooks/usePOARequests';

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

const POARequestDetails = () => {
  const { isLoading, poaRequests } = usePOARequests();
  const { id } = useParams();

  const poaRequest =
    poaRequests && poaRequests.find(r => r.id === Number(id))?.attributes;

  if (isLoading)
    return (
      <va-loading-indicator
        data-testid="poa-requests-table-fetcher-loading"
        message="Loading POA requests..."
      />
    );
  return (
    <section className="poa-request-details">
      <h1>
        POA request: {poaRequest?.claimant?.firstName}{' '}
        {poaRequest?.claimant?.lastName}
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
                class="poa-request__card-icon--red poa-request__card-icon"
              />
            )}
            {poaRequest?.status === 'Accepted' && (
              <va-icon
                icon="check_circle"
                class="poa-request__card-icon--green poa-request__card-icon"
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
              class="poa-request__card-icon--green poa-request__card-icon"
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
    </section>
  );
};
POARequestDetails.propTypes = {
  usePOARequests: PropTypes.func.isRequired,
};
export default POARequestDetails;
