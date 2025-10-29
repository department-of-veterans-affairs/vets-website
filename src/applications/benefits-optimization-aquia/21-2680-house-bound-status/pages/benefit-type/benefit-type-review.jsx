import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for benefit type.
 * Displays the selected benefit type (SMC or SMP).
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const BenefitTypeReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.benefitType || {};

  const benefitTypeLabel = {
    smc: 'Special Monthly Compensation (SMC)',
    smp: 'Special Monthly Pension (SMP)',
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="benefitType"
    >
      <ReviewField
        label="Benefit type"
        value={
          benefitTypeLabel[sectionData.benefitType] || sectionData.benefitType
        }
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

BenefitTypeReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
