import { expect } from 'chai';
import React from 'react';
import SpouseSummaryCardDescription from '../../../../components/FormDescriptions/SpouseSummaryCardDescription';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <SpouseSummaryCardDescription>', () => {
  context('when item is null', () => {
    it('should still render the marital status', () => {
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
        <SpouseSummaryCardDescription item={null} />,
      );

      // Component renders marital status regardless of item prop
      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal('married');
    });
  });

  context('when item is not null and marital status is married', () => {
    it('should render the marital status', () => {
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
        <SpouseSummaryCardDescription item={{}} />,
      );

      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal('married');
    });
  });

  context('when item is not null and marital status is separated', () => {
    it('should render the marital status', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'separated',
              },
            },
          },
        },
        <SpouseSummaryCardDescription item={{}} />,
      );

      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal('separated');
    });
  });

  context('when item is not null and marital status is divorced', () => {
    it('should render the marital status', () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data: {
              'view:maritalStatus': {
                maritalStatus: 'divorced',
              },
            },
          },
        },
        <SpouseSummaryCardDescription item={{}} />,
      );

      expect(container).to.not.be.empty;
      expect(container.textContent.trim()).to.equal('divorced');
    });
  });
});
