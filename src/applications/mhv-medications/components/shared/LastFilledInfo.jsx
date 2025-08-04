import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const LastFilledInfo = rx => {
  const { orderedDate, sortedDispensedDate, prescriptionSource } = rx;

  const nonVA = prescriptionSource === 'NV';
  const showLastFilledDate = !nonVA && !!sortedDispensedDate;

  return (
    <>
      {nonVA && (
        <p data-testid="rx-last-filled-info" data-dd-privacy="mask">
          {dateFormat(
            orderedDate,
            'MMMM D, YYYY',
            'Documented on: Date not available',
            'Documented on ',
          )}
        </p>
      )}
      {showLastFilledDate && (
        <p data-testid="rx-last-filled-date" data-dd-privacy="mask">
          {dateFormat(
            sortedDispensedDate,
            'MMMM D, YYYY',
            'Last filled date not available',
            'Last filled on ',
          )}
        </p>
      )}
      {!nonVA &&
        !showLastFilledDate && (
          <p data-testid="active-not-filled-rx" data-dd-privacy="mask">
            Not filled yet
          </p>
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
