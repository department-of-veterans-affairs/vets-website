import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { setData } from 'platform/forms-system/src/js/actions';
import { genderLabels } from 'platform/static-data/labels';
import { selectProfile } from 'platform/user/selectors';

import { srSubstitute } from '../../all-claims/utils';
import { SELECTED } from '../constants';

const mask = srSubstitute('●●●–●●–', 'ending with');

const VeteranInformation = ({
  formData = {},
  profile = {},
  veteran = {},
  setFormData,
  contestableIssues = {},
}) => {
  const { ssnLastFour, vaFileLastFour } = veteran;
  const { dob, gender, userFullName, vapContactInfo } = profile;

  const { first, middle, last, suffix } = userFullName;
  // ContestableIssues API needs a benefit type, so they are grouped together
  const { issues, benefitType } = contestableIssues;
  const zipCode5 = vapContactInfo?.mailingAddress?.zipCode || '';

  useEffect(
    () => {
      if (issues?.length > 0 && benefitType) {
        // Everytime the user starts the form, we need to get an updated list of
        // contestable issues. This bit of code ensures that exactly matching
        // previously selected entries are still selected
        const contestedIssues = issues.map(issue => {
          const newAttrs = issue.attributes;
          const existingIssue = (formData.contestedIssues || []).find(
            ({ attributes: oldAttrs }) =>
              ['ratingIssueReferenceId', 'ratingIssuePercentNumber'].every(
                key => oldAttrs?.[key] === newAttrs?.[key],
              ),
          );
          return existingIssue?.[SELECTED]
            ? { ...issue, [SELECTED]: true }
            : issue;
        });

        const hasUnchangedContestedIssues = (
          formData.contestedIssues || []
        ).every(
          (issue, index) =>
            contestedIssues[index]?.ratingIssueReferenceId ===
            issue?.ratingIssueReferenceId,
        );

        if (
          benefitType !== formData?.benefitType ||
          !hasUnchangedContestedIssues ||
          zipCode5 !== formData?.zipCode5
        ) {
          setFormData({
            ...formData,
            // Add benefitType from wizard
            benefitType: benefitType || formData.benefitType,
            // Add contestedIssues (from API) values to the form; it's added
            // here instead of the intro page because at that point the prefill
            // or save-in-progress data would overwrite it
            contestedIssues,
            // used in submit transformer; needed by Lighthouse
            zipCode5,
          });
        }
      }
    },
    [issues, benefitType, setFormData, formData, zipCode5],
  );

  return (
    <>
      <p>This is the personal information we have on file for you.</p>
      <br />
      <div className="blue-bar-block">
        <strong className="name">
          {`${first || ''} ${middle || ''} ${last || ''}`}
          {suffix && `, ${suffix}`}
        </strong>
        {ssnLastFour && (
          <p className="ssn">
            Social Security number: {mask} {ssnLastFour.slice(-4)}
          </p>
        )}
        {vaFileLastFour && (
          <p className="vafn">
            VA file number: {mask} {vaFileLastFour.slice(-4)}
          </p>
        )}
        <p>
          Date of birth:{' '}
          <span className="dob">{dob ? moment(dob).format('LL') : ''}</span>
        </p>
        <p>
          Gender:{' '}
          <span className="gender">
            {(gender && genderLabels[gender]) || ''}
          </span>
        </p>
      </div>
      <br />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance toll free at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

VeteranInformation.propTypes = {
  setFormData: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const veteran = state.form?.data.veteran;
  const { contestableIssues } = state;
  return {
    profile,
    veteran,
    contestableIssues,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export { VeteranInformation };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranInformation);
