import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/agreementType';

const { updateFormData } = page;

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('22-0839 agreementType page', () => {
  it('renders the radio group with the correct label', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'What would you like to do with your Yellow Ribbon agreement?',
    );
  });

  it('accepts any valid option without error', () => {
    const { container, unmount } = renderPage({
      agreementType: 'startNewOpenEndedAgreement',
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();

    const utils2 = renderPage({
      agreementType: 'modifyExistingAgreement',
    });
    expect(utils2.container.querySelectorAll('[error]')).to.have.length(0);
    utils2.unmount();
  });

  it('shows an error when no option is selected on submit', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await new Promise(resolve => setTimeout(resolve, 0));

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('error')).to.equal('Please make a selection');
  });

  describe('updateFormData', () => {
    it('should return formData unchanged when agreementType has not changed', () => {
      const oldData = {
        agreementType: 'startNewOpenEndedAgreement',
        acknowledgements: { someData: true },
        institutionDetails: { name: 'Test' },
        isAuthenticated: false,
      };
      const formData = {
        agreementType: 'startNewOpenEndedAgreement',
        acknowledgements: { someData: true },
        institutionDetails: { name: 'Test' },
        isAuthenticated: false,
      };

      expect(updateFormData(oldData, formData)).to.deep.equal(formData);
    });

    it('should clear related fields when agreementType changes', () => {
      const oldData = {
        agreementType: 'startNewOpenEndedAgreement',
        isAuthenticated: false,
        authorizedOfficial: [
          {
            officialName: 'John Doe',
            officialTitle: 'Director',
            officialEmail: 'john@example.com',
          },
        ],
        acknowledgements: { someData: true },
        institutionDetails: { name: 'Test' },
        additionalInstitutionDetails: [{ id: 1 }],
        yellowRibbonProgramRequest: [{ request: 'test' }],
        pointsOfContact: [{ contact: 'test' }],
      };
      const formData = {
        agreementType: 'modifyExistingAgreement',
        isAuthenticated: false,
        acknowledgements: { someData: true },
        institutionDetails: { name: 'Test' },
        additionalInstitutionDetails: [{ id: 1 }],
        yellowRibbonProgramRequest: [{ request: 'test' }],
        pointsOfContact: [{ contact: 'test' }],
      };

      const result = updateFormData(oldData, formData);
      expect(result).to.deep.equal({
        authorizedOfficial: [
          {
            officialName: 'John Doe',
            officialTitle: 'Director',
            officialEmail: 'john@example.com',
          },
        ],
        agreementType: 'modifyExistingAgreement',
        isAuthenticated: false,
        acknowledgements: {},
        institutionDetails: {},
        additionalInstitutionDetails: [],
        yellowRibbonProgramRequest: [],
        pointsOfContact: {},
      });
    });
  });
});
