import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
  PreviousFuneralExpenses,
} from '../../../../components/FormDescriptions/ExpensesDescriptions';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import {
  expectFinancialDescriptionComponentToRenderWithNonPrefillContent,
  expectProviderWrappedComponentToRender,
  expectProviderWrappedComponentToNotRender,
  setMockStoreData,
} from '../../../helpers';

const mockStoreData = {
  'view:isProvidersAndDependentsPrefillEnabled': true,
};

const mockStoreDataWithNonPrefill = {
  ...mockStoreData,
  nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
};

describe('ezr <EducationalExpensesDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render with content', () => {
        expectProviderWrappedComponentToRender(
          mockStoreData,
          EducationalExpensesDescription(),
        );
      });
    },
  );

  context(
    'when the component renders and there is non-prefill financial information that includes the income year and education expenses',
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          mockStoreDataWithNonPrefill,
          EducationalExpensesDescription(),
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
      it('should render with content', () => {
        expectProviderWrappedComponentToRender(
          mockStoreData,
          MedicalExpensesDescription(),
        );
      });
    },
  );

  context(
    'when the component renders and there is non-prefill financial information that includes the income year and medical expenses',
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          mockStoreDataWithNonPrefill,
          MedicalExpensesDescription(),
          'Your non-reimbursable medical expenses from 2023',
        );
      });
    },
  );
});

describe('ezr <PreviousFuneralExpenses>', () => {
  context('when there is no non-prefill financial information', () => {
    it('should not render', () => {
      expectProviderWrappedComponentToNotRender(
        setMockStoreData(mockStoreData),
        PreviousFuneralExpenses(),
      );
    });
  });

  context(
    'when the component renders and there is non-prefill financial information that includes the income year and funeral expenses',
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          mockStoreDataWithNonPrefill,
          PreviousFuneralExpenses(),
          'Your funeral and burial expenses from 2023',
        );
      });
    },
  );
});
