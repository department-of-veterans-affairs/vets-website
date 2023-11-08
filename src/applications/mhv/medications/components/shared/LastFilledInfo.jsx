import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { dispStatusObj } from '../../util/constants';

const LastFilledInfo = rx => {
  const { dispStatus, orderedDate, dispensedDate, rxRfRecords } = rx;
  let nonVA = false;
  let showLastFilledDate = false;
  if (dispStatus === dispStatusObj.nonVA) {
    nonVA = true;
  } else if (dispensedDate && dispStatus !== dispStatusObj.transferred) {
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
          Last filled on{' '}
          {dateFormat(
            rxRfRecords?.[0]?.[1][0]?.dispensedDate || dispensedDate,
            'MMMM D, YYYY',
          )}
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
    dispStatus: PropTypes.string,
    dispensedDate: PropTypes.string,
    orderedDate: PropTypes.string,
    rxRfRecords: PropTypes.array,
  }),
};

export default LastFilledInfo;
