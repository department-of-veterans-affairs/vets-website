import React from 'react';
import PropTypes from 'prop-types';
import reverse from 'lodash/reverse';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

const DebtDetails = ({ selectedDebt }) => (
  <div className="vads-u-display--flex vads-u-flex-direction--column">
    <Breadcrumbs>
      <a href="/">Home</a>
      <a href="/debt-letters">Debt Letters</a>
      <a href="/debt-letters/debt-list">Debt List</a>
      <a href="/view-details">Debt Details</a>
    </Breadcrumbs>
    {reverse(selectedDebt.debtHistory).map((debtEntry, index) => (
      <div
        className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
        key={`${debtEntry.letterCode}-${index}`}
      >
        <span>{debtEntry.date}</span>
        <span>{debtEntry.status}</span>
        <span>{debtEntry.description}</span>
      </div>
    ))}
  </div>
);

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters?.selectedDebt,
});

DebtDetails.propTypes = {
  selectedDebt: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DebtDetails);
