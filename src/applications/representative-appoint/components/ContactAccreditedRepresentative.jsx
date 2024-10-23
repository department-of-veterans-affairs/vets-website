import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddressEmailPhone from './AddressEmailPhone';
import { getEntityAddressAsObject } from '../utilities/helpers';

const ContactAccreditedRepresentative = props => {
  const rep = props?.formData?.['view:selectedRepresentative'];
  const repAttributes = rep?.attributes;
  const addressData = getEntityAddressAsObject(repAttributes);
  const email = repAttributes?.email;
  const phone = repAttributes?.phone;
  const isOrg = rep?.type === 'organization';

  const warningContent = () => {
    if (isOrg) {
      return (
        <p>
          You’ll need to contact the accredited representative you’ve selected
          to make sure they’re available to help you, and you’ll need to ask
          them which VSO to name on your form.
        </p>
      );
    }
    return (
      <p>
        You’ll need to contact the accredited representative you’ve selected to
        make sure they’re available to help you.
      </p>
    );
  };

  const subNameContent = () => {
    const accreditedOrganizations =
      repAttributes?.accreditedOrganizations?.data;

    if (isOrg) {
      return (
        <p>
          You can work with any accredited VSO representative at this
          organization.
        </p>
      );
    }

    if (accreditedOrganizations?.length === 0) {
      return <></>;
    }

    if (accreditedOrganizations?.length === 1) {
      return <p>{accreditedOrganizations[0]?.attributes?.name}</p>;
    }

    return (
      <div className="associated-organizations-info vads-u-margin-top--1p5">
        <va-additional-info
          trigger="Check Veterans Service Organizations"
          disable-border
          uswds
          class="appoint-additional-info"
        >
          <p>This VSO representative is accredited with these organizations:</p>
          <ul className="appoint-ul">
            {accreditedOrganizations?.map((org, index) => {
              return <li key={index}>{org.attributes.name}</li>;
            })}
          </ul>
        </va-additional-info>
      </div>
    );
  };

  return (
    <div>
      <div className="vads-u-display--flex vads-u-margin-bottom--4">
        <va-alert status="warning">
          <h2 slot="headline">Contact the accredited representative</h2>
          {warningContent()}
        </va-alert>
      </div>
      {repAttributes && (
        <va-card class="vads-u-padding-left--2 vads-u-padding-top--1">
          <div className="vads-u-margin-top--1p5 vads-u-display--flex">
            {!isOrg && <va-icon icon="account_circle" size="4" />}
            <div className="vads-u-margin-left--1">
              <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
                {repAttributes.fullName || repAttributes.name}
              </h3>
              {subNameContent()}
              <AddressEmailPhone
                addressData={addressData}
                email={email}
                phone={phone}
              />
            </div>
          </div>
        </va-card>
      )}
    </div>
  );
};

ContactAccreditedRepresentative.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(
  mapStateToProps,
  null,
)(ContactAccreditedRepresentative);
