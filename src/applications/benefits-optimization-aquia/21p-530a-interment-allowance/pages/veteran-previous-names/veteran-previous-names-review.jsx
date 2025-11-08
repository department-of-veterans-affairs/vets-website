import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for veteran previous names.
 * Displays all previous names the veteran served under.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranPreviousNamesReviewPage = ({ data, editPage, title }) => {
  const previousNames = data?.previousNames || [];

  if (!previousNames.length) {
    return (
      <ReviewPageTemplate
        title={title}
        data={data}
        editPage={editPage}
        sectionName="veteranPreviousNames"
      >
        <ReviewField label="Previous names" value="Not provided" />
      </ReviewPageTemplate>
    );
  }

  const formatName = name => {
    if (!name) return '';
    const parts = [name.first, name.middle, name.last, name.suffix].filter(
      Boolean,
    );
    return parts.join(' ');
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranPreviousNames"
      hideEditButton
    >
      {previousNames.map((name, index) => {
        const nameLabel =
          previousNames.length > 1
            ? `Previous name ${index + 1}`
            : 'Previous name';
        return (
          <ReviewField
            key={index}
            label={nameLabel}
            value={formatName(name)}
            hideWhenEmpty
          />
        );
      })}
    </ReviewPageTemplate>
  );
};

VeteranPreviousNamesReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
