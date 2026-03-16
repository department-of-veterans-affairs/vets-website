import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { render } from '@testing-library/react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

function getPageObject(container) {
  return {
    triggerYesSelection: () => {
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'Y' },
      });
    },
    triggerNoSelection: () => {
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'N' },
      });
    },
    getOtherEvidenceCheckbox: () =>
      $$('va-checkbox', container).find(
        el => el.getAttribute('data-key') === 'view:hasOtherEvidence',
      ),
  };
}

describe('evidenceTypes', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceTypesBDD;

  /**
   * Utility for reducing the noise in tests and highlighting only the important signals of the test.
   *
   * @param {*} props - Overrides to the default value of DefinitionTester. Primarily used to pass the data prop.
   * @returns {JSX.Element} The rendered DefinitionTester component.
   */
  const DefaultDefinitionTester = props => {
    return (
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        {...props}
      />
    );
  };

  it('should render', () => {
    render(<DefaultDefinitionTester />);

    expect($$('va-radio-option').length).to.equal(2);
  });

  it('should submit when no evidence selected', () => {
    const onSubmit = sinon.spy();

    const { getByText } = render(
      <DefaultDefinitionTester
        data={{
          'view:hasEvidence': false,
        }}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
  });

  /* TODO: Fix with https://github.com/department-of-veterans-affairs/va.gov-team/issues/58050 */
  it.skip('should require at least one evidence type when evidence selected', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect($('va-radio').error).to.eq('Please provide a response');
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();

    const { getByText } = render(
      <DefaultDefinitionTester
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
  });

  describe('BDD SHA Alert', () => {
    it('should display when BDD SHA enabled and user selects "No, I will submit more information later" and disability526NewBddShaEnforcementWorkflowEnabled is false', () => {
      const { queryByText, container } = render(
        <DefaultDefinitionTester
          data={{
            disability526NewBddShaEnforcementWorkflowEnabled: false,
          }}
        />,
      );

      // Ensure mock data does not cause alert to display on initial render
      expect(
        queryByText(
          'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
        ),
      ).to.not.exist;

      const page = getPageObject(container);
      page.triggerNoSelection();

      expect(
        queryByText(
          'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
        ),
      ).to.exist;

      // Ensure alert goes away if user changes selection to "Yes"
      page.triggerYesSelection();

      expect(
        queryByText(
          'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
        ),
      ).to.not.exist;
    });

    it('should not display when BDD SHA enabled and user selects "No, I will submit more information later" but disability526NewBddShaEnforcementWorkflowEnabled is true', () => {
      const { queryByText, container } = render(
        <DefaultDefinitionTester
          data={{
            disability526NewBddShaEnforcementWorkflowEnabled: true,
          }}
        />,
      );

      // Ensure mock data does not cause alert to display on initial render
      expect(
        queryByText(
          'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
        ),
      ).to.not.exist;

      const page = getPageObject(container);
      page.triggerNoSelection(container);

      expect(
        queryByText(
          'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
        ),
      ).to.not.exist;
    });
  });

  describe('Other Evidence Label', () => {
    it('should display full SHA label when disability526NewBddShaEnforcementWorkflowEnabled is false', () => {
      const { container } = render(
        <DefaultDefinitionTester
          data={{
            'view:hasEvidence': true,
            disability526NewBddShaEnforcementWorkflowEnabled: false,
          }}
        />,
      );

      const page = getPageObject(container);
      const checkbox = page.getOtherEvidenceCheckbox();
      expect(checkbox).to.exist;
      expect(checkbox.getAttribute('label')).to.equal(
        'Required Separation Health Assessment - Part A Self-Assessment or other documents like your DD Form 214, supporting (lay) statements, or other evidence',
      );
    });

    it('should display "Other evidence" label when disability526NewBddShaEnforcementWorkflowEnabled is true', () => {
      const { container } = render(
        <DefaultDefinitionTester
          data={{
            'view:hasEvidence': true,
            disability526NewBddShaEnforcementWorkflowEnabled: true,
          }}
        />,
      );

      const page = getPageObject(container);
      const checkbox = page.getOtherEvidenceCheckbox();
      expect(checkbox).to.exist;
      expect(checkbox.getAttribute('label')).to.equal('Other evidence');
    });
  });

  describe('Evidence Type Help', () => {
    it('should display if user selects "Yes" and disability526NewBddShaEnforcementWorkflowEnabled is false', () => {
      const { queryByText, container } = render(
        <DefaultDefinitionTester
          data={{
            disability526NewBddShaEnforcementWorkflowEnabled: false,
          }}
        />,
      );

      // Ensure mock data does not cause alert to display on initial render
      expect(queryByText('Types of evidence')).to.not.exist;

      const page = getPageObject(container);

      page.triggerYesSelection();

      expect(queryByText('Types of evidence')).to.exist;

      // It should disaappear if user changes selection to "No"
      page.triggerNoSelection();

      expect(queryByText('Types of evidence')).to.not.exist;
    });

    it('should not display if user selects "Yes" and disability526NewBddShaEnforcementWorkflowEnabled is true', () => {
      const { queryByText, container } = render(
        <DefaultDefinitionTester
          data={{
            disability526NewBddShaEnforcementWorkflowEnabled: true,
          }}
        />,
      );

      // Ensure mock data does not cause alert to display on initial render
      expect(queryByText('Types of evidence')).to.not.exist;

      const page = getPageObject(container);

      page.triggerYesSelection();

      // Additional info does not show because feature flag is enabled, even though user selected "Yes"
      expect(queryByText('Types of evidence')).to.not.exist;

      // It still should not appear if the user selects no.
      page.triggerNoSelection();

      expect(queryByText('Types of evidence')).to.not.exist;
    });
  });
});
