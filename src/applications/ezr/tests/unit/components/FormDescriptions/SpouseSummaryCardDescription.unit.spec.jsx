import { expect } from 'chai';
import React from 'react';
import SpouseSummaryCardDescription from '../../../../components/FormDescriptions/SpouseSummaryCardDescription';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <SpouseSummaryCardDescription>', () => {
  context('when item is not null and marital status is married', () => {
    it('should render the marital status ONLY', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'married',
              },
            },
          },
        },
        <SpouseSummaryCardDescription />,
      );

      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal('married');
    });
  });

  context('when item is not null and marital status is married', () => {
    it('should render the marital status ONLY', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'single',
              },
            },
          },
        },
        <SpouseSummaryCardDescription />,
      );
      expect(container).to.be.empty;
    });
  });

  context('when item is not null and marital status is divorced', () => {
    it('should render the marital statu and date', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'divorced',
              },
              dateOfMarriage: '1995-02-22',
            },
          },
        },
        <SpouseSummaryCardDescription />,
      );

      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal(
        'divorced Date of Marriage: 1995-02-22',
      );
    });
  });
});
