import React from 'react';
import PropTypes from 'prop-types';

const SecondaryCaregiverDescription = ({
  additionalInfo,
  formContext,
  introText,
  pageTitle,
  showContactIntro,
  showPageIntro,
}) => {
  const formData = formContext?.formData || {};
  const { veteranFullName: name, veteranAddress: address } = formData;

  return (
    <>
      {!!pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}

      {showPageIntro && (
        <p className="vads-u-margin-top--2" data-testid="cg-page-intro">
          {introText}
        </p>
      )}

      {showContactIntro && (
        <>
          <p className="vads-u-margin-top--2" data-testid="cg-contact-intro">
            {introText}
          </p>
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
        <va-additional-info
          trigger="Learn more about who qualifies as a Secondary Family Caregiver"
          class="vads-u-margin-y--1p5"
          uswds
        >
          <p className="vads-u-margin-top--0">
            Family caregivers are approved and designated by VA as Primary
            Family Caregivers and Secondary Family Caregivers to provide
            personal care services. A Secondary Family Caregiver generally
            serves as a backup to the Primary Family Caregiver.
          </p>

          <p>They can be the Veteran’s:</p>

          <ul className="vads-u-margin-bottom--0">
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
      )}
    </>
  );
};

SecondaryCaregiverDescription.propTypes = {
  additionalInfo: PropTypes.bool,
  formContext: PropTypes.object,
  introText: PropTypes.string,
  pageTitle: PropTypes.string,
  showContactIntro: PropTypes.bool,
  showPageIntro: PropTypes.bool,
};

SecondaryCaregiverDescription.defaultProps = {
  additionalInfo: false,
  showContactIntro: false,
  showPageIntro: false,
};

export default SecondaryCaregiverDescription;
