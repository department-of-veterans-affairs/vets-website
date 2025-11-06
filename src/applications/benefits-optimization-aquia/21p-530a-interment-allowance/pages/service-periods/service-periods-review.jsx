import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewDateField,
  ReviewField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for service periods.
 * Displays all service periods with branch, dates, and locations.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ServicePeriodsReviewPage = ({ data, editPage, title }) => {
  const servicePeriods = data?.servicePeriods || [];

  const formatBranch = value => {
    // Find matching branch label from constants
    const branchOption = constants.branchesServed.find(
      branch => branch.value === value,
    );
    return branchOption ? branchOption.label : value || '';
  };

  if (!servicePeriods.length) {
    return (
      <ReviewPageTemplate
        title={title}
        data={data}
        editPage={editPage}
        sectionName="servicePeriodsData"
      >
        <ReviewField label="Service periods" value="Not provided" />
      </ReviewPageTemplate>
    );
  }

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="servicePeriodsData"
      hideEditButton
    >
      {servicePeriods.map((period, index) => {
        const periodNumber = servicePeriods.length > 1 ? ` ${index + 1}` : '';

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className="vads-u-margin-top--2 vads-u-padding-top--2 vads-u-border-top--1px vads-u-border-color--gray-light"
                style={{ gridColumn: '1 / -1' }}
              />
            )}
            <ReviewField
              label={`Branch of service${periodNumber}`}
              value={formatBranch(period.branchOfService)}
              hideWhenEmpty
            />
            <ReviewDateField
              label="Service start date"
              value={period.dateFrom}
              hideWhenEmpty
            />
            <ReviewDateField
              label="Service end date"
              value={period.dateTo}
              hideWhenEmpty
            />
            <ReviewField
              label="Place of entry"
              value={period.placeOfEntry}
              hideWhenEmpty
            />
            <ReviewField
              label="Place of separation"
              value={period.placeOfSeparation}
              hideWhenEmpty
            />
            <ReviewField
              label="Grade, rank, or rating"
              value={period.rank}
              hideWhenEmpty
            />
          </React.Fragment>
        );
      })}
    </ReviewPageTemplate>
  );
};

ServicePeriodsReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
