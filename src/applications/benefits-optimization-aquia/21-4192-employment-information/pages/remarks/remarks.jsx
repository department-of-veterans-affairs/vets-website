import PropTypes from 'prop-types';
import React from 'react';

import { TextareaField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { remarksFieldSchema, remarksSchema } from '../../schemas';

/**
 * Remarks page component
 * This page collects additional remarks or comments
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Remarks form page
 */
export const RemarksPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  return (
    <PageTemplate
      title="Additional remarks"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={remarksSchema}
      sectionName="remarks"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        remarks: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <div className="vads-u-margin-top--neg2">
            <TextareaField
              name="remarks"
              label={`Provide any additional remarks about ${veteranName} related to their employment.`}
              schema={remarksFieldSchema}
              value={localData.remarks}
              onChange={handleFieldChange}
              error={errors.remarks}
              forceShowError={formSubmitted}
              rows={8}
              maxLength={2000}
            />
          </div>
        </>
      )}
    </PageTemplate>
  );
};

RemarksPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default RemarksPage;
