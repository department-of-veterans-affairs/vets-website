import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { dispStatusObj } from '../../util/constants';

const LastFilledInfo = rx => {
  const { dispStatus, orderedDate, sortedDispensedDate } = rx;
  let nonVA = false;
  let showLastFilledDate = false;
  if (dispStatus === dispStatusObj.nonVA) {
    nonVA = true;
  } else if (sortedDispensedDate) {
    showLastFilledDate = true;
  }
  return (
    <>
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
    </>
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
