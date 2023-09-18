import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import PensionsApp from '../PensionsApp';

const store = ({ pensionFormEnabled = true, loading = true } = {}) => ({
  getState: () => ({
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      pension_form_enabled: pensionFormEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe.skip('PensionsApp', () => {
  it('should show VA loading indicator', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <PensionsApp />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should show VA loading indicator', () => {
    const mockStore = store({ loading: false });
    global.window.location.pathname = '/banana';
    const { container } = render(
      <Provider store={mockStore}>
        <PensionsApp />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.not.exist;
  });
});
