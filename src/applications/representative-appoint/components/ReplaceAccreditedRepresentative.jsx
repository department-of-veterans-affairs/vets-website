import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CurrentAccreditedRepresentative from './CurrentAccreditedRepresentative';
import ContactCard from './ContactCard';
import { getEntityAddressAsObject } from '../utilities/helpers';

const ReplaceAccreditedRepresentative = props => {
  const { formData } = props;
  const currentRep = formData?.['view:representativeStatus']?.attributes || {};
  const selectedRep = formData?.['view:selectedRep']?.attributes || {};
  const addressData = getEntityAddressAsObject(selectedRep);

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
      <CurrentAccreditedRepresentative rep={currentRep} />
      <h4 className="vads-u-margin-y--5">
        You’ve selected this new accredited representative:
      </h4>
      <ContactCard
        repName={selectedRep.fullName}
        orgName={selectedRep.name}
        addressData={addressData}
        phone={selectedRep.phone}
        email={selectedRep.email}
      />
    </div>
  );
};

ReplaceAccreditedRepresentative.propTypes = {
  formData: PropTypes.shape({
    'view:representativeStatus': PropTypes.object,
    'view:selectedRep': PropTypes.object,
  }),
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(
  mapStateToProps,
  null,
)(ReplaceAccreditedRepresentative);
