import React from 'react';
import PropTypes from 'prop-types';
import { renderFullName, maskVafn } from '../utils/data';
import { getReadableDate } from '../utils/dates';

export const ConfirmationVeteranID = ({
  dob,
  userFullName = {},
  vaFileLastFour,
}) => (
  <>
    <li>
      <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
        Name
      </div>
      {renderFullName(userFullName)}
    </li>
    {vaFileLastFour && (
      <li>
        <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
          VA File Number
        </div>
        <div
          className="vads-u-margin-bottom--2 dd-privacy-hidden"
          data-dd-action-name="VA file number"
        >
          {maskVafn(vaFileLastFour || '')}
        </div>
      </li>
    )}
    <li>
      <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
        Date of birth
      </div>
      <div
        className="vads-u-margin-bottom--2 dd-privacy-hidden"
        data-dd-action-name="date of birth"
      >
        {getReadableDate(dob)}
      </div>
    </li>
  </>
);

ConfirmationVeteranID.propTypes = {
  dob: PropTypes.string,
  userFullName: PropTypes.shape({}),
  vaFileLastFour: PropTypes.string,
};
