import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { dispStatusObj } from '../../util/constants';

const LastFilledInfo = rx => {
  const { dispStatus, orderedDate, dispensedDate } = rx;
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
        <p>Last filled on {dateFormat(dispensedDate, 'MMMM D, YYYY')}</p>
      )}
      {!nonVA &&
        !showLastFilledDate && (
          <p data-testid="active-not-filled-rx">
            You haven’t filled this prescription yet
          </p>
        )}
    </div>
  );
};

LastFilledInfo.propTypes = {
  rx: PropTypes.shape({
    dispStatus: PropTypes.string,
    dispensedDate: PropTypes.string,
    orderedDate: PropTypes.string,
  }),
};

export default LastFilledInfo;
