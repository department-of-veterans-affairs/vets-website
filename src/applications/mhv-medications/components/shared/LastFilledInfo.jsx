import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { dateFormat, rxSourceIsNonVA } from '../../util/helpers';
import { DATETIME_FORMATS } from '../../util/constants';
import { selectCernerPilotFlag } from '../../util/selectors';

const LastFilledInfo = rx => {
  const { orderedDate, sortedDispensedDate } = rx;
  const isCernerPilot = useSelector(selectCernerPilotFlag);

  const nonVA = rxSourceIsNonVA(rx);
  const showLastFilledDate = !nonVA && !!sortedDispensedDate;

  return (
    <>
      {nonVA && (
        <p data-testid="rx-last-filled-info" data-dd-privacy="mask">
          {dateFormat(
            orderedDate,
            DATETIME_FORMATS.longMonthDate,
            'Documented on: Date not available',
            'Documented on ',
          )}
        </p>
      )}
      {showLastFilledDate && (
        <p data-testid="rx-last-filled-date" data-dd-privacy="mask">
          {dateFormat(
            sortedDispensedDate,
            DATETIME_FORMATS.longMonthDate,
            'Last filled date not available',
            'Last filled on ',
          )}
        </p>
      )}
      {!nonVA &&
        !showLastFilledDate &&
        !isCernerPilot && (
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
