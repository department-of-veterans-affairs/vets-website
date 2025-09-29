import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { certificationLevelOfCareSchema } from '../schemas';

// Schema for level of care radio field - used for real-time field validation
// This properly validates the required field
const levelOfCareFieldSchema = z
  .enum(['skilled', 'intermediate'])
  .or(z.literal(''))
  .refine(value => value === 'skilled' || value === 'intermediate', {
    message: 'Please select the level of care being provided',
  });

/**
 * Certification Level of Care page component for the nursing home information form
 * This page certifies that the patient is receiving skilled or intermediate care
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Certification level of care form page
 */
export const CertificationLevelOfCarePage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Certification of level of care"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={certificationLevelOfCareSchema}
      sectionName="certificationLevelOfCare"
      defaultData={{
        levelOfCare: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
            <h3 slot="headline">Certification by nursing home official</h3>
            <p>
              A nursing home official must certify that the patient is in the
              facility due to a mental or physical disability and is receiving
              the indicated level of care.
            </p>
          </va-alert>

          <div key="levelOfCare-radio-wrapper">
            <RadioField
              name="levelOfCare"
              label="Level of care being provided to the patient"
              schema={levelOfCareFieldSchema}
              value={localData.levelOfCare}
              onChange={handleFieldChange}
              options={[
                {
                  label: 'Skilled nursing care',
                  value: 'skilled',
                  description:
                    'Care that requires the skills of qualified technical or professional personnel',
                },
                {
                  label: 'Intermediate nursing care',
                  value: 'intermediate',
                  description:
                    'Care provided on a regular basis for patients who do not require skilled nursing care',
                },
              ]}
              required
              error={errors.levelOfCare}
              forceShowError={formSubmitted}
            />
          </div>

          <va-additional-info
            trigger="What qualifies as skilled vs intermediate care?"
            class="vads-u-margin-y--2"
          >
            <p>
              <strong>Skilled nursing care</strong> includes services that can
              only be performed safely and correctly by a licensed nurse (either
              a registered nurse or a licensed practical nurse). Examples
              include intravenous injections, catheterization, and wound care.
            </p>
            <p>
              <strong>Intermediate nursing care</strong> is for patients who
              need more care than custodial care but less than skilled nursing
              care. This includes help with activities of daily living and some
              medical monitoring.
            </p>
          </va-additional-info>

          <p className="vads-u-margin-top--3">
            By selecting one of the above options, you certify that the patient
            is in this nursing home facility due to mental or physical
            disability and is receiving the indicated level of nursing care.
          </p>
        </>
      )}
    </PageTemplate>
  );
};

CertificationLevelOfCarePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
