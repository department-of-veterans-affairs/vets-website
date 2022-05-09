import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';
import { ErrorAlert } from './Alerts';
import { fetchDebts } from '../actions';
import DebtCard from './DebtCard';

const NoDebts = () => (
  <div className="usa-alert background-color-only">
    <div className="vads-u-margin-bottom--1">
      <h4 className="vads-u-margin--0">You don’t have any VA debt</h4>
    </div>
    <p>
      Our records show you don’t have any debt related to VA benefits. If you
      think this is an error, please contact the Debt Management Center at
      <Telephone className="vads-u-margin-x--0p5" contact={CONTACTS.DMC} />
    </p>
  </div>
);

const AvailableDebts = ({ pendingDebts, debts, getDebts, isError }) => {
  useEffect(
    () => {
      getDebts();
    },
    [getDebts],
  );

  if (isError) return <ErrorAlert />;

  if (pendingDebts) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Loading your information..."
          set-focus
        />
      </div>
    );
  }

  return debts.length ? (
    <>
      <p>
        Select one or more debts below. We’ll help you choose a debt repayment
        or relief option for each.
      </p>
      <p className="vads-u-margin-bottom--3">
        You will be able to choose a repayment option for each debt you select.
      </p>
      {debts.map((debt, index) => (
        <DebtCard debt={debt} key={`${index}-${debt.currentAr}`} />
      ))}
      <h4>What if my debt isn’t listed here?</h4>
      <p className="vads-u-margin-top--2">
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at
        <Telephone contact="8008270648" className="vads-u-margin-x--0p5" /> (or
        <Telephone contact="16127136415" className="vads-u-margin-x--0p5" />
        from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m.
        ET.
      </p>
      <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        If you need help with a VA copay debt,
        <a
          href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/"
          className="vads-u-margin-x--0p5"
        >
          learn how to request financial hardship assistance.
        </a>
      </p>
    </>
  ) : (
    <NoDebts />
  );
};

AvailableDebts.propTypes = {
  debts: PropTypes.array,
  getDebts: PropTypes.func,
  isError: PropTypes.bool,
  pendingDebts: PropTypes.bool,
};

const mapStateToProps = ({ fsr }) => ({
  debts: fsr.debts,
  pendingDebts: fsr.pendingDebts,
  isError: fsr.isError,
});

const mapDispatchToProps = {
  getDebts: fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvailableDebts);
