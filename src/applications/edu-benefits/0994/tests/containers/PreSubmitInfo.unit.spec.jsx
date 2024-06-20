import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { commonReducer } from 'platform/startup/store';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

const fakeStore = createStore(
  combineReducers({
    ...commonReducer,
  }),
);

describe('<PreSubmitInfo>', () => {
  it('should render', () => {
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={{
            activeDuty: true,
          }}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
  it('should render else option', () => {
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={{
            activeDuty: false,
          }}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
});
