import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewDateField,
  ReviewField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for veteran burial information.
 * Displays the deceased Veteran's burial information including dates and cemetery details.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranBurialInformationReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.veteranBurialInformation || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranBurialInformation"
    >
      <ReviewDateField
        label="Date of death"
        value={sectionData.dateOfDeath}
        hideWhenEmpty
      />
      <ReviewDateField
        label="Date of burial"
        value={sectionData.dateOfBurial}
        hideWhenEmpty
      />
      <ReviewField
        label="Cemetery name"
        value={sectionData.cemeteryName}
        hideWhenEmpty
      />
      <ReviewField
        label="Cemetery location"
        value={
          sectionData.cemeteryLocation
            ? `${sectionData.cemeteryLocation.city}, ${
                sectionData.cemeteryLocation.state
              }`
            : null
        }
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranBurialInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
