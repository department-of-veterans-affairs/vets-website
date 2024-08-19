import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import createCommonStore from 'platform/startup/store';
import StatusPage from '../../containers/StatusPage';

import reducer from '../../reducers/index.js';

const store = createCommonStore(reducer);
const defaultProps = store.getState();
defaultProps.post911GIBStatus = {
  enrollmentData: {
    veteranIsEligible: true,
    dateOfBirth: '1995-11-12T06:00:00.000+0000',
    remainingEntitlement: {},
    originalEntitlement: {},
    usedEntitlement: {},
  },
};

describe('<StatusPage>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    const vdom = tree.html();
    expect(vdom).to.exist;
    tree.unmount();
  });

  it('should show title and print button', () => {
    window.dataLayer = [];
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    expect(tree.find('h1').text()).to.equal(
      'Your Post-9/11 GI Bill Statement of Benefits',
    );

    expect(tree.find({ text: 'Get printable statement of benefits' }).exists());

    tree.unmount();
  });

  it('should not show intro and print button if veteran is not eligible', () => {
    const props = {
      enrollmentData: {
        veteranIsEligible: false,
        dateOfBirth: '1995-11-12T06:00:00.000+0000',
        originalEntitlement: {},
        usedEntitlement: {},
        remainingEntitlement: {},
      },
    };

    const tree = shallow(<StatusPage store={store} {...props} />);
    expect(tree.find('.va-introtext').exists()).to.be.false;
    expect(tree.find('.usa-button-primary').exists()).to.be.false;
    tree.unmount();
  });
});
