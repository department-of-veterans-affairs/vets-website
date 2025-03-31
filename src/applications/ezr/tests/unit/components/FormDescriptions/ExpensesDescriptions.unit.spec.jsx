import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
  PreviousFuneralExpenses,
} from '../../../../components/FormDescriptions/ExpensesDescriptions';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import {
  expectFinancialDescriptionComponentToRender,
  expectFinancialDescriptionComponentToRenderWithNonPrefillContent,
  expectFinancialDescriptionComponentToNotRender,
  setMockStoreData,
} from '../../../helpers';

const mockStoreData = {
  'view:householdEnabled': true,
  'view:isProvidersAndDependentsPrefillEnabled': true,
};

const mockStoreDataWithNonPrefill = {
  ...mockStoreData,
  nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
};

describe('ezr <EducationalExpensesDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        expectFinancialDescriptionComponentToRender(
          setMockStoreData(mockStoreData),
          EducationalExpensesDescription(),
        );
      });
    },
  );

  context(
    'when the component renders and there is nonPrefill financial information that includes the income year and education expenses',
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          setMockStoreData(mockStoreDataWithNonPrefill),
          EducationalExpensesDescription(),
          'Your education expenses from',
        );
      });
    },
  );
});

describe('ezr <MedicalExpensesDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        expectFinancialDescriptionComponentToRender(
          setMockStoreData(mockStoreData),
          MedicalExpensesDescription(),
        );
      });
    },
  );

  context(
    'when the component renders and there is nonPrefill financial information that includes the income year and medical expenses',
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          setMockStoreData(mockStoreDataWithNonPrefill),
          MedicalExpensesDescription(),
          'Your non-reimbursable medical expenses from',
        );
      });
    },
  );
});

describe('ezr <PreviousFuneralExpenses>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should not render', () => {
        expectFinancialDescriptionComponentToNotRender(
          setMockStoreData(mockStoreData),
          PreviousFuneralExpenses(),
        );
      });
    },
  );

  context(
    'when the component renders and there is nonPrefill financial information that includes the income year and funeral expenses',
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          setMockStoreData(mockStoreDataWithNonPrefill),
          PreviousFuneralExpenses(),
          'Your funeral and burial expenses from',
        );
      });
    },
  );
});
