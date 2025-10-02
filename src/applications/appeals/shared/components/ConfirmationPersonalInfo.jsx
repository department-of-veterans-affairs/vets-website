import React from 'react';
import PropTypes from 'prop-types';
import { chapterHeaderClass } from './ConfirmationSummary';
import { ConfirmationVeteranID } from './ConfirmationVeteranID';
import { ConfirmationVeteranContact } from './ConfirmationVeteranContact';
import { convertBoolResponseToYesNo } from '../utils/form-data-display';

const ConfirmationPersonalInfo = data => {
  const {
    dob = '',
    homeless = null,
    hasHomeAndMobilePhone = false,
    livingSituation = null,
    userFullName = {},
    veteran = {},
  } = data;
  const { vaFileLastFour = '' } = veteran;

  return (
    <>
      <h3 className={chapterHeaderClass}>Personal information</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <ConfirmationVeteranID
          dob={dob}
          userFullName={userFullName}
          vaFileLastFour={vaFileLastFour}
        />
        {livingSituation || (
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              Are you experiencing homelessness?
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="homeless"
            >
              {convertBoolResponseToYesNo(homeless)}
            </div>
          </li>
        )}
        <ConfirmationVeteranContact
          veteran={veteran}
          hasHomeAndMobilePhone={hasHomeAndMobilePhone}
        />
      </ul>
    </>
  );
};

ConfirmationPersonalInfo.propTypes = {
  dob: PropTypes.string,
  hasHomeAndMobilePhone: PropTypes.bool,
  hasLivingSituationChapter: PropTypes.bool,
  homeless: PropTypes.bool,
  userFullName: PropTypes.shape({}),
  veteran: PropTypes.shape({
    vaFileLastFour: PropTypes.string,
    address: PropTypes.shape({}),
    email: PropTypes.string,
    phone: PropTypes.shape({}),
    homePhone: PropTypes.shape({}),
    mobilephone: PropTypes.shape({}),
  }),
};

export default ConfirmationPersonalInfo;
