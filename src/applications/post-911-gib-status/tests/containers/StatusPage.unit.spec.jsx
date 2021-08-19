import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import StatusPage from '../../containers/StatusPage';

import reducer from '../../reducers/index.js';
import createCommonStore from 'platform/startup/store';

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
    expect(tree.find('.schemaform-title').text()).to.contain(
      'Post-9/11 GI Bill Statement of Benefits',
    );
    expect(tree.find('.usa-button-primary').text()).to.contain(
      'Get Printable Statement of Benefits',
    );
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
