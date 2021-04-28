import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PreSubmitInfo from '../../containers/PreSubmitInfo';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { commonReducer } from 'platform/startup/store';

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
    expect(tree).to.not.be.undefined;
    expect(tree.text()).to.contain('By submitting this form you certify');
    expect(tree.text()).to.contain('privacy policy');

    tree.unmount();
  });
});
