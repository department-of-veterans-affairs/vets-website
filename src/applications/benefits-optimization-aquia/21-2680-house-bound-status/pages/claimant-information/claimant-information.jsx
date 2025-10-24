import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  claimantDOBSchema,
  claimantInformationPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantDob']);
};

/**
 * Claimant Information Page
 * Collects claimant's name and date of birth
 * @module pages/claimant-information
 */
export const ClaimantInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  const relationship =
    formDataToUse?.claimantRelationship?.claimantRelationship;

  /**
   * Get the appropriate label text based on relationship
   */
  const getNameLabel = () => {
    switch (relationship) {
      case 'veteran':
        return 'Your full name';
      case 'spouse':
        return "Your spouse's full name";
      case 'child':
        return "Your child's full name";
      case 'parent':
        return "Your parent's full name";
      default:
        return "Claimant's full name";
    }
  };

  /**
   * Get the appropriate description text based on relationship
   */
  const getDescription = () => {
    switch (relationship) {
      case 'veteran':
        return 'Enter your information.';
      case 'spouse':
        return "Enter your spouse's information.";
      case 'child':
        return "Enter your child's information.";
      case 'parent':
        return "Enter your parent's information.";
      default:
        return 'Enter your information as the person filing on behalf of the Veteran.';
    }
  };

  return (
    <PageTemplate
      title="Claimant information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantInformationPageSchema}
      sectionName="claimantInformation"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantFullName: {
          first: '',
          middle: '',
          last: '',
        },
        claimantDob: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>{getDescription()}</p>

          <FullnameField
            fieldPrefix="claimant"
            value={localData.claimantFullName}
            onChange={handleFieldChange}
            errors={errors.claimantFullName || {}}
            forceShowError={formSubmitted}
            required
            label={getNameLabel()}
            showSuffix={false}
          />

          <MemorableDateField
            label="Date of birth"
            name="claimantDob"
            value={localData.claimantDob || ''}
            onChange={handleFieldChange}
            error={errors.claimantDob}
            forceShowError={formSubmitted}
            required
            schema={claimantDOBSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

ClaimantInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
