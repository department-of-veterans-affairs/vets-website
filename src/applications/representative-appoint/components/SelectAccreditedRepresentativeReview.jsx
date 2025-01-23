import React from 'react';
import { getOrgName, convertRepType } from '../utilities/helpers';

const SelectedAccreditedRepresentativeReview = props => {
  const { data, goToPath } = props;
  const {
    'view:selectedRepresentative': { attributes: selectedRep },
  } = data;

  const isIndividual = !!selectedRep.individualType;
  const orgName = getOrgName(data);
  const repType = convertRepType(selectedRep.individualType);

  const renderIndividual = () => {
    return (
      <dl className="review">
        <div className="review-row">
          <dt>Name</dt>
          <dd>{selectedRep.fullName}</dd>
        </div>
        {orgName && (
          <div className="review-row">
            <dt>Organization</dt>
            <dd>{orgName} </dd>
          </div>
        )}
        <div className="review-row">
          <dt>Type</dt>
          <dd>{repType}</dd>
        </div>
        <div className="review-row">
          <dt>Mailing Address</dt>
          <dd>
            <div>{selectedRep.addressLine1}</div>
            <div>{selectedRep.addressLine2}</div>
            <div>{selectedRep.addressLine3}</div>
            <div>
              {selectedRep.city}, {selectedRep.stateCode} {selectedRep.zipCode}
            </div>
          </dd>
        </div>
        <div className="review-row">
          <dt>Phone number</dt>
          <dd>{selectedRep.phone}</dd>
        </div>
        <div className="review-row">
          <dt>Email address</dt>
          <dd>{selectedRep.email}</dd>
        </div>
      </dl>
    );
  };

  const renderOrg = () => {
    return (
      <dl className="review">
        <div className="review-row">
          <dt>Name</dt>
          <dd>{selectedRep.name}</dd>
        </div>
        <div className="review-row">
          <dt>Type</dt>
          <dd>Organization</dd>
        </div>
        <div className="review-row">
          <dt>Mailing Address</dt>
          <dd>
            <div>{selectedRep.addressLine1}</div>
            <div>{selectedRep.addressLine2}</div>
            <div>{selectedRep.addressLine3}</div>
            <div>
              {selectedRep.city}, {selectedRep.stateCode} {selectedRep.zipCode}
            </div>
          </dd>
        </div>
        <div className="review-row">
          <dt>Phone number</dt>
          <dd>{selectedRep.phone}</dd>
        </div>
        {selectedRep.email && (
          <div className="review-row">
            <dt>Email address</dt>
            <dd>{selectedRep.email}</dd>
          </div>
        )}
      </dl>
    );
  };

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Accredited representative information
          </h4>
          <va-button
            text="Edit"
            label="Edit Accredited Representative Information"
            onClick={() => goToPath('/representative-select?review=true')}
            secondary
            uswds
          />
        </div>
        {isIndividual ? renderIndividual() : renderOrg()}
      </form>
    </div>
  );
};

export { SelectedAccreditedRepresentativeReview }; // named export for testing

export default SelectedAccreditedRepresentativeReview;
