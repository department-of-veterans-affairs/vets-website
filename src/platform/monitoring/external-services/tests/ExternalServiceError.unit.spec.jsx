import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import {
  ExternalServicesError,
  mapStateToProps,
} from '../ExternalServicesError';

describe('<ExternalServicesError>', () => {
  const props = {
    dependencies: [],
    getBackendStatuses: sinon.spy(),
    shouldGetBackendStatuses: false,
    statuses: null,
  };

  it('should get backend statuses when mounted', () => {
    const wrapper = mount(
      <ExternalServicesError {...props} shouldGetBackendStatuses />,
    );
    expect(props.getBackendStatuses.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should not render anything when services are up', () => {
    const dependencies = ['mvi'];
    const statuses = [{ serviceId: 'mvi', status: 'active' }];
    const wrapper = shallow(
      <ExternalServicesError
        {...props}
        dependencies={dependencies}
        statuses={statuses}
      >
        <div id="error-message" />
      </ExternalServicesError>,
    );
    expect(wrapper.find('#error-message').exists()).to.be.false;
    wrapper.unmount();
  });

  it('should render anything when services are down', () => {
    const wrapper = shallow(
      <ExternalServicesError
        {...props}
        dependencies={['mvi']}
        statuses={[{ serviceId: 'mvi', status: 'down' }]}
      >
        <div id="error-message" />
      </ExternalServicesError>,
    );
    expect(wrapper.find('#error-message').exists()).to.be.true;
    wrapper.unmount();
  });
});

describe('mapStateToProps', () => {
  describe('shouldGetBackendStatuses', () => {
    it('should get backend statuses by default', () => {
      expect(
        mapStateToProps({
          externalServiceStatuses: {
            loading: false,
            statuses: null,
          },
        }).shouldGetBackendStatuses,
      ).to.be.true;
    });

    it('should not get backend statuses if a request is in progress', () => {
      expect(
        mapStateToProps({
          externalServiceStatuses: {
            loading: true,
            statuses: null,
          },
        }).shouldGetBackendStatuses,
      ).to.be.false;
    });

    it('should not get backend statuses if statuses have already been fetched', () => {
      expect(
        mapStateToProps({
          externalServiceStatuses: {
            loading: false,
            statuses: [{ serviceId: 'mvi', status: 'active' }],
          },
        }).shouldGetBackendStatuses,
      ).to.be.false;
    });
  });
});
