import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import UploadPage, { handleRouteChange } from '../../containers/UploadPage';

describe('UploadPage', () => {
  const getStore = () => ({
    getState: () => {},
    subscribe: () => {},
    dispatch: () => {},
  });

  const renderPage = () =>
    render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={['/21-0779']}>
          <Route path="/:id">
            <UploadPage />
          </Route>
        </MemoryRouter>
      </Provider>,
    );

  it('should render a header and breadcrumbs', () => {
    const { container, getByRole } = renderPage();

    expect(getByRole('heading', { level: 1 }).textContent).to.contain(
      'Upload VA Form 21-0779',
    );
    expect(
      container.querySelector('va-breadcrumbs').breadcrumbList.length,
    ).to.eq(3);
  });

  it('should handle route changes correctly', () => {
    const history = [];

    handleRouteChange({ detail: { href: 'test-href' } }, history);

    expect(history.length).to.equal(1);
    expect(history[0]).to.equal('test-href');
  });
});
