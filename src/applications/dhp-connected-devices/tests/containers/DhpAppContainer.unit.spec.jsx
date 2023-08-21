import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { shallow } from 'enzyme';
import { DhpAppContainer } from '../../containers/DhpAppContainer';

describe('Digital Health Pathway root page', () => {
  it('renders the not found page when feature is turned off', () => {
    const dhpContainer = renderInReduxProvider(
      <DhpAppContainer
        isFeatureToggleLoading={false}
        showConnectedDevicesPage={false}
      />,
    );
    const title = 'Sorry — we can’t find that page';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  it('renders the connect your devices page when feature is turned on', () => {
    const dhpContainer = renderInReduxProvider(
      <DhpAppContainer
        isFeatureToggleLoading={false}
        showConnectedDevicesPage
      />,
    );
    const title = 'Connect your health devices to share data';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  it('renders the va loading indicator when feature toggle is still loading', () => {
    const wrapper = shallow(
      <DhpAppContainer isFeatureToggleLoading showConnectedDevicesPage />,
      {
        disableLifecycleMethods: true,
      },
    );
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(loadingIndicator.length).to.equal(1);
    wrapper.unmount();
  });
});
