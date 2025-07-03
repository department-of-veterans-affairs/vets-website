import React from 'react';
import { expect } from 'chai';
import { renderProviderWrappedComponent } from '../../../helpers';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { PreviousIncome } from '../../../../components/SupplementalFormContent/PreviousFinancialInfo';

const mockStoreData = {
  'view:isProvidersAndDependentsPrefillEnabled': true,
};

const mockStoreDataWithNonPrefill = {
  ...mockStoreData,
  nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
};

describe('ezr <PreviousIncome>', () => {
  context('when there is no non-prefill financial information', () => {
    it('should not render', () => {
      const { container } = renderProviderWrappedComponent(
        mockStoreData,
        <PreviousIncome incomeReceiver="veteran" incomeType="grossIncome" />,
      );

      expect(container).to.be.empty;
    });
  });

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and gross income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          <PreviousIncome incomeReceiver="spouse" incomeType="netIncome" />,
        );

        expect(container).to.not.be.empty;
        expect(container.textContent).to.include(
          "Your spouse's net income from 2023",
        );
      });
    },
  );
});
