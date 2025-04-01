import { expect } from 'chai';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
  PreviousFuneralExpenses,
} from '../../../../components/FormDescriptions/ExpensesDescriptions';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { renderProviderWrappedComponent } from '../../../helpers';

const mockStoreData = {
  'view:isProvidersAndDependentsPrefillEnabled': true,
};

const mockStoreDataWithNonPrefill = {
  ...mockStoreData,
  nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
};

const expectNonPrefillContentToRender = (container, content) => {
  expect(container.querySelector('va-card')).to.exist;
  expect(container.querySelector('va-card h4').textContent.trim()).to.equal(
    content,
  );
};

describe('ezr <EducationalExpensesDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render without non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreData,
          EducationalExpensesDescription('veteran'),
        );

        expect(container).to.not.be.empty;
        expect(container.textContent).to.not.include(
          'Your education expenses from 2023',
        );
      });
    },
  );

  context(
    'when the component renders and there is non-prefill financial information that includes the income year and education expenses',
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          EducationalExpensesDescription('spouse'),
        );

        expect(container).to.not.be.empty;
        expectNonPrefillContentToRender(
          container,
          'Your education expenses from 2023',
        );
      });
    },
  );
});

describe('ezr <MedicalExpensesDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render without non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreData,
          MedicalExpensesDescription(),
        );

        expect(container).to.not.be.empty;
        expect(container.textContent).to.not.include(
          'Your non-reimbursable medical expenses from 2023',
        );
      });
    },
  );

  context(
    'when the component renders and there is non-prefill financial information that includes the income year and medical expenses',
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          MedicalExpensesDescription(),
        );

        expect(container).to.not.be.empty;
        expectNonPrefillContentToRender(
          container,
          'Your non-reimbursable medical expenses from 2023',
        );
      });
    },
  );
});

describe('ezr <PreviousFuneralExpenses>', () => {
  context('when there is no non-prefill financial information', () => {
    it('should not render', () => {
      const { container } = renderProviderWrappedComponent(
        mockStoreData,
        PreviousFuneralExpenses(),
      );

      expect(container).to.be.empty;
    });
  });

  context(
    'when the component renders and there is non-prefill financial information that includes the income year and funeral expenses',
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          PreviousFuneralExpenses(),
        );

        expect(container).to.not.be.empty;
        expectNonPrefillContentToRender(
          container,
          'Your funeral and burial expenses from 2023',
        );
      });
    },
  );
});
