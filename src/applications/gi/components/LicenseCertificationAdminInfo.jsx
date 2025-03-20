import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../utils/helpers';

function LicenseCertificationAdminInfo({ institution, type }) {
  const { name, mailingAddress } = institution;

  return (
    <div>
      <h3 className="vads-u-margin-y--1p5">Admin info</h3>
      <div className="name-wrapper vads-u-display--flex vads-u-align-items--center">
        <va-icon
          class="vads-u-padding-right--1"
          icon="location_city"
          size={3}
        />
        <p className="vads-u-margin-y--1">{capitalizeFirstLetter(name)}</p>
      </div>
      {type === 'Certification' ? (
        <p className="vads-u-margin-bottom--0">
          Certification tests are available nationally. Search for a testing
          site using your preferred search engine.
        </p>
      ) : (
        <>
          <p className="vads-u-margin-y--p5">
            The following is the headquarters address.
          </p>

          <p className="va-address-block vads-u-margin-y--0">
            {capitalizeFirstLetter(mailingAddress.address1)}
            <br />
            {capitalizeFirstLetter(mailingAddress.city)}, {mailingAddress.state}{' '}
            {mailingAddress.zip}
            <br />
          </p>
        </>
      )}
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        {type !== 'Prep Course' ? (
          <>
            <p className="vads-u-margin-bottom--0 usa-width-two-thirds">
              Print and fill out form Request for Reimbursement of Licensing or
              Certification Test Fees after you've taken the test. Send the
              completed application to the Regional Processing Office for your
              region listed in the form.
            </p>
            <p className="vads-u-margin-y--p5">
              <va-link
                text="Get VA Form22-0803 to download"
                href="https://www.va.gov/find-forms/about-form-22-0803/"
              />
            </p>
          </>
        ) : (
          <>
            <p className="vads-u-margin-bottom--0 usa-width-two-thirds">
              Print and fill out form Request for Reimbursement of Preparatory
              (Prep) Course for Licensing or Certification Test after you've
              taken the test. Send the completed application to the Regional
              Processing Office for your region listed in the form.
            </p>
            <p className="vads-u-margin-y--p5">
              <va-link
                text="Get VA Form 22-10272 to download."
                href="https://www.va.gov/find-forms/about-form-22-10272/"
              />
            </p>
          </>
        )}
      </div>
    </div>
  );
}

LicenseCertificationAdminInfo.propTypes = {
  institution: PropTypes.shape({
    name: PropTypes.string.isRequired,
    mailingAddress: PropTypes.shape({
      address1: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['License', 'Certification', 'Prep Course']).isRequired,
};

export default LicenseCertificationAdminInfo;
