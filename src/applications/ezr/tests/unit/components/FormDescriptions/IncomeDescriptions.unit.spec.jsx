import {
  GrossIncomeDescription,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../../../../components/FormDescriptions/IncomeDescriptions';
import {
  expectFinancialDescriptionComponentToRender,
  expectFinancialDescriptionComponentToRenderWithNonPrefillContent,
  expectFinancialDescriptionComponentToNotRender,
  setMockStoreData,
} from '../../../helpers';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';

const mockStoreData = {
  'view:householdEnabled': true,
  'view:isProvidersAndDependentsPrefillEnabled': true,
};

const mockStoreDataWithNonPrefill = {
  ...mockStoreData,
  nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
};

describe('ezr <GrossIncomeDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        expectFinancialDescriptionComponentToRender(
          setMockStoreData(mockStoreData),
          GrossIncomeDescription('veteran'),
        );
      });
    },
  );

  context(
    `when the component renders and there is nonPrefill financial information that includes the income year and gross income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          setMockStoreData(mockStoreDataWithNonPrefill),
          GrossIncomeDescription('spouse'),
          `Your spouse's gross income from`,
        );
      });
    },
  );
});

describe('ezr <OtherIncomeDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        expectFinancialDescriptionComponentToRender(
          setMockStoreData(mockStoreData),
          OtherIncomeDescription('veteran'),
        );
      });
    },
  );

  context(
    `when the component renders and there is nonPrefill financial information that includes the income year and other income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          setMockStoreData(mockStoreDataWithNonPrefill),
          OtherIncomeDescription('veteran'),
          `Your other income from`,
        );
      });
    },
  );
});

describe('ezr <PreviousNetIncome>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should not render', () => {
        expectFinancialDescriptionComponentToNotRender(
          setMockStoreData(mockStoreData),
          PreviousNetIncome('spouse'),
        );
      });
    },
  );

  context(
    `when the component renders and there is nonPrefill financial information that includes the income year and net income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          setMockStoreData(mockStoreDataWithNonPrefill),
          PreviousNetIncome('spouse'),
          `Your spouse's net income from`,
        );
      });
    },
  );
});
