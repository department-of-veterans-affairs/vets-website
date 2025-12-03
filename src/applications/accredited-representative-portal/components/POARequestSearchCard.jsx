import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { resolutionDate } from '../utilities/poaRequests';

const POARequestSearchCard = ({ poaRequest }) => {
  const lastName = poaRequest?.powerOfAttorneyForm?.claimant?.name?.last;
  const firstName = poaRequest?.powerOfAttorneyForm?.claimant?.name?.first;
  const poaStatus =
    poaRequest.resolution?.decisionType || poaRequest.resolution?.type;
  return (
    <li>
      <div className="poa-request-search__card">
        <h3>
          {firstName} {lastName}
        </h3>
        <h4>Veteran or dependency status</h4>
        Veteran
        <h4>Power of attorney</h4>
        <ul className="poa-request-details-list">
          <li>
            <strong>Representative:</strong>
            &nbsp;
            {poaRequest.powerOfAttorneyHolder.name}
          </li>
          <li>
            <strong>POA status:</strong>
            &nbsp;
            {poaStatus === 'declination' && (
              <span className="poa-request__card-field--label">
                Declined
                {resolutionDate(
                  poaRequest.resolution?.createdAt,
                  poaRequest.id,
                )}
              </span>
            )}
            {poaStatus === 'acceptance' && (
              <span className="poa-request__card-field--label">
                Effective since
                {resolutionDate(
                  poaRequest.resolution?.createdAt,
                  poaRequest.id,
                )}
              </span>
            )}
            {poaStatus === 'expiration' && (
              <span className="poa-request__card-field--label">
                Expired
                <span>
                  {resolutionDate(
                    poaRequest.resolution?.createdAt,
                    poaRequest.id,
                  )}
                </span>
              </span>
            )}
            {!poaRequest.resolution && (
              <span className="poa-request__card-field--label">
                Pending since
                {resolutionDate(poaRequest.createdAt, poaRequest.id)}
              </span>
            )}
          </li>
          <li>
            <Link
              to={`/representation-requests/${poaRequest.id}`}
              className="vads-c-action-link--gray"
            >
              View POA request
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
};

POARequestSearchCard.propTypes = {
  cssClass: PropTypes.string,
  id: PropTypes.string,
  poaRequest: PropTypes.object,
};

export default POARequestSearchCard;
