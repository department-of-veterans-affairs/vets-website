import {
  GrossIncomeDescription,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../../../../components/FormDescriptions/IncomeDescriptions';
import {
  expectFinancialDescriptionComponentToRenderWithNonPrefillContent,
  expectProviderWrappedComponentToRender,
  expectProviderWrappedComponentToNotRender,
} from '../../../helpers';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';

const mockStoreData = {
  'view:isProvidersAndDependentsPrefillEnabled': true,
};

const mockStoreDataWithNonPrefill = {
  ...mockStoreData,
  nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
};

describe('ezr <GrossIncomeDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render with content', () => {
        expectProviderWrappedComponentToRender(
          mockStoreData,
          GrossIncomeDescription('veteran'),
        );
      });
    },
  );

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and gross income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          mockStoreDataWithNonPrefill,
          GrossIncomeDescription('spouse'),
          `Your spouse's gross income from 2023`,
        );
      });
    },
  );
});

describe('ezr <OtherIncomeDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render with content', () => {
        expectProviderWrappedComponentToRender(
          mockStoreData,
          OtherIncomeDescription('veteran'),
        );
      });
    },
  );

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and other income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          mockStoreDataWithNonPrefill,
          OtherIncomeDescription('veteran'),
          `Your other income from 2023`,
        );
      });
    },
  );
});

describe('ezr <PreviousNetIncome>', () => {
  context('when there is no non-prefill financial information', () => {
    it('should not render', () => {
      expectProviderWrappedComponentToNotRender(
        mockStoreData,
        PreviousNetIncome('spouse'),
      );
    });
  });

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and net income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        expectFinancialDescriptionComponentToRenderWithNonPrefillContent(
          mockStoreDataWithNonPrefill,
          PreviousNetIncome('spouse'),
          `Your spouse's net income from 2023`,
        );
      });
    },
  );
});
