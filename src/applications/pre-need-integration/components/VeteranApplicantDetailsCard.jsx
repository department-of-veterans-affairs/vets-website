import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';

import { formatNumberForScreenReader } from 'platform/forms-system/src/js/utilities/ui/mask-string';

const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';
const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';

/**
 * Parse date string to Date object
 */
const parseDateToDateObj = (dateString, formatString) => {
  if (!dateString) return null;

  if (formatString === FORMAT_YMD_DATE_FNS) {
    return new Date(dateString);
  }

  return new Date(dateString);
};

/**
 * VeteranApplicantDetailsCard Component
 *
 * Displays veteran applicant details in a va-card component
 */
export const VeteranApplicantDetailsCard = ({
  title = 'Veteran Applicant Details',
  showHeader = true,
}) => {
  // Get form data from Redux store
  const formData = useSelector(state => state.form?.data || {});

  const { application = {} } = formData;
  const { claimant = {} } = application;

  // Extract claimant data
  const { name = {}, ssn = '', dateOfBirth = '' } = claimant;
  const { first = '', middle = '', last = '', suffix = '' } = name;

  // Format SSN for display (last 4 digits)
  const ssnLastFour = ssn ? ssn.slice(-4) : '';

  // Parse and format date of birth
  const dobDateObj = parseDateToDateObj(dateOfBirth, FORMAT_YMD_DATE_FNS);

  return (
    <div className="vads-u-display--flex">
      <va-card background>
        {showHeader && (
          <div slot="headline">
            <h3 className="vads-u-margin-top--0">{title}</h3>
          </div>
        )}

        <p>
          <strong
            className="name dd-privacy-hidden"
            data-dd-action-name="Veteran's name"
          >
            Name:{' '}
          </strong>
          {first || last ? (
            `${first || ''} ${middle || ''} ${last || ''}`.trim()
          ) : (
            <span data-testid="name-not-available">Not available</span>
          )}
          {suffix ? `, ${suffix}` : null}
        </p>

        <p>
          <strong>Last 4 digits of Social Security number: </strong>
          {ssnLastFour ? (
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {formatNumberForScreenReader(ssnLastFour)}
            </span>
          ) : (
            <span data-testid="ssn-not-available">Not available</span>
          )}
        </p>

        <p>
          <strong>Date of birth: </strong>
          {isValid(dobDateObj) ? (
            <span
              className="dob dd-privacy-mask"
              data-dd-action-name="Veteran's date of birth"
            >
              {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
            </span>
          ) : (
            <span data-testid="dob-not-available">Not available</span>
          )}
        </p>
      </va-card>
    </div>
  );
};

VeteranApplicantDetailsCard.propTypes = {
  title: PropTypes.string,
  showHeader: PropTypes.bool,
};

export default VeteranApplicantDetailsCard;
