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

const Benefits = ({ income, getDebts }) => {
  useEffect(() => {
    getDebts();
  }, []);

  // const currentDebt = debts.reduce((a, b) => a + Number(b.currentAr), 0);
  // console.log('currentDebt: ', currentDebt);

  // console.log('debts: ', debts);

  // const eduDebts = debts.filter(item => {
  //   return item.deductionCode === '30';
  // });

  // console.log('eduDebts: ', eduDebts);

  // const compDebts = debts.filter(item => {
  //   return item.deductionCode !== '30';
  // });

  // console.log('compDebts: ', compDebts);

  const comp = income.reduce((a, b) => a + Number(b.compensationAndPension), 0);
  const edu = income.reduce((a, b) => a + Number(b.education), 0);

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
          {income &&
            formatter.format(parseFloat(income[0].compensationAndPension))}
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Amount received last month: </strong>
          {income && formatter.format(parseFloat(comp))}
        </div>
      </div>

      <div className="usa-alert background-color-only">
        <div className="vads-u-margin-bottom--1">
          <h4 className="vads-u-margin--0">Education benefits</h4>
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Total amount: </strong>
          {income &&
            formatter.format(parseFloat(income[1].compensationAndPension))}
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Amount received last month: </strong>
          {income && formatter.format(parseFloat(edu))}
        </div>
      </div>

      <p>
        <strong>Note:</strong> If this information isn’t right, call our VA
        benefits hotline at <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />) ,
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

Benefits.propTypes = {
  income: PropTypes.array,
};

const mapStateToProps = ({ form, fsr }) => ({
  income: form.data.income,
  debts: fsr.debts,
});

const mapDispatchToProps = {
  getDebts: fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Benefits);
