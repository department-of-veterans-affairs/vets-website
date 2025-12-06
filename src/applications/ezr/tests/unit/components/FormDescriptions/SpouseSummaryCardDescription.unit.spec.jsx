import { expect } from 'chai';
import React from 'react';
import SpouseSummaryCardDescription, {
  spousedStatusesToHideDate,
} from '../../../../components/FormDescriptions/SpouseSummaryCardDescription';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <SpouseSummaryCardDescription>', () => {
  spousedStatusesToHideDate.forEach(status => {
    context(
      `when marital status is ${status} and there is NO MARRIAGE DATE`,
      () => {
        it('should render the marital status and a blank date of marriage', () => {
          const { container } = renderProviderWrappedComponent(
            {
              form: {
                data: {
                  'view:maritalStatus': {
                    maritalStatus: status,
                  },
                },
              },
            },
            <SpouseSummaryCardDescription />,
          );
          expect(container).to.not.be.empty;
          expect(container.textContent.trim()).to.equal(
            `${status} Date of Marriage:`,
          );
        });
      },
    );
  });

  spousedStatusesToHideDate.forEach(status => {
    context(
      `when marital status is ${status} and there IS a marriage date`,
      () => {
        it('should render the marital status and a blank date of marriage', () => {
          const { container } = renderProviderWrappedComponent(
            {
              form: {
                data: {
                  'view:maritalStatus': {
                    maritalStatus: status,
                  },
                  dateOfMarriage: '1995-02-22',
                },
              },
            },
            <SpouseSummaryCardDescription />,
          );
          expect(container).to.not.be.empty;
          expect(container.textContent.trim()).to.equal(
            `${status} Date of Marriage: 1995-02-22`,
          );
        });
      },
    );
  });

  context(`when marital status is single`, () => {
    it('should render the marital status and a blank date of marriage', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'never married',
              },
              dateOfMarriage: '1995-02-22',
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
