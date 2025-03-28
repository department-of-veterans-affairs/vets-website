import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
  PreviousFuneralExpenses,
} from '../../../../components/FormDescriptions/ExpensesDescriptions';
import { LAST_YEAR } from '../../../../utils/constants';
import mockPrefillWithNonPrefillData from '../../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';

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

describe('ezr <EducationalExpensesDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        const { mockStore } = getData();
        const { container } = render(
          <Provider store={mockStore}>
            {EducationalExpensesDescription()}
          </Provider>,
        );
        expect(container).to.not.be.empty;
      });
    },
  );

  context(
    'when the component renders and there is nonPrefill financial information that includes the income year and education expenses',
    () => {
      it('should render with content', () => {
        const { mockStore } = getDataWithNonPrefill();

        const { container } = render(
          <Provider store={mockStore}>
            {EducationalExpensesDescription()}
          </Provider>,
        );

        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your education expenses from ${LAST_YEAR}`);
        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your education expenses from ${LAST_YEAR}`);
      });
    },
  );
});

describe('ezr <MedicalExpensesDescription>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should render with content', () => {
        const { mockStore } = getData();
        const { container } = render(
          <Provider store={mockStore}>{MedicalExpensesDescription()}</Provider>,
        );
        expect(container).to.not.be.empty;
      });
    },
  );

  context(
    'when the component renders and there is nonPrefill financial information that includes the income year and medical expenses',
    () => {
      it('should render with content', () => {
        const { mockStore } = getDataWithNonPrefill();

        const { container } = render(
          <Provider store={mockStore}>{MedicalExpensesDescription()}</Provider>,
        );

        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your non-reimbursable medical expenses from ${LAST_YEAR}`);
      });
    },
  );
});

describe('ezr <PreviousFuneralExpenses>', () => {
  context(
    'when the component renders and there is no nonPrefill financial information',
    () => {
      it('should not render', () => {
        const { mockStore } = getData();
        const { container } = render(
          <Provider store={mockStore}>{PreviousFuneralExpenses()}</Provider>,
        );
        expect(container).be.empty;
      });
    },
  );

  context(
    'when the component renders and there is nonPrefill financial information that includes the income year and funeral expenses',
    () => {
      it('should render with content', () => {
        const { mockStore } = getDataWithNonPrefill();

        const { container } = render(
          <Provider store={mockStore}>{PreviousFuneralExpenses()}</Provider>,
        );

        expect(container).to.not.be.empty;
        expect(container.querySelector('va-card')).to.exist;
        expect(
          container.querySelector('va-card h4').textContent.trim(),
        ).to.equal(`Your funeral and burial expenses from ${LAST_YEAR}`);
      });
    },
  );
});
