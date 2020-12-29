import React, { Component } from 'react';
import { connect } from 'react-redux';
import head from 'lodash/head';
import moment from 'moment';
import PropTypes from 'prop-types';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { setData } from 'platform/forms-system/src/js/actions';
import classnames from 'classnames';

class DebtCard extends Component {
  onChange(debtTitle) {
    const alreadyIncluded = this.props?.fsrDebts?.includes(debtTitle);
    if (alreadyIncluded) {
      const fsrDebts = this.props?.fsrDebts?.filter(
        debtEntry => debtEntry !== debtTitle,
      );
      return this.props.setData({ ...this.props.formData, fsrDebts });
    } else {
      const newFsrDebts = this.props.fsrDebts.length
        ? [...this.props.fsrDebts, debtTitle]
        : [debtTitle];
      return this.props.setData({
        ...this.props.formData,
        fsrDebts: newFsrDebts,
      });
    }
  }

  render() {
    const { debt } = this.props;
    const mostRecentHistory = head(debt.debtHistory);
    const debtCardHeading =
      deductionCodes[debt.deductionCode] || debt.benefitType;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    const isChecked = this.props.fsrDebts.includes(debtCardHeading);
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
        <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
          <strong>Status: </strong>
          {debt.diaryCodeDescription}
        </p>

        <div className="vads-u-margin-top--2">
          <input
            id={debt.diaryCodeDescription}
            type="checkbox"
            className=" vads-u-width--auto"
            checked={isChecked}
            onChange={() => this.onChange(debtCardHeading)}
          />
          <label
            className={classnames({
              'usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary vads-u-margin-bottom--0 vads-u-width--auto vads-u-text-align--left vads-u-padding-x--2': true,
              'vads-u-color--white': !isChecked,
              'vads-u-background-color--white vads-u-color--primary': !isChecked,
            })}
            htmlFor={debt.diaryCodeDescription}
          >
            Request assistance for this debt
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

DebtCard.defaultProps = {
  debt: {
    currentAr: 0,
    debtHistory: [{ date: '' }],
    deductionCode: '',
    originalAr: 0,
  },
  fsrDebts: [],
};

const mapStateToProps = state => ({
  formData: state.form.data,
  fsrDebts: state.form.data.fsrDebts,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtCard);
