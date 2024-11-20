import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import Post911GIBStatusApp from '../../containers/Post911GIBStatusApp';
import reducer from '../../reducers/index';

const store = createCommonStore(reducer);

describe('<Post911GIBStatusApp>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={store}>
        <Post911GIBStatusApp />
      </Provider>,
    );
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });
  it('should render RequiredLoginView with correct props', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Post911GIBStatusApp />
      </Provider>,
    );

    const requiredLoginView = wrapper.find(RequiredLoginView);
    expect(requiredLoginView).to.have.lengthOf(1);
    expect(requiredLoginView.prop('serviceRequired')).to.equal(
      backendServices.EVSS_CLAIMS,
    );
    wrapper.unmount();
  });
});
