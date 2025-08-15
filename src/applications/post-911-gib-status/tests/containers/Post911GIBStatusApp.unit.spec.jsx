import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import reducer from '../../reducers/index';
import Post911GIBStatusApp, {
  AppContent,
} from '../../containers/Post911GIBStatusApp';

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

describe('<Post911GIBStatusApp>', () => {
  afterEach(() => {
    window.dataLayer = [];
  });

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
});

describe('<AppContent>', () => {
  it('should render the unregistered message when isDataAvailable is false', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(
      <AppContent isDataAvailable={false}>
        <div className="child">Test Child</div>
      </AppContent>,
    );
    // When isDataAvailable is false, the view should contain the hotline message
    expect(wrapper.find('h4').text()).to.contain(
      'If none of the above situations applies to you',
    );
    expect(wrapper.find('a[href="tel:8884424551"]').exists()).to.be.true;
    // The child should not be rendered in this branch
    expect(wrapper.find('.child').exists()).to.be.false;
  });

  it('should render children when isDataAvailable is not false', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(
      <AppContent isDataAvailable>
        <div className="child">Test Child</div>
      </AppContent>,
    );
    // When isDataAvailable is true, children should be rendered directly
    expect(wrapper.find('.child').exists()).to.be.true;
    // And the unregistered message should not be present
    expect(wrapper.find('h4').exists()).to.be.false;
  });

  it('should render children when isDataAvailable is undefined', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(
      <AppContent>
        <div className="child">Test Child</div>
      </AppContent>,
    );
    // Default behavior should render children when isDataAvailable is not explicitly false
    expect(wrapper.find('.child').exists()).to.be.true;
    expect(wrapper.find('h4').exists()).to.be.false;
  });
});
