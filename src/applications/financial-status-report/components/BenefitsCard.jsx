import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const BenefitsCard = () => {
  return (
    <>
      <div className="usa-alert background-color-only">
        <div className="vads-u-margin-bottom--1">
          <h4 className="vads-u-margin--0">
            Disability compensation and pension benefits
          </h4>
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Total amount: </strong>
          $2,100.00
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Amount received last month: </strong>
          $1,800.00
        </div>
      </div>
      <div className="usa-alert background-color-only">
        <div className="vads-u-margin-bottom--1">
          <h4 className="vads-u-margin--0">Education benefits</h4>
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Total amount: </strong>
          $1,100.00
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Amount received last month: </strong>
          $1,100.00
        </div>
      </div>
      <p className="vads-u-margin-right--4 vads-u-padding-right--4">
        <strong>Note:</strong> If this information isn’t right, call our VA
        benefits hotline at <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />) ,
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

BenefitsCard.propTypes = {
  benefits: PropTypes.object,
};

const mapStateToProps = ({ form }) => ({
  benefits: form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(BenefitsCard);
