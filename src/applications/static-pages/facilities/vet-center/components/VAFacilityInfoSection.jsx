import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityAddress from './VAFacilityAddress';

const VAPhoneSection = props => {
  const { type, phoneNumber } = props;
  if (!phoneNumber) return null;
  return (
    <>
      <div className="main-phone">
        <span>
          <strong>{type}: </strong>
        </span>
        <va-telephone contact={phoneNumber} />
      </div>
    </>
  );
};
VAPhoneSection.propTypes = {
  phoneNumber: PropTypes.string,
  type: PropTypes.string,
};

const VAFacilityTitle = props => {
  const { title, website } = props;
  if (!title) return null;

  const titleComponent = (
    <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
      {title}
    </h3>
  );
  return website ? <a href={website}>{titleComponent}</a> : titleComponent;
};

VAFacilityTitle.propTypes = {
  title: PropTypes.string,
  website: PropTypes.string,
};

function VAFacilityInfoSection(props) {
  return (
    <>
      <VAFacilityTitle
        title={props.vaFacility.title}
        website={props.vaFacility.website}
      />
      <VAFacilityAddress vaFacility={props.vaFacility} />
      <VAPhoneSection
        type="Main number"
        phoneNumber={
          props.vaFacility.entityBundle === 'vet_center_cap'
            ? props.mainPhone
            : props.vaFacility.fieldPhoneNumber
        }
      />
      <VAPhoneSection
        type="Mental health"
        phoneNumber={props.vaFacility.fieldPhoneMentalHealth}
      />
    </>
  );
}

VAFacilityInfoSection.propTypes = {
  mainPhone: PropTypes.string,
  vaFacility: PropTypes.object,
};

export default VAFacilityInfoSection;
