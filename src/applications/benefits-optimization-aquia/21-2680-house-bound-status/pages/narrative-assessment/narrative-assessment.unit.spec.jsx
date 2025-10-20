/**
 * @module tests/pages/narrative-assessment.unit.spec
 * @description Unit tests for NarrativeAssessmentPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { NarrativeAssessmentPage } from './narrative-assessment';

describe('NarrativeAssessmentPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Component Initialization', () => {
    it('should handle undefined data prop', () => {
      const { container } = render(
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
          data
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Clinical narrative and locomotion assessment',
      );
    });

    it('should render instruction text', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Provide a comprehensive narrative assessment',
      );
    });

    it('should render clinical narrative textarea', async () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const textarea = container.querySelector(
          'va-textarea[name="clinicalNarrative"]',
        );
        expect(textarea).to.exist;
        expect(textarea.getAttribute('label')).to.include('Item 39');
        expect(textarea.hasAttribute('required')).to.be.true;
      });
    });

    it('should render locomotion aids checkbox group', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const checkboxGroup = container.querySelector('va-checkbox-group');
      expect(checkboxGroup).to.exist;
      expect(checkboxGroup.getAttribute('label')).to.include('Item 40');
    });

    it('should render all locomotion aid checkboxes', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // Check for all individual checkboxes
      expect(container.querySelector('va-checkbox[name="locomotionNone"]')).to
        .exist;
      expect(container.querySelector('va-checkbox[name="locomotionCane"]')).to
        .exist;
      expect(container.querySelector('va-checkbox[name="locomotionWalker"]')).to
        .exist;
      expect(
        container.querySelector('va-checkbox[name="locomotionWheelchair"]'),
      ).to.exist;
      expect(container.querySelector('va-checkbox[name="locomotionCrutches"]'))
        .to.exist;
      expect(container.querySelector('va-checkbox[name="locomotionBraces"]')).to
        .exist;
      expect(
        container.querySelector('va-checkbox[name="locomotionProsthetic"]'),
      ).to.exist;
      expect(container.querySelector('va-checkbox[name="locomotionOther"]')).to
        .exist;
    });

    it('should render walking distance select field', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // Check for va-select element for walking distance
      const selectField = container.querySelector(
        'va-select[name="walkingDistance"]',
      );
      expect(selectField).to.exist;
      expect(selectField.getAttribute('label')).to.include('Item 41');
      expect(selectField.hasAttribute('required')).to.be.true;
    });

    it('should render prognosis radio buttons', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio[name="prognosis"]');
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.include('Item 42');
      expect(radioGroup.hasAttribute('required')).to.be.true;
    });

    it('should render continue and back buttons', () => {
      const { container } = render(
        <NarrativeAssessmentPage
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
    it('should display clinical narrative value', async () => {
      const data = {
        narrativeAssessment: {
          clinicalNarrative: 'Test narrative for patient assessment',
          walkingDistance: '50_100',
          prognosis: 'fair',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const textarea = container.querySelector(
          'va-textarea[name="clinicalNarrative"]',
        );
        expect(textarea.getAttribute('value')).to.equal(
          'Test narrative for patient assessment',
        );
      });
    });

    it('should display walking distance value', () => {
      const data = {
        narrativeAssessment: {
          walkingDistance: '100_500',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const selectField = container.querySelector(
        'va-select[name="walkingDistance"]',
      );
      expect(selectField.getAttribute('value')).to.equal('100_500');
    });

    it('should display prognosis value', () => {
      const data = {
        narrativeAssessment: {
          prognosis: 'poor',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio[name="prognosis"]');
      expect(radioGroup.getAttribute('value')).to.equal('poor');
    });

    it('should display locomotion aid checkbox values', () => {
      const data = {
        narrativeAssessment: {
          locomotionNone: false,
          locomotionCane: true,
          locomotionWalker: true,
          locomotionWheelchair: false,
          locomotionCrutches: true,
          locomotionBraces: false,
          locomotionProsthetic: true,
          locomotionOther: false,
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(
        container
          .querySelector('va-checkbox[name="locomotionCane"]')
          .hasAttribute('checked'),
      ).to.be.true;
      expect(
        container
          .querySelector('va-checkbox[name="locomotionWalker"]')
          .hasAttribute('checked'),
      ).to.be.true;
      expect(
        container
          .querySelector('va-checkbox[name="locomotionCrutches"]')
          .hasAttribute('checked'),
      ).to.be.true;
      expect(
        container
          .querySelector('va-checkbox[name="locomotionProsthetic"]')
          .hasAttribute('checked'),
      ).to.be.true;
      const noneCheckbox = container.querySelector(
        'va-checkbox[name="locomotionNone"]',
      );
      expect(
        noneCheckbox.hasAttribute('checked') &&
          noneCheckbox.getAttribute('checked') !== 'false',
      ).to.be.false;
    });

    it('should handle empty data', () => {
      const { container } = render(
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-checkbox-group')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={[]}
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
        narrativeAssessment: {
          clinicalNarrative: 'Patient requires assistance',
          locomotionWalker: true,
          walkingDistance: 'less_10',
          prognosis: 'poor',
          prognosisExplanation: 'Condition is chronic',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
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
        <NarrativeAssessmentPage
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

  describe('More Conditional Coverage', () => {
    it('should handle locomotion other with description', () => {
      const data = {
        narrativeAssessment: {
          locomotionOther: true,
          locomotionOtherDescription: 'Custom walker with seat',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const otherInput = container.querySelector(
        'va-text-input[name="locomotionOtherDescription"]',
      );
      expect(otherInput).to.exist;
      expect(otherInput.getAttribute('value')).to.equal(
        'Custom walker with seat',
      );
    });

    it('should handle all walking distance options', () => {
      const distances = [
        'unable',
        'less_10',
        '10_50',
        '50_100',
        '100_500',
        'over_500',
        'unlimited',
      ];

      distances.forEach(distance => {
        const data = {
          narrativeAssessment: {
            walkingDistance: distance,
          },
        };

        const { container } = render(
          <NarrativeAssessmentPage
            data={data}
            setFormData={mockSetFormData}
            goForward={mockGoForward}
            goBack={mockGoBack}
          />,
        );

        const selectField = container.querySelector(
          'va-select[name="walkingDistance"]',
        );
        expect(selectField.getAttribute('value')).to.equal(distance);
      });
    });

    it('should handle all prognosis options', () => {
      const prognoses = ['good', 'fair', 'poor', 'terminal'];

      prognoses.forEach(prognosis => {
        const data = {
          narrativeAssessment: {
            prognosis,
          },
        };

        const { container } = render(
          <NarrativeAssessmentPage
            data={data}
            setFormData={mockSetFormData}
            goForward={mockGoForward}
            goBack={mockGoBack}
          />,
        );

        const prognosisRadio = container.querySelector(
          'va-radio[name="prognosis"]',
        );
        expect(prognosisRadio.getAttribute('value')).to.equal(prognosis);
      });
    });
  });

  describe('Conditional Fields', () => {
    it('should show other device description when locomotionOther is checked', () => {
      const data = {
        narrativeAssessment: {
          locomotionOther: true,
          locomotionOtherDescription: '',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="locomotionOtherDescription"]',
      );
      expect(textInput).to.exist;
      expect(textInput.hasAttribute('required')).to.be.true;
    });

    it('should not show other device description when locomotionOther is unchecked', () => {
      const data = {
        narrativeAssessment: {
          locomotionOther: false,
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="locomotionOtherDescription"]',
      );
      expect(textInput).to.not.exist;
    });

    it('should display other device description value', () => {
      const data = {
        narrativeAssessment: {
          locomotionOther: true,
          locomotionOtherDescription: 'Specialized mobility scooter',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="locomotionOtherDescription"]',
      );
      expect(textInput.getAttribute('value')).to.equal(
        'Specialized mobility scooter',
      );
    });

    it('should show prognosis explanation when prognosis is selected', () => {
      const data = {
        narrativeAssessment: {
          prognosis: 'good',
          prognosisExplanation: '',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="prognosisExplanation"]',
      );
      expect(textarea).to.exist;
      expect(textarea.hasAttribute('required')).to.be.true;
    });

    it('should not show prognosis explanation when prognosis is empty', () => {
      const data = {
        narrativeAssessment: {
          prognosis: '',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="prognosisExplanation"]',
      );
      expect(textarea).to.not.exist;
    });

    it('should show prognosis explanation for each prognosis value', () => {
      const prognosisValues = ['good', 'fair', 'poor', 'terminal'];

      prognosisValues.forEach(value => {
        const data = {
          narrativeAssessment: {
            prognosis: value,
          },
        };

        const { container } = render(
          <NarrativeAssessmentPage
            data={data}
            setFormData={mockSetFormData}
            goForward={mockGoForward}
            goBack={mockGoBack}
          />,
        );

        const textarea = container.querySelector(
          'va-textarea[name="prognosisExplanation"]',
        );
        expect(textarea).to.exist;
      });
    });

    it('should display prognosis explanation value', () => {
      const data = {
        narrativeAssessment: {
          prognosis: 'fair',
          prognosisExplanation:
            'Patient shows gradual improvement with physical therapy',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[name="prognosisExplanation"]',
      );
      expect(textarea.getAttribute('value')).to.equal(
        'Patient shows gradual improvement with physical therapy',
      );
    });

    it('should render with various field values populated', () => {
      const data = {
        narrativeAssessment: {
          clinicalNarrative: 'Detailed assessment of patient condition',
          locomotionCane: true,
          locomotionWalker: true,
          locomotionOther: true,
          locomotionOtherDescription: 'Custom mobility device',
          walkingDistance: '10_50',
          prognosis: 'fair',
          prognosisExplanation: 'Expected gradual improvement over 6 months',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      const otherInput = container.querySelector(
        'va-text-input[name="locomotionOtherDescription"]',
      );
      expect(otherInput).to.exist;
      const prognosisTextarea = container.querySelector(
        'va-textarea[name="prognosisExplanation"]',
      );
      expect(prognosisTextarea).to.exist;
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <NarrativeAssessmentPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        narrativeAssessment: {
          clinicalNarrative: 'Test narrative',
          locomotionNone: true,
          walkingDistance: 'unable',
          prognosis: 'terminal',
          prognosisExplanation: 'End-of-life care required',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
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

  describe('Walking Distance Options', () => {
    it('should have all walking distance options available', () => {
      const { container } = render(
        <NarrativeAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const selectField = container.querySelector(
        'va-select[name="walkingDistance"]',
      );
      expect(selectField).to.exist;

      // The component should have these options based on the JSX
      const expectedOptions = [
        'unable',
        'less_10',
        '10_50',
        '50_100',
        '100_500',
        'over_500',
        'unlimited',
      ];

      // Note: We can't directly inspect options in va-select without DOM inspection
      // but we can test that different values are accepted
      expectedOptions.forEach(option => {
        const { container: testContainer } = render(
          <NarrativeAssessmentPage
            data={{
              narrativeAssessment: {
                walkingDistance: option,
              },
            }}
            setFormData={mockSetFormData}
            goForward={mockGoForward}
            goBack={mockGoBack}
          />,
        );

        const select = testContainer.querySelector(
          'va-select[name="walkingDistance"]',
        );
        expect(select.getAttribute('value')).to.equal(option);
      });
    });
  });

  describe('All Locomotion Options', () => {
    it('should handle all locomotion checkboxes being checked', () => {
      const data = {
        narrativeAssessment: {
          locomotionNone: true,
          locomotionCane: true,
          locomotionWalker: true,
          locomotionWheelchair: true,
          locomotionCrutches: true,
          locomotionBraces: true,
          locomotionProsthetic: true,
          locomotionOther: true,
          locomotionOtherDescription: 'Power wheelchair',
        },
      };

      const { container } = render(
        <NarrativeAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // Verify all checkboxes are checked
      const checkboxNames = [
        'locomotionNone',
        'locomotionCane',
        'locomotionWalker',
        'locomotionWheelchair',
        'locomotionCrutches',
        'locomotionBraces',
        'locomotionProsthetic',
        'locomotionOther',
      ];

      checkboxNames.forEach(name => {
        const checkbox = container.querySelector(`va-checkbox[name="${name}"]`);
        expect(checkbox).to.exist;
        expect(checkbox.hasAttribute('checked')).to.be.true;
      });

      // Also verify other description field is shown
      const otherInput = container.querySelector(
        'va-text-input[name="locomotionOtherDescription"]',
      );
      expect(otherInput).to.exist;
      expect(otherInput.getAttribute('value')).to.equal('Power wheelchair');
    });
  });
});
