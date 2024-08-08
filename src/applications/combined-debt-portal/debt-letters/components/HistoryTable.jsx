import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { renderLetterHistory } from '../const/diary-codes';

const HistoryTable = ({ history }) => {
  return (
    <va-table table-title="Debt letter history" uswds table-type="bordered">
      <va-table-row slot="headers">
        <span>Date</span>
        <span>Letter</span>
      </va-table-row>
      {history.map((debt, index) => (
        <va-table-row key={`${debt.date}-${index}`}>
          <span className="vads-u-width--fit">
            {moment(debt.date, 'MM-DD-YYYY').format('MMMM D, YYYY')}
          </span>
          <span>
            <div className="vads-u-margin-top--0">
              {renderLetterHistory(debt.letterCode)}
            </div>
          </span>
        </va-table-row>
      ))}
    </va-table>
  );
};

HistoryTable.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      letterCode: PropTypes.string.isRequired,
    }),
  ),
};

export default HistoryTable;
