import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import React from 'react';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../../../../components/FormDescriptions/IncomeDescriptions';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { LAST_YEAR } from '../../../../utils/constants';

const getData = () => ({
  mockStore: {
    getState: () => ({
      form: {
        data: {
          'view:householdEnabled': true,
          'view:isProvidersAndDependentsPrefillEnabled': true,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});
const getDataWithNonPrefill = () => ({
  mockStore: {
    getState: () => ({
      form: {
        data: {
          'view:householdEnabled': true,
          'view:isProvidersAndDependentsPrefillEnabled': true,
          nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('ezr <GrossIncomeDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        const { mockStore } = getData();
        const { container } = render(
          <Provider store={mockStore}>
            {GrossIncomeDescription('veteran')}
          </Provider>,
        );
        expect(container).to.not.be.empty;
      });
    },
  );

  context(
    `when the component renders and there is nonPrefill financial information that includes the income year and gross income for the 'incomeReceiver'`,
    () => {
      it('should render with content', () => {
        const { mockStore } = getDataWithNonPrefill();

        const { container } = render(
          <Provider store={mockStore}>
            {GrossIncomeDescription('spouse')}
          </Provider>,
        );

        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your spouse's gross income from ${LAST_YEAR}`);
      });
    },
  );
});

describe('ezr <OtherIncomeDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        const { mockStore } = getData();
        const { container } = render(
          <Provider store={mockStore}>
            {OtherIncomeDescription('veteran')}
          </Provider>,
        );
        expect(container).to.not.be.empty;
      });
    },
  );

  context(
    `when the component renders and there is nonPrefill financial information that includes the income year and other income for the 'incomeReceiver'`,
    () => {
      it('should render with content', () => {
        const { mockStore } = getDataWithNonPrefill();

        const { container } = render(
          <Provider store={mockStore}>
            {GrossIncomeDescription('veteran')}
          </Provider>,
        );

        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your gross income from ${LAST_YEAR}`);
      });
    },
  );
});

describe('ezr <PreviousNetIncome>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should not render', () => {
        const { mockStore } = getData();
        const { container } = render(
          <Provider store={mockStore}>{PreviousNetIncome('spouse')}</Provider>,
        );
        expect(container).be.empty;
      });
    },
  );

  context(
    `when the component renders and there is nonPrefill financial information that includes the income year and net income for the 'incomeReceiver'`,
    () => {
      it('should render with content', () => {
        const { mockStore } = getDataWithNonPrefill();

        const { container } = render(
          <Provider store={mockStore}>{PreviousNetIncome('veteran')}</Provider>,
        );

        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your net income from ${LAST_YEAR}`);
      });
    },
  );
});
