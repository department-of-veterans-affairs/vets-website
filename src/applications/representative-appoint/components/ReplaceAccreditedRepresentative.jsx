import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CurrentAccreditedRepresentative from './CurrentAccreditedRepresentative';
import ContactCard from './ContactCard';
import {
  getEntityAddressAsObject,
  getOrgName,
  getRepType,
} from '../utilities/helpers';

const ReplaceAccreditedRepresentative = props => {
  const { formData } = props;
  const currentRep = formData?.['view:representativeStatus'] || {};
  const selectedRepAttributes =
    formData?.['view:selectedRepresentative']?.attributes || {};
  const repName = selectedRepAttributes?.fullName;
  const orgName = getOrgName(formData);

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
        repType={getRepType(currentRep)}
        repAttributes={currentRep.attributes}
      />
      <h4 className="vads-u-margin-y--5">
        You’ve selected this new accredited representative:
      </h4>
      <ContactCard
        repName={repName}
        orgName={orgName}
        addressData={getEntityAddressAsObject(selectedRepAttributes)}
        phone={selectedRepAttributes?.phone}
        email={selectedRepAttributes?.email}
      />
    </div>
  );
};

ReplaceAccreditedRepresentative.propTypes = {
  formData: PropTypes.shape({
    'view:representativeStatus': PropTypes.object,
    'view:selectedRepresentative': PropTypes.object,
  }),
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export { ReplaceAccreditedRepresentative }; // Named export for testing

export default connect(
  mapStateToProps,
  null,
)(ReplaceAccreditedRepresentative);
