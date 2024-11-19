import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import usePOARequests from '../../hooks/usePOARequests';
import { formatDate } from '../POARequestsTable/POARequestsTable';

const POARequestDetails = () => {
  const { poaRequests } = usePOARequests();
  const { id } = useParams();

  const details =
    poaRequests &&
    poaRequests
      .filter(request => request.id === Number(id))
      .map(request => request.attributes);

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

  return (
    <section data-testid="poa-requests-card" className="poa-request-details">
      <h1>
        POA Requests: {details[0].claimant?.firstName}{' '}
        {details[0].claimant?.lastName}{' '}
      </h1>

      <span
        className="poa-request-details__divider"
        aria-hidden="true"
        tabIndex={-1}
      />

      <h2>Veteran Information</h2>

      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Name</p>
          <p className="poa-request-details__subtitle">
            {details[0].veteran.lastName}, {details[0].veteran.firstName}
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

      <h2>POA Request Information</h2>

      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">POA submission date</p>
          <p className="poa-request-details__subtitle">
            {formatDate(details[0].submittedAt)}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">
            {details[0].status === 'Declined' && (
              <va-icon
                icon="close"
                class="poa-request__card-icon--red poa-request__card-icon"
              />
            )}
            {details[0].status === 'Accepted' && (
              <va-icon
                icon="check_circle"
                class="poa-request__card-icon--green poa-request__card-icon"
              />
            )}
            <span>POA Status</span>
          </p>
          <p className="poa-request-details__subtitle">{details[0].status}</p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Represented through</p>
          <p className="poa-request-details__subtitle">
            Disabled American Veterans
          </p>
        </li>
      </ul>

      <h2>Claimant Information</h2>
      <ul className="poa-request-details__list">
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Claimant Name</p>
          <p className="poa-request-details__subtitle">
            {details[0].claimant.lastName}, {details[0].claimant.firstName}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Relationship to Veteran</p>
          <p className="poa-request-details__subtitle">
            {details[0].claimant.relationshipToVeteran}
          </p>
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">Address</p>
          <p className="poa-request-details__subtitle">
            {details[0].claimantAddress.city},{' '}
            {details[0].claimantAddress.state}
            <br />
            {details[0].claimantAddress.zip}
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

      <h2>Limitations of Consent</h2>
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
            details[0].isTreatmentDisclosureAuthorized,
            details[0].isAddressChangingAuthorized,
            true,
          )}
        </li>
        <li className="poa-request-details__list-item">
          <p className="poa-request-details__title">
            <va-icon
              icon="warning"
              class="poa-request__card-icon--red poa-request__card-icon"
            />
            Declines
          </p>

          {checkAuthorizations(
            details[0].isTreatmentDisclosureAuthorized,
            details[0].isAddressChangingAuthorized,
            false,
          )}
        </li>
      </ul>
    </section>
  );
};
POARequestDetails.propTypes = {
  usePOARequests: PropTypes.func.isRequired,
};
export default POARequestDetails;
