import React from 'react';
import { connect } from 'react-redux';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import head from 'lodash/head';
import tail from 'lodash/tail';
import { renderAdditionalInfo } from '../../debt-letters/const/diary-codes';
import moment from 'moment';

const DebtRepayment = ({ formData: { selectedDebts } }) => {
  let index = Number(window.location.href.slice(-1));
  const debt = selectedDebts[index];
  const mostRecentHistory = head(debt.debtHistory);
  const firstNotice = tail(debt.debtHistory);
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const additionalInfo = renderAdditionalInfo(
    debt.diaryCode,
    mostRecentHistory.date,
    debt.benefitType,
  );
  return (
    <>
      <h4>
        Debt repayment or relief options ({++index} of {selectedDebts.length})
      </h4>
      <div className="usa-alert background-color-only vads-u-margin-bottom--5">
        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
            {debtCardHeading}
          </h4>
          <span>
            Updated on {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
          </span>
        </div>
        <div>
          <strong>Amount owed: </strong>
          {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
        </div>
        <div className="vads-u-margin-bottom--1">{additionalInfo.status}</div>
        <div className="vads-u-margin-top--2 vads-u-margin-bottom--1">
          <strong>Date of first notice: </strong>
          {moment(firstNotice.date).format('MMMM D, YYYY')}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(DebtRepayment);
