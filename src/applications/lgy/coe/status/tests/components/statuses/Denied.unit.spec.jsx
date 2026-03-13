import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Denied from '../../../components/statuses/Denied';

const mockStore = state => createStore(() => state);
const store = mockStore({});

describe('Denied', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <Denied />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
