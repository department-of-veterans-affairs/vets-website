/**
 * @module tests/pages/medical-diagnosis.unit.spec
 * @description Unit tests for MedicalDiagnosisPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { MedicalDiagnosisPage } from './medical-diagnosis';

describe('Medical Diagnosis Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Component Initialization', () => {
    it('should handle undefined data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle function as data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={() => ({})}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle array as data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle string as data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data="invalid"
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle number as data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={123}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle boolean as data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Form Initialization', () => {
    it('should render without errors', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Medical diagnoses');
    });

    it('should render instruction text', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'List all medical conditions affecting the patient',
      );
    });

    it('should render medical diagnoses textarea', async () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const textarea = container.querySelector(
          'va-textarea[name="medicalDiagnoses"]',
        );
        expect(textarea).to.exist;
        expect(textarea.getAttribute('label')).to.include(
          'List all current medical diagnoses',
        );
        expect(textarea.hasAttribute('required')).to.be.true;
      });
    });

    it('should render permanently disabled radio buttons', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isPermanentlyDisabled"]',
      );
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.include(
        'Is the patient permanently and totally disabled',
      );
      expect(radioGroup.hasAttribute('required')).to.be.true;
    });

    it('should render legally blind radio buttons', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isLegallyBlind"]',
      );
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.include(
        'Is the patient legally blind',
      );
      expect(radioGroup.hasAttribute('required')).to.be.true;
    });

    it('should render requires nursing home radio buttons', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="requiresNursingHome"]',
      );
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.include(
        'Does this patient require nursing home care',
      );
      expect(radioGroup.hasAttribute('required')).to.be.true;
    });

    it('should render loss of use checkbox group', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const checkboxGroup = container.querySelector('va-checkbox-group');
      expect(checkboxGroup).to.exist;
      expect(checkboxGroup.getAttribute('label')).to.include(
        'Does the patient have loss of use',
      );
    });

    it('should render all loss of use checkboxes', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox[name="lossOfUseNone"]')).to
        .exist;
      expect(container.querySelector('va-checkbox[name="lossOfUseBothFeet"]'))
        .to.exist;
      expect(container.querySelector('va-checkbox[name="lossOfUseHandFoot"]'))
        .to.exist;
      expect(container.querySelector('va-checkbox[name="lossOfUseBothHands"]'))
        .to.exist;
      expect(container.querySelector('va-checkbox[name="lossOfUseBothLegs"]'))
        .to.exist;
    });

    it('should render vision status heading', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Vision status');
    });

    it('should render continue and back buttons', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      const backButton = container.querySelector('va-button[text="Back"]');
      expect(continueButton).to.exist;
      expect(backButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display medical diagnoses value', async () => {
      const data = {
        medicalDiagnosis: {
          medicalDiagnoses:
            'Accelerated Clone Aging Syndrome, Combat-related PTSD, Chronic arthritis in multiple joints',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const textarea = container.querySelector(
          'va-textarea[name="medicalDiagnoses"]',
        );
        expect(textarea.getAttribute('value')).to.equal(
          'Accelerated Clone Aging Syndrome, Combat-related PTSD, Chronic arthritis in multiple joints',
        );
      });
    });

    it('should display disability status', () => {
      const data = {
        medicalDiagnosis: {
          isPermanentlyDisabled: 'yes',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isPermanentlyDisabled"]',
      );
      expect(radioGroup.getAttribute('value')).to.equal('yes');
    });

    it('should display legally blind status', () => {
      const data = {
        medicalDiagnosis: {
          isLegallyBlind: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isLegallyBlind"]',
      );
      expect(radioGroup.getAttribute('value')).to.equal('no');
    });

    it('should display nursing home requirement status', () => {
      const data = {
        medicalDiagnosis: {
          requiresNursingHome: 'yes',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="requiresNursingHome"]',
      );
      expect(radioGroup.getAttribute('value')).to.equal('yes');
    });

    it('should display loss of use checkbox values', () => {
      const data = {
        medicalDiagnosis: {
          lossOfUseNone: false,
          lossOfUseBothFeet: true,
          lossOfUseHandFoot: false,
          lossOfUseBothHands: true,
          lossOfUseBothLegs: false,
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(
        container
          .querySelector('va-checkbox[name="lossOfUseBothFeet"]')
          .hasAttribute('checked'),
      ).to.be.true;
      expect(
        container
          .querySelector('va-checkbox[name="lossOfUseBothHands"]')
          .hasAttribute('checked'),
      ).to.be.true;
      const noneCheckbox = container.querySelector(
        'va-checkbox[name="lossOfUseNone"]',
      );
      expect(
        noneCheckbox.hasAttribute('checked') &&
          noneCheckbox.getAttribute('checked') !== 'false',
      ).to.be.false;
    });

    it('should handle empty data', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle function data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={() => {}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle string data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data="invalid"
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle number data prop', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={123}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        medicalDiagnosis: {
          medicalDiagnoses:
            'Accelerated Clone Aging Syndrome, Combat-related PTSD',
          isPermanentlyDisabled: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should show save button instead of continue in review mode', () => {
      const { container } = render(
        <MedicalDiagnosisPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = container.querySelector('va-button[text="Save"]');
      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });

  describe('Conditional Fields', () => {
    it('should show permanent disability description when isPermanentlyDisabled is yes', () => {
      const data = {
        medicalDiagnosis: {
          isPermanentlyDisabled: 'yes',
          permanentDisabilityDescription: '',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="permanentDisabilityDescription"]',
      );
      expect(textarea).to.exist;
      expect(textarea.hasAttribute('required')).to.be.true;
    });

    it('should not show permanent disability description when isPermanentlyDisabled is no', () => {
      const data = {
        medicalDiagnosis: {
          isPermanentlyDisabled: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="permanentDisabilityDescription"]',
      );
      expect(textarea).to.not.exist;
    });

    it('should not show permanent disability description when isPermanentlyDisabled is empty', () => {
      const data = {
        medicalDiagnosis: {
          isPermanentlyDisabled: '',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="permanentDisabilityDescription"]',
      );
      expect(textarea).to.not.exist;
    });

    it('should display permanent disability description value', () => {
      const data = {
        medicalDiagnosis: {
          isPermanentlyDisabled: 'yes',
          permanentDisabilityDescription:
            'Unable to work due to mobility issues',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="permanentDisabilityDescription"]',
      );
      expect(textarea.getAttribute('value')).to.equal(
        'Unable to work due to mobility issues',
      );
    });

    it('should show visual acuity fields when isLegallyBlind is yes', () => {
      const data = {
        medicalDiagnosis: {
          isLegallyBlind: 'yes',
          visualAcuityRight: '',
          visualAcuityLeft: '',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const rightEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityRight"]',
      );
      const leftEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityLeft"]',
      );
      expect(rightEyeInput).to.exist;
      expect(leftEyeInput).to.exist;
      expect(rightEyeInput.hasAttribute('required')).to.be.true;
      expect(leftEyeInput.hasAttribute('required')).to.be.true;
    });

    it('should not show visual acuity fields when isLegallyBlind is no', () => {
      const data = {
        medicalDiagnosis: {
          isLegallyBlind: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const rightEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityRight"]',
      );
      const leftEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityLeft"]',
      );
      expect(rightEyeInput).to.not.exist;
      expect(leftEyeInput).to.not.exist;
    });

    it('should not show visual acuity fields when isLegallyBlind is empty', () => {
      const data = {
        medicalDiagnosis: {
          isLegallyBlind: '',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const rightEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityRight"]',
      );
      const leftEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityLeft"]',
      );
      expect(rightEyeInput).to.not.exist;
      expect(leftEyeInput).to.not.exist;
    });

    it('should display visual acuity values', () => {
      const data = {
        medicalDiagnosis: {
          isLegallyBlind: 'yes',
          visualAcuityRight: '20/200',
          visualAcuityLeft: '20/400',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const rightEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityRight"]',
      );
      const leftEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityLeft"]',
      );
      expect(rightEyeInput.getAttribute('value')).to.equal('20/200');
      expect(leftEyeInput.getAttribute('value')).to.equal('20/400');
    });

    it('should show nursing home alert when requiresNursingHome is yes', () => {
      const data = {
        medicalDiagnosis: {
          requiresNursingHome: 'yes',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.exist;
      expect(container.textContent).to.include('21-0779');
      expect(container.textContent).to.include(
        'Request for Nursing Home Information',
      );
    });

    it('should not show nursing home alert when requiresNursingHome is no', () => {
      const data = {
        medicalDiagnosis: {
          requiresNursingHome: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.not.exist;
    });

    it('should not show nursing home alert when requiresNursingHome is empty', () => {
      const data = {
        medicalDiagnosis: {
          requiresNursingHome: '',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.not.exist;
    });

    it('should render with various field values populated', () => {
      const data = {
        medicalDiagnosis: {
          medicalDiagnoses: 'Multiple diagnoses including COPD',
          isPermanentlyDisabled: 'yes',
          permanentDisabilityDescription: 'Severe chronic conditions',
          lossOfUseBothFeet: true,
          lossOfUseHandFoot: true,
          isLegallyBlind: 'yes',
          visualAcuityRight: '20/200',
          visualAcuityLeft: '20/400',
          requiresNursingHome: 'yes',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      const disabilityTextarea = container.querySelector(
        'va-textarea[name="permanentDisabilityDescription"]',
      );
      expect(disabilityTextarea).to.exist;
      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.exist;
    });
  });

  describe('More Branch Coverage Tests', () => {
    it('should handle all vision scenarios with values', () => {
      const dataWithVision = {
        medicalDiagnosis: {
          isLegallyBlind: 'yes',
          visualAcuityRight: '20/200',
          visualAcuityLeft: '20/400',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={dataWithVision}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const rightEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityRight"]',
      );
      const leftEyeInput = container.querySelector(
        'va-text-input[name="visualAcuityLeft"]',
      );
      expect(rightEyeInput.getAttribute('value')).to.equal('20/200');
      expect(leftEyeInput.getAttribute('value')).to.equal('20/400');
    });

    it('should show nursing home alert when required', () => {
      const data = {
        medicalDiagnosis: {
          requiresNursingHome: 'yes',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.exist;
      expect(container.textContent).to.include('VA Form 21-0779');
    });

    it('should not show nursing home alert when not required', () => {
      const data = {
        medicalDiagnosis: {
          requiresNursingHome: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.not.exist;
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <MedicalDiagnosisPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        medicalDiagnosis: {
          medicalDiagnoses: 'Test diagnosis',
          isPermanentlyDisabled: 'yes',
          permanentDisabilityDescription: 'Disability description',
          lossOfUseNone: true,
          isLegallyBlind: 'no',
          requiresNursingHome: 'no',
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('All Loss of Use Options', () => {
    it('should handle all loss of use checkboxes being checked', () => {
      const data = {
        medicalDiagnosis: {
          lossOfUseNone: true,
          lossOfUseBothFeet: true,
          lossOfUseHandFoot: true,
          lossOfUseBothHands: true,
          lossOfUseBothLegs: true,
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const checkboxNames = [
        'lossOfUseNone',
        'lossOfUseBothFeet',
        'lossOfUseHandFoot',
        'lossOfUseBothHands',
        'lossOfUseBothLegs',
      ];

      checkboxNames.forEach(name => {
        const checkbox = container.querySelector(`va-checkbox[name="${name}"]`);
        expect(checkbox).to.exist;
        expect(checkbox.hasAttribute('checked')).to.be.true;
      });
    });

    it('should handle partial loss of use selections', () => {
      const data = {
        medicalDiagnosis: {
          lossOfUseNone: false,
          lossOfUseBothFeet: false,
          lossOfUseHandFoot: true,
          lossOfUseBothHands: false,
          lossOfUseBothLegs: true,
        },
      };

      const { container } = render(
        <MedicalDiagnosisPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(
        container
          .querySelector('va-checkbox[name="lossOfUseHandFoot"]')
          .hasAttribute('checked'),
      ).to.be.true;
      expect(
        container
          .querySelector('va-checkbox[name="lossOfUseBothLegs"]')
          .hasAttribute('checked'),
      ).to.be.true;
      const noneCheckbox = container.querySelector(
        'va-checkbox[name="lossOfUseNone"]',
      );
      expect(
        noneCheckbox.hasAttribute('checked') &&
          noneCheckbox.getAttribute('checked') !== 'false',
      ).to.be.false;
    });
  });
});
