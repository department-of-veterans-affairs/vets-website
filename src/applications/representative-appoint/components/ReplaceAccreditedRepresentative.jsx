import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import CurrentAccreditedRepresentative from './CurrentAccreditedRepresentative';

const ReplaceAccreditedRepresentative = props => {
  const { formData } = props;

  const currentRepresentative = formData['view:representativeStatus'] || null;

  // Grab attorney/claimsAgent/representative for individuals, otherwise 'organization'
  const type =
    currentRepresentative.attributes?.individualType || 'organization';

  return (
    <div>
      <h3 className="vads-u-margin-y--5 ">
        Replace your current accredited representative
      </h3>
      <p>
        You’ll replace your current accredited representative with the new one
        you’ve selected.
      </p>
      <h4 className="vads-u-margin-y--5">
        You’ll replace this current accredited representative:
      </h4>
      <CurrentAccreditedRepresentative
        representativeName={
          currentRepresentative.name || currentRepresentative.fullName
        }
        type={type}
        addressLine1={currentRepresentative.addressLine1}
        addressLine2={currentRepresentative.addressLine2}
        addressLine3={currentRepresentative.addressLine3}
        city={currentRepresentative.city}
        stateCode={currentRepresentative.stateCode}
        zipCode={currentRepresentative.zipCode}
        phone={currentRepresentative.phone}
        email={currentRepresentative.email}
      />

      <h4 className="vads-u-margin-y--5">
        You’ve selected this new accredited representative:
      </h4>
    </div>
  );
};

ReplaceAccreditedRepresentative.propTypes = {
  fetchRepresentatives: PropTypes.func,
};

export default withRouter(ReplaceAccreditedRepresentative);
