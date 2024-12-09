import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import FilesNeeded from '../../../components/claim-files-tab/FilesNeeded';
import { renderWithRouter } from '../../utils';

const getStore = (cst5103UpdateEnabled = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_5103_update_enabled: cst5103UpdateEnabled,
    },
  }));

const item = {
  id: 1,
  displayName: 'Request 1',
  description: 'This is a alert',
  suspenseDate: '2024-12-01',
};

const filesTab = 'files';
const statusTab = 'status';

describe('<FilesNeeded>', () => {
  context('when user navigates to page directly', () => {
    it('should render va-alert with item data and show DueDate', () => {
      const { getByText } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesNeeded item={item} />
        </Provider>,
      );

      getByText('December 1, 2024', { exact: false });
      getByText(item.displayName);
      getByText(item.description);
      getByText('Details');
      expect(sessionStorage.getItem('previousPage')).to.not.exist;
    });

    context('when item type is Automated 5103 Notice Response', () => {
      const item5103 = {
        displayName: 'Automated 5103 Notice Response',
        description: 'Test description',
        suspenseDate: '2024-12-01',
      };

      context('when evidenceWaiverSubmitted5103 is false', () => {
        it('should render va-alert with item data and hide DueDate', () => {
          const { queryByText, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <FilesNeeded item={item5103} />
            </Provider>,
          );

          expect(queryByText('December 1, 2024')).to.not.exist;
          expect(
            queryByText(
              'We sent you a “List of evidence we may need (5103 notice)” letter. This letter lets you know if submitting additional evidence will help decide your claim.',
            ),
          ).to.exist;
          expect(queryByText('Review evidence list (5103 notice)')).to.exist;
          getByText('Details');
        });
      });
    });
  });

  context('when user navigates to page from the files tab', () => {
    it('clicking details link should set session storage', () => {
      const { getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesNeeded item={item} previousPage={filesTab} />
        </Provider>,
      );

      fireEvent.click(getByRole('link'));

      expect(sessionStorage.getItem('previousPage')).to.equal(filesTab);
    });
  });

  context('when user navigates to page from the status tab', () => {
    it('clicking details link should set session storage', () => {
      const { getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesNeeded item={item} previousPage={statusTab} />
        </Provider>,
      );

      fireEvent.click(getByRole('link'));

      expect(sessionStorage.getItem('previousPage')).to.equal(statusTab);
    });
  });
});
