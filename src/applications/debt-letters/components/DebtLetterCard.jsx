import React from 'react';
import last from 'lodash/last';
import moment from 'moment';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { deductionCodes } from '../const';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const DebtLetterCard = ({ debt }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const mostRecentHistory = last(debt.debtHistory);
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
      <h3 className="vads-u-margin--0">{debtCardHeading}</h3>
      {mostRecentHistory && (
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
          Received on {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
        </p>
      )}
      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Amount owed: </strong>
        {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
      </p>
      <AdditionalInfo triggerText="Why might I have this debt?">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aperiam
        culpa debitis deleniti earum explicabo fuga fugit libero magnam
        molestiae non, omnis porro qui, quod voluptatibus. Natus perspiciatis
        quibusdam recusandae?
      </AdditionalInfo>
    </div>
  );
};

DebtLetterCard.propTypes = {
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

DebtLetterCard.defaultProps = {
  debt: {
    currentAr: 0,
    debtHistory: [{ date: '' }],
    deductionCode: '',
    originalAr: 0,
  },
};

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters.selectedDebt,
});

export default connect(mapStateToProps)(DebtLetterCard);
