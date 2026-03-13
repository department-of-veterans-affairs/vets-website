import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Available from '../../../components/statuses/Available';

const mockStore = state => createStore(() => state);
const store = mockStore({});

describe('Available', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <Available />
      </Provider>,
    );
    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
