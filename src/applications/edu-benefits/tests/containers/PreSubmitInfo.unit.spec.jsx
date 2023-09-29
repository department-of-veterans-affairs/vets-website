import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

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
    const tree = mount(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={{}}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const checkbox = tree.find('va-privacy-agreement');

    expect(tree).to.not.be.undefined;
    expect(checkbox.length).to.equal(1);
    tree.unmount();
  });
});
