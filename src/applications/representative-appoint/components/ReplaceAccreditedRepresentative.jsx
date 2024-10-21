import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CurrentAccreditedRepresentative from './CurrentAccreditedRepresentative';
import ContactCard from './ContactCard';

const ReplaceAccreditedRepresentative = props => {
  const { formData } = props;

  const currentRepresentative =
    formData?.['view:representativeStatus']?.attributes || {};
  const selectedRepresentative =
    formData?.['view:selectedRepresentative']?.attributes || {};

  const address = {
    addressLine1: (selectedRepresentative.addressLine1 || '').trim(),
    addressLine2: (selectedRepresentative.addressLine2 || '').trim(),
    addressLine3: (selectedRepresentative.addressLine3 || '').trim(),
    city: (selectedRepresentative.city || '').trim(),
    stateCode: (selectedRepresentative.stateCode || '').trim(),
    zipCode: (selectedRepresentative.zipCode || '').trim(),
  };

  // Grab attorney/claimsAgent/representative for individuals, otherwise 'organization'
  const type =
    currentRepresentative.attributes?.individualType || 'organization';

  return (
    <div>
      <h3>Replace your current accredited representative</h3>
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
      <ContactCard
        repName={selectedRepresentative.fullName}
        orgName={selectedRepresentative.name}
        address={address}
        phone={selectedRepresentative.phone}
        email={selectedRepresentative.email}
      />
    </div>
  );
};

ReplaceAccreditedRepresentative.propTypes = {
  fetchRepresentatives: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(
  mapStateToProps,
  null,
)(ReplaceAccreditedRepresentative);
