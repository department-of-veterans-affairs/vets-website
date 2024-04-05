import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { fireEvent, createEvent } from '@testing-library/dom';
import { renderWithRouter } from '../utils';
import sinon from 'sinon';
import ClaimSyncWarning from '../../components/ClaimSyncWarning';

describe('<ClaimSyncWarning>', () => {
  describe('when olderVersion is false', () => {
    it('should render component', () => {
      const { container, getByText, queryByText } = renderWithRouter(
        <ClaimSyncWarning />,
      );

      getByText('Claim status is temporarily down');
      expect(
        queryByText(
          'This is an older version of your claim and may be outdated.',
        ),
      ).to.not.exist;
      expect($('va-button', container).getAttribute('text')).to.equal(
        'Refresh the page',
      );
    });

    // it.only('should reload page when button clicked', () => {
    //   const p = document.createElement('p');
    //   p.textContent = 'Test Reloading';
    //   document.body.appendChild(p);
    //   const { container, getByText, queryByText } = renderWithRouter(
    //     <ClaimSyncWarning />,
    //   );

    //   getByText('Test Reloading');

    //   fireEvent.click($('va-button', container));
    //   getByText('Test Reloading');

    //   expect(queryByText('Test Reloading')).to.not.exist;
    //   expect(test.preventDefault()).toBe.called;
    //   expect(container.test).to.not.exist;
    // });
  });

  describe('when olderVersion is true', () => {
    it('should render component', () => {
      const { container, getByText } = renderWithRouter(
        <ClaimSyncWarning olderVersion />,
      );

      getByText('Claim status is temporarily down');
      getByText(
        'Please refresh the page or try again later. This is an older version of your claim and may be outdated.',
      );
      expect($('va-button', container).getAttribute('text')).to.equal(
        'Refresh the page',
      );
    });
  });
});
