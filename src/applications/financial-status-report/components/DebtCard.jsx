import React, { Component } from 'react';
import { connect } from 'react-redux';
import head from 'lodash/head';
import last from 'lodash/last';
import moment from 'moment';
import PropTypes from 'prop-types';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { setData } from 'platform/forms-system/src/js/actions';
import classnames from 'classnames';
import { renderAdditionalInfo } from '../../debt-letters/const/diary-codes';

class DebtCard extends Component {
  onChange(debt) {
    const alreadyIncluded = this.props.selectedDebts.some(
      currentDebt => currentDebt.id === debt.id,
    );

    if (alreadyIncluded) {
      const selectedDebts = this.props?.selectedDebts?.filter(
        debtEntry => debtEntry.id !== debt.id,
      );
      return this.props.setData({ ...this.props.formData, selectedDebts });
    } else {
      const newFsrDebts = this.props.selectedDebts.length
        ? [...this.props.selectedDebts, debt]
        : [debt];
      return this.props.setData({
        ...this.props.formData,
        selectedDebts: newFsrDebts,
      });
    }
  }

  render() {
    const { debt } = this.props;
    const debtIdentifier = `${debt.currentAr}-${debt.originalAr}-${
      debt.debtHistory.length
    }`;
    const mostRecentHistory = head(debt.debtHistory);
    const firstDebtLetter = last(debt.debtHistory);
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
    const isChecked = this.props.selectedDebts.some(
      currentDebt => currentDebt.id === debt.id,
    );
    return (
      <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2 debt-card">
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
            onChange={() => this.onChange(debt)}
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
  }
}
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
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtCard);
