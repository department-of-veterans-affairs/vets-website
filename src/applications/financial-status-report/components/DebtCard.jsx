import React from 'react';
import { connect } from 'react-redux';
import head from 'lodash/head';
import last from 'lodash/last';
import moment from 'moment';
import PropTypes from 'prop-types';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { setData } from 'platform/forms-system/src/js/actions';
import classnames from 'classnames';
import { renderAdditionalInfo } from '../../debt-letters/const/diary-codes';

const DebtCard = ({ debt, selectedDebts, formData, setDebts }) => {
  const mostRecentHistory = head(debt.debtHistory);
  const firstDebtLetter = last(debt.debtHistory);
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  const debtIdentifier = `${debt.currentAr}-${debt.originalAr}-${
    debt.debtHistory.length
  }`;
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

  const isChecked = selectedDebts.some(
    currentDebt => currentDebt.id === debt.id,
  );

  const onChange = selectedDebt => {
    const alreadyIncluded = selectedDebts.some(
      currentDebt => currentDebt.id === selectedDebt.id,
    );

    if (alreadyIncluded) {
      const checked = selectedDebts?.filter(
        debtEntry => debtEntry.id !== selectedDebt.id,
      );
      return setDebts({ ...formData, selectedDebts: checked });
    } else {
      const newFsrDebts = selectedDebts.length
        ? [...selectedDebts, selectedDebt]
        : [selectedDebt];
      return setDebts({
        ...formData,
        selectedDebts: newFsrDebts,
      });
    }
  };

  const container = classnames(
    'vads-u-background-color--gray-lightest vads-u-margin-bottom--3 debt-card',
    {
      'selected-debt': isChecked,
    },
  );

  return (
    <div className={container}>
      <h3 className="vads-u-font-size--h4 vads-u-margin--0">
        {debtCardHeading}
      </h3>
      {mostRecentHistory && (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          Updated on {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
        </p>
      )}
      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Amount owed: </strong>
        {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
      </p>
      <div className="vads-u-margin-y--2">{additionalInfo.status}</div>

      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Date of first notice: </strong>
        {moment(firstDebtLetter.date).format('MMMM D, YYYY')}
      </p>

      <div className="vads-u-margin-top--2">
        <input
          id={debtIdentifier}
          type="checkbox"
          className=" vads-u-width--auto"
          checked={isChecked}
          onChange={() => onChange(debt)}
        />
        <label
          className={classnames({
            'usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary vads-u-margin-bottom--0 vads-u-width--auto vads-u-text-align--left vads-u-padding-x--2': true,
            'vads-u-color--white': !isChecked,
            'vads-u-background-color--white vads-u-color--primary': !isChecked,
          })}
          htmlFor={debtIdentifier}
        >
          Request help with this debt
        </label>
      </div>
    </div>
  );
};

DebtCard.propTypes = {
  debt: PropTypes.shape({
    currentAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    originalAr: PropTypes.number,
  }),
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
  selectedDebts: form.data.selectedDebts,
});

const mapDispatchToProps = {
  setDebts: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtCard);
