import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { renderLetterHistory } from '../const/diary-codes';

const HistoryTable = ({ history }) => (
  <va-table class="vads-u-margin-y--4">
    <va-table-row slot="headers">
      <span>Date</span>
      <span>Letter</span>
    </va-table-row>
    {history.map((debt, index) => (
      <va-table-row key={`${debt.date}-${index}`}>
        <span className="vads-u-padding-top--5">
          {moment(debt.date, 'MM-DD-YYYY').format('MMMM D, YYYY')}
        </span>
        <span>{renderLetterHistory(debt.letterCode)}</span>
      </va-table-row>
    ))}
  </va-table>
);

HistoryTable.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      letterCode: PropTypes.string.isRequired,
    }),
  ),
};

export default HistoryTable;
