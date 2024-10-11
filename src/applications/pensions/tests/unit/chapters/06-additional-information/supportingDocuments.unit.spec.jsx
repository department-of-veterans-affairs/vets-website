import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor, within } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { testNumberOfFields } from '../pageTests.spec';
import getData from '../../../fixtures/mocks/mockStore';
import formConfig from '../../../../config/form';
import supportingDocuments, {
  childAttendsCollege,
  childIsDisabled,
  childIsAdopted,
} from '../../../../config/chapters/06-additional-information/supportingDocuments';

const definitions = formConfig.defaultDefinitions;
const { schema, uiSchema } = supportingDocuments;

describe('Supporting documents pension page', () => {
  const pageTitle = 'Supporting documents';
  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  describe('childAttendsCollege', () => {
    it('should return true if child attends college', () => {
      expect(childAttendsCollege({ attendingCollege: true })).to.be.true;
    });

    it('should return false if child does not attend college', () => {
      expect(childAttendsCollege({ attendingCollege: false })).to.be.false;
    });
  });

  describe('childIsDisabled', () => {
    it('should return true if child is disabled', () => {
      expect(childIsDisabled({ disabled: true })).to.be.true;
    });

    it('should return false if child is not disabled', () => {
      expect(childIsDisabled({ disabled: false })).to.be.false;
    });
  });

  describe('childIsAdopted', () => {
    it('should return true if child is adopted', () => {
      expect(childIsAdopted({ childRelationship: 'ADOPTED' })).to.be.true;
    });

    it('should return false if child is not adopted', () => {
      expect(childIsAdopted({ childRelationship: 'BIOLOGICAL' })).to.be.false;
    });
  });

  describe('childIsAdopted', () => {
    it('should return true if child is adopted', () => {
      expect(childIsAdopted({ childRelationship: 'ADOPTED' })).to.be.true;
    });

    it('should return false if child is not adopted', () => {
      expect(childIsAdopted({ childRelationship: 'BIOLOGICAL' })).to.be.false;
    });
  });

  describe('Documents component', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const formData = {
      dependents: [
        {
          attendingCollege: true,
          disabled: false,
          childRelationship: 'BIOLOGICAL',
        },
        {
          attendingCollege: false,
          disabled: true,
          childRelationship: 'ADOPTED',
        },
      ],
      specialMonthlyPension: true,
      socialSecurityDisability: true,
      nursingHome: true,
      totalNetWorth: false,
      homeOwnership: true,
      homeAcreageMoreThanTwo: true,
      transferredAssets: true,
    };

    it('should render the appropriate supporting documents and additional evidence items based on form data', async () => {
      const onSubmit = sinon.spy();
      const { data } = getData({ loggedIn: true });
      const { container, getByTestId } = render(
        <Provider store={mockStore(data)}>
          <DefinitionTester
            definitions={definitions}
            schema={schema}
            uiSchema={uiSchema}
            data={formData}
            formData={formData}
            onSubmit={onSubmit}
          />
        </Provider>,
      );
      await waitFor(() => {
        const supportingDocumentsList = getByTestId(
          'supporting-documents-list',
        );
        expect(supportingDocumentsList).to.exist;
        expect(
          within(supportingDocumentsList).getAllByRole('listitem'),
        ).to.have.length(6);
        const additionalEvidenceList = getByTestId('additional-evidence-list');
        expect(additionalEvidenceList).to.exist;
        const additionalEvidenceListItems = container.querySelectorAll(
          'va-accordion-item',
        );
        expect(additionalEvidenceListItems).to.have.length(2);
      });
    });

    it('should not render special monthly pension items based on form data', async () => {
      const onSubmit = sinon.spy();
      const { data } = getData({ loggedIn: true });
      const { getByTestId, queryByTestId } = render(
        <Provider store={mockStore(data)}>
          <DefinitionTester
            definitions={definitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{ ...formData, specialMonthlyPension: false }}
            formData={{ ...formData, specialMonthlyPension: false }}
            onSubmit={onSubmit}
          />
        </Provider>,
      );
      await waitFor(() => {
        const supportingDocumentsList = getByTestId(
          'supporting-documents-list',
        );
        expect(supportingDocumentsList).to.exist;
        expect(
          within(supportingDocumentsList).getAllByRole('listitem'),
        ).to.have.length(5);
        const additionalEvidenceList = queryByTestId(
          'additional-evidence-list',
        );
        expect(additionalEvidenceList).to.be.null;
      });
    });
  });
});
