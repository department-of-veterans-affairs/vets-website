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
    expect(tree).to.not.be.undefined;
    // removed test while envirnoment variable is in code base for PreSubmitInfo.jsx. This causes issue where test can not read text as expected.
    // tested with environment statement removed, all test passed as they should. Environment statement is only there to keep new radiobuttons
    // in staging until testing is completed.
    // expect(tree.text()).to.include('Confirm you’re eligible for VRRAP');
    expect(tree.text()).to.contain('privacy policy');
    tree.unmount();
  });
});
