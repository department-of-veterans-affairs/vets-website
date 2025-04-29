import React from 'react';
import PropTypes from 'prop-types';

import AddressEmailPhone from './AddressEmailPhone';
import { getEntityAddressAsObject, parseRepType } from '../utilities/helpers';

const CurrentAccreditedRepresentative = ({ repType, repAttributes }) => {
  const addressData = getEntityAddressAsObject(repAttributes);
  const repName = repAttributes.name || repAttributes.fullName;
  const { email, phone } = repAttributes;
  const isOrgOrVSO = ['Organization', 'VSO Representative'].includes(repType);

  return (
    <va-card class="representative-result-card vads-u-padding--4 vads-u-background-color--gray-lightest vads-u-border--0">
      <div className="representative-result-card-content">
        <div className="representative-info-heading">
          <h3 className="vads-u-margin-y--0">
            Your current {parseRepType(repType).title}
          </h3>
          {repName && (
            <>
              <h4 className="vads-u-font-family--serif vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
                {repName}
              </h4>
              <p className="vads-u-margin-y--0">
                {parseRepType(repType).subTitle}
              </p>
            </>
          )}
        </div>
        {isOrgOrVSO && (
          <p data-testid="work-with-any-VSO-note">
            <strong>Note:</strong> You can work with any accredited VSO
            representative at this organization.
          </p>
        )}
        <AddressEmailPhone
          addressData={addressData}
          email={email}
          phone={phone}
        />
      </div>
    </va-card>
  );
};

CurrentAccreditedRepresentative.propTypes = {
  repAttributes: PropTypes.object,
  repType: PropTypes.string,
};

export default CurrentAccreditedRepresentative;
