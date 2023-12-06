import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { dispStatusObj } from '../../util/constants';

// we are expecting vets api to send 0000-01-01 when there is no dispensed date.
const DISPENSED_DATE_NOT_PROVIDED = '0000-01-01';

const LastFilledInfo = rx => {
  const { dispStatus, orderedDate, sortedDispensedDate } = rx;
  let nonVA = false;
  let showLastFilledDate = false;
  if (dispStatus === dispStatusObj.nonVA) {
    nonVA = true;
  } else if (String(sortedDispensedDate) !== DISPENSED_DATE_NOT_PROVIDED) {
    showLastFilledDate = true;
  }
  return (
    <div>
      {nonVA &&
        orderedDate && (
          <p data-testid="rx-last-filled-info">
            Documented on {dateFormat(orderedDate, 'MMMM D, YYYY')}
          </p>
        )}
      {showLastFilledDate && (
        <p data-testid="rx-last-filled-date">
          Last filled on {dateFormat(sortedDispensedDate, 'MMMM D, YYYY')}
        </p>
      )}
      {!nonVA &&
        !showLastFilledDate && (
          <p data-testid="active-not-filled-rx">Not filled yet</p>
        )}
    </div>
  );
};

LastFilledInfo.propTypes = {
  rx: PropTypes.shape({
    sortedDispensedDate: PropTypes.string,
    dispStatus: PropTypes.string,
    orderedDate: PropTypes.string,
  }),
};

export default LastFilledInfo;
