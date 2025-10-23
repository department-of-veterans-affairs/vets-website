import React from 'react';
import PropTypes from 'prop-types';
import { renderLetterHistory } from '../const/diary-codes';
import { formatDate } from '../../combined/utils/helpers';

const HistoryTable = ({ history }) => {
  return (
    <va-table
      table-title="Find dates and summaries for the letters sent to your address on file below."
      uswds
      table-type="bordered"
    >
      <va-table-row slot="headers">
        <span>Date</span>
        <span>Letter</span>
      </va-table-row>
      {history.map((debt, index) => (
        <va-table-row key={`${debt.date}-${index}`}>
          <span className="vads-u-width--fit">{formatDate(debt.date)}</span>
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
