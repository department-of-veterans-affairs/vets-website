import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchDebts } from '../actions';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const BenefitCard = ({ received, total, title }) => {
  return (
    <div className="usa-alert background-color-only">
      <div className="vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">{title}</h4>
      </div>
      <div className="vads-u-margin-bottom--1">
        <strong>Total amount: </strong>
        {formatter.format(parseFloat(total))}
      </div>
      <div className="vads-u-margin-bottom--1">
        <strong>Amount received last month: </strong>
        {formatter.format(parseFloat(received))}
      </div>
    </div>
  );
};

const NoBenefits = () => {
  return (
    <div className="usa-alert background-color-only">
      <div className="vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">
          Our records show you don't get any monthly benefit payments
        </h4>
      </div>
      <p>
        If this information isn’t right, call our VA benefits hotline at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />) ,
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

const Benefits = ({ pending, income, debts, getDebts }) => {
  useEffect(
    () => {
      getDebts();
    },
    [getDebts],
  );

  const eduDebtsTotal = debts
    .filter(debt => debt.deductionCode !== '30')
    .reduce((a, b) => a + Number(b.currentAr), 0);

  const compDebtsTotal = debts
    .filter(debt => debt.deductionCode === '30')
    .reduce((a, b) => a + Number(b.currentAr), 0);

  const eduReceived = income.reduce((a, b) => a + Number(b.education), 0);
  const compReceived = income.reduce(
    (a, b) => a + Number(b.compensationAndPension),
    0,
  );

  return !pending && income.length ? (
    <>
      <p>This is the VA benefit information we have on file for you.</p>
      <BenefitCard
        total={compDebtsTotal}
        received={compReceived}
        title={'Disability compensation and pension benefits'}
      />
      <BenefitCard
        total={eduDebtsTotal}
        received={eduReceived}
        title={'Education benefits'}
      />
      <p>
        <strong>Note:</strong> If this information isn’t right, call our VA
        benefits hotline at <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />) ,
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  ) : (
    <NoBenefits />
  );
};

Benefits.propTypes = {
  income: PropTypes.array,
  debts: PropTypes.array,
};

const mapStateToProps = ({ form, fsr }) => ({
  income: form.data.income,
  pending: fsr.pending,
  debts: fsr.debts,
});

const mapDispatchToProps = {
  getDebts: fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Benefits);
