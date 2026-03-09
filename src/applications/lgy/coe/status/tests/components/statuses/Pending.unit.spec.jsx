import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Pending from '../../../components/statuses/Pending';

const mockStore = state => createStore(() => state);
const store = mockStore({});

describe('Pending', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <Pending />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
  });
  it('should render document uploader', () => {
    const { container } = render(
      <Provider store={store}>
        <Pending uploadsNeeded />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
    expect($('va-file-input', container)).to.exist;
  });
});
