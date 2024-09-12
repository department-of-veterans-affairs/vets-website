import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';

import Standard5103Alert from '../../../components/claim-files-tab/Standard5103Alert';
import { renderWithRouter } from '../../utils';

const filesTab = 'files';
const statusTab = 'status';

describe('<Standard5103Alert>', () => {
  context('when user navigates to page directly', () => {
    it('should render va-alert with item data', () => {
      const { getByText } = renderWithRouter(<Standard5103Alert />);
      getByText('Review evidence list');
      getByText(
        'Review a list of evidence we may need to decide your claim (called a 5103 notice).',
      );
      getByText('Details');
      expect(sessionStorage.getItem('previousPage')).to.not.exist;
    });
  });

  context('when user navigates to page from the files tab', () => {
    it('clicking details link should set session storage', () => {
      const { getByRole } = renderWithRouter(
        <Standard5103Alert previousPage={filesTab} />,
      );

      fireEvent.click(getByRole('link'));

      expect(sessionStorage.getItem('previousPage')).to.equal(filesTab);
    });
  });

  context('when user navigates to page from the status tab', () => {
    it('clicking details link should set session storage', () => {
      const { getByRole } = renderWithRouter(
        <Standard5103Alert previousPage={statusTab} />,
      );

      fireEvent.click(getByRole('link'));

      expect(sessionStorage.getItem('previousPage')).to.equal(statusTab);
    });
  });
});
