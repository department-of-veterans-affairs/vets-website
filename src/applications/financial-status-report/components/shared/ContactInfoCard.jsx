import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { COUNTRY_LABELS, COUNTRY_VALUES } from '../../constants';

const ContactInfoCard = ({
  street,
  street2,
  city,
  state,
  postalCode,
  country,
  edit,
}) => {
  const countryLabel = COUNTRY_LABELS[COUNTRY_VALUES.indexOf(country)];
  const buttonText = 'Edit mailing address';

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-margin-bottom--5">
      <h4 className="vads-u-margin--0 vads-u-margin-bottom--2">
        Mailing address
      </h4>
      <div className="vads-u-padding-left--1 vads-u-border-left--7px vads-u-border-color--primary">
        <p className="vads-u-margin--1px">{street}</p>
        <p className="vads-u-margin--1px">{street2}</p>
        <p className="vads-u-margin--1px">
          {city}, {state} {postalCode}
        </p>
        <p className="vads-u-margin--1px">{countryLabel}</p>
      </div>
      <va-button text={buttonText} onClick={() => edit()} />
    </div>
  );
};

ContactInfoCard.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  edit: PropTypes.func,
  postalCode: PropTypes.string,
  state: PropTypes.string,
  street: PropTypes.string,
  street2: PropTypes.string,
};

const mapStateToProps = ({ form }) => ({
  street: form.data.personalData.address?.street,
  street2: form.data.personalData.address?.street2,
  city: form.data.personalData.address?.city,
  state: form.data.personalData.address?.state,
  postalCode: form.data.personalData.address?.postalCode,
  country: form.data.personalData.address?.country,
});

export default connect(
  mapStateToProps,
  null,
)(ContactInfoCard);
