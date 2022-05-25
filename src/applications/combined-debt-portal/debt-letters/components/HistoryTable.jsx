import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { renderLetterHistory } from '../const/diary-codes';

const HistoryTable = ({ history }) => (
  <table className="vads-u-margin-y--4">
    <thead>
      <tr>
        <th className="vads-u-font-weight--bold" scope="col">
          Date
        </th>
        <th className="vads-u-font-weight--bold" scope="col">
          Letter
        </th>
      </tr>
    </thead>
    <tbody>
      {history.map((debt, index) => (
        <tr key={`${debt.date}-${index}`}>
          <td>{moment(debt.date, 'MM-DD-YYYY').format('MMMM D, YYYY')}</td>
          <td>
            <div className="vads-u-margin-top--0">
              {renderLetterHistory(debt.letterCode)}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
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
