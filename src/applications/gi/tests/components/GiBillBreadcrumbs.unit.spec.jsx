import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import GiBillBreadcrumbs from '../../components/GiBillBreadcrumbs';

const defaultStore = createCommonStore();

describe('CT Breadcrumbs', () => {
  it('Renders', () => {
    const { findByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );
    expect(findByText('GI Bill® Comparison Tool')).to.exist;
  });
});
