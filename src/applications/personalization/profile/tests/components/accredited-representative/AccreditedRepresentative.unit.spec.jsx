import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AccreditedRepresentative from '../../../components/accredited-representative/AccreditedRepresentative';

const mockStore = configureStore([]);

describe('<AccreditedRepresentative />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      vaProfile: {
        powerOfAttorney: {
          data: { id: 'representative-id' },
        },
      },
    });
  });

  it('should render representative-related content when powerOfAttorney exists', () => {
    const wrapper = mount(
      <Provider store={store}>
        <AccreditedRepresentative />
      </Provider>,
    );

    const h3 = wrapper.find('h3');
    expect(h3.text()).to.equal('How to replace your current representative');

    expect(
      wrapper.find('[data-widget-type="representative-status"]').length,
    ).to.equal(1);

    expect(wrapper.find('va-link').props().href).to.include(
      environment.BASE_URL,
    );
    wrapper.unmount();
  });

  it('should render no representative-related content when powerOfAttorney does not exist', () => {
    store = mockStore({
      vaProfile: {
        powerOfAttorney: { data: null },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <AccreditedRepresentative />
      </Provider>,
    );

    const p = wrapper.find('p').first();
    expect(p.text()).to.equal('You don’t have an accredited representative.');

    expect(wrapper.find('va-link').props().href).to.include(
      environment.BASE_URL,
    );
    wrapper.unmount();
  });

  it('should call repStatusLoader when there is a representative', () => {
    const repStatusLoaderSpy = sinon.spy(
      require('platform/user/widgets/representative-status'),
      'default',
    );
    const wrapper = mount(
      <Provider store={store}>
        <AccreditedRepresentative />
      </Provider>,
    );

    expect(repStatusLoaderSpy.calledOnce).to.be.true;
    repStatusLoaderSpy.restore();
    wrapper.unmount();
  });
});
