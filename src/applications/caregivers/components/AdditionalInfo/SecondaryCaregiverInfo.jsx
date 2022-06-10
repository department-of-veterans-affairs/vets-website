import React from 'react';
import PropTypes from 'prop-types';

export const SecondaryCaregiverInfo = ({
  additionalInfo,
  formContext,
  introText,
  pageTitle,
  showContactIntro,
  showPageIntro,
}) => {
  const formData = formContext?.formData || {};
  const { veteranFullName: name, veteranAddress: address } = formData;
  const canAutofillAddress = formData['view:canAutofill1010cgAddress'];

  return (
    <>
      {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}

      {showPageIntro && <p className="vads-u-margin-top--2">{introText}</p>}

      {showContactIntro &&
        canAutofillAddress && (
          <>
            <p className="vads-u-margin-top--2">{introText}</p>
            <p className="vads-u-font-size--h4 vads-u-margin-bottom--1">
              <strong>Veteran address</strong>
            </p>
            <p className="va-address-block vads-u-margin-left--0">
              {name.first} {name.middle} {name.last}
              <br />
              {address.street} {address.street2}
              <br />
              {address.city}, {address.state} {address.postalCode}
            </p>
          </>
        )}

      {additionalInfo && (
        <section className="vads-u-margin-y--1p5">
          <va-additional-info trigger="Learn more about who qualifies as a Secondary Family Caregiver">
            <p>
              Family caregivers are approved and designated by VA as Primary
              Family Caregivers and Secondary Family Caregivers to provide
              personal care services. A Secondary Family Caregiver generally
              serves as a backup to the Primary Family Caregiver.
            </p>

            <p>They can be the Veteran’s:</p>

            <ul>
              <li>Parent</li>
              <li>Spouse</li>
              <li>Son or daughter</li>
              <li>Stepfamily member</li>
              <li>Grandchild</li>
              <li>Significant other</li>
              <li>Friend or neighbor</li>
              <li>Other relative</li>
            </ul>
          </va-additional-info>
        </section>
      )}
    </>
  );
};

SecondaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
  formContext: PropTypes.object,
  introText: PropTypes.string,
  pageTitle: PropTypes.string,
  showContactIntro: PropTypes.bool,
  showPageIntro: PropTypes.bool,
};

SecondaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
  showContactIntro: false,
  showPageIntro: false,
};
