import { expect } from 'chai';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../../../../components/FormDescriptions/IncomeDescriptions';
import { renderProviderWrappedComponent } from '../../../helpers';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';

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

describe('ezr <GrossIncomeDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render without non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreData,
          GrossIncomeDescription('veteran'),
        );

        expect(container).to.not.be.empty;
        expect(container.textContent).to.not.include(
          'Your gross income from 2023',
        );
      });
    },
  );

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and gross income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          GrossIncomeDescription('spouse'),
        );

        expect(container).to.not.be.empty;
        expectNonPrefillContentToRender(
          container,
          "Your spouse's gross income from 2023",
        );
      });
    },
  );
});

describe('ezr <OtherIncomeDescription>', () => {
  context(
    'when the component renders and there is no non-prefill financial information',
    () => {
      it('should render without non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreData,
          GrossIncomeDescription('spouse'),
        );

        expect(container).to.not.be.empty;
        expect(container.textContent).to.not.include(
          "Your spouse's gross income from 2023",
        );
      });
    },
  );

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and other income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          OtherIncomeDescription('veteran'),
        );

        expect(container).to.not.be.empty;
        expectNonPrefillContentToRender(
          container,
          'Your other income from 2023',
        );
      });
    },
  );
});

describe('ezr <PreviousNetIncome>', () => {
  context('when there is no non-prefill financial information', () => {
    it('should not render', () => {
      const { container } = renderProviderWrappedComponent(
        mockStoreData,
        PreviousNetIncome('spouse'),
      );

      expect(container).to.be.empty;
    });
  });

  context(
    `when the component renders and there is non-prefill financial information that includes the income year and net income for the 'incomeReceiver'`,
    () => {
      it('should render with non-prefill content', () => {
        const { container } = renderProviderWrappedComponent(
          mockStoreDataWithNonPrefill,
          PreviousNetIncome('veteran'),
        );

        expect(container).to.not.be.empty;
        expectNonPrefillContentToRender(container, 'Your net income from 2023');
      });
    },
  );
});
