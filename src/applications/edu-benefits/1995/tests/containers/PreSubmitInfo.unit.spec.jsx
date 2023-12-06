import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { commonReducer } from 'platform/startup/store';
import PreSubmitInfo, { isActiveDuty } from '../../containers/PreSubmitInfo';

const fakeStore = createStore(
  combineReducers({
    ...commonReducer,
  }),
);

describe('isActiveDuty', () => {
  it('should always return false until we implement the functionality', () => {
    expect(isActiveDuty()).to.be.false;
  });
});

describe('<PreSubmitInfo>', () => {
  it('should render', () => {
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={{}}
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
