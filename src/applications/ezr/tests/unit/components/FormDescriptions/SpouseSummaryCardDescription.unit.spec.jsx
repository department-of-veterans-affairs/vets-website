import { expect } from 'chai';
import React from 'react';
import SpouseSummaryCardDescription, {
  maritalStatusesWithDateOfMarriage,
} from '../../../../components/FormDescriptions/SpouseSummaryCardDescription';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <SpouseSummaryCardDescription>', () => {
  maritalStatusesWithDateOfMarriage.forEach(status => {
    context(
      `when marital status is ${status} and there is NO MARRIAGE DATE`,
      () => {
        it(`should render the marital status and 'Date of Marriage:' (no date)`, () => {
          const { container } = renderProviderWrappedComponent(
            {
              form: {
                data: {
                  'view:maritalStatus': {
                    maritalStatus: status,
                  },
                  spouseInformation: [{}],
                },
              },
            },
            <SpouseSummaryCardDescription />,
          );
          const ul = container.querySelector('ul');
          const items = Array.from(ul.children);
          const match = items.filter(i =>
            i.textContent.includes('Date of Marriage:'),
          );
          expect(match.length).to.be.greaterThan(0);
        });
      },
    );
  });

  maritalStatusesWithDateOfMarriage.forEach(status => {
    context(
      `when marital status is ${status} and there IS a marriage date`,
      () => {
        it('should render the marital status and the date of marriage', () => {
          const { container } = renderProviderWrappedComponent(
            {
              form: {
                data: {
                  'view:maritalStatus': {
                    maritalStatus: status,
                  },
                  spouseInformation: [
                    {
                      dateOfMarriage: '1995-02-22',
                    },
                  ],
                },
              },
            },
            <SpouseSummaryCardDescription />,
          );
          const ul = container.querySelector('ul');
          const items = Array.from(ul.children);
          const match = items.filter(i =>
            i.textContent.includes('Date of Marriage: 1995-02-22'),
          );
          expect(match.length).to.be.greaterThan(0);
        });
      },
    );
  });

  context(`when marital status is single`, () => {
    it('should render ONLY the marital status', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'never married',
              },
              spouseInformation: [
                {
                  dateOfMarriage: '1995-02-22',
                },
              ],
            },
          },
        },
        <SpouseSummaryCardDescription />,
      );
      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal(`never married`);
    });
  });
});
