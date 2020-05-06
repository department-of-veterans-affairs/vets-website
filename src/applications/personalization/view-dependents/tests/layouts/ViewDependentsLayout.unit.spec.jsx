import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';

import createCommonStore from 'platform/startup/store';

import ViewDependentsLayout from '../../layouts/ViewDependentsLayout';

const defaultStore = createCommonStore();

describe('<ViewDependentsLayout />', () => {
  const mockState = {
    onAwardDependents: [
      {
        name: 'Billy Blank',
        social: '312-243-5634',
        onAward: true,
        birthdate: '05-05-1983',
      },
      {
        name: 'Cindy See',
        social: '312-243-5634',
        onAward: true,
        birthdate: '05-05-1953',
        spouse: true,
      },
    ],
    notOnAwardDependents: [
      {
        name: 'Frank Fuzzy',
        social: '312-243-5634',
        birthdate: '05-05-1953',
      },
    ],
  };

  it('should render', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <ViewDependentsLayout
          loading={false}
          error={false}
          onAwardDependents={mockState.onAwardDependents}
          notOnAwardDependents={mockState.notOnAwardDependents}
        />
      </Provider>,
    );

    expect(wrapper.find('div.large-screen:vads-u-padding-left--6')).to.exist;
    wrapper.unmount();
  });

  it('should show an info alert when there are no dependents', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <ViewDependentsLayout
          loading={false}
          error={false}
          onAwardDependents={null}
          notOnAwardDependents={null}
        />
      </Provider>,
    );

    expect(wrapper.find('div.usa-alert-info')).to.exist;
    wrapper.unmount();
  });

  it('should show an info alert when there is a 400 error', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <ViewDependentsLayout
          loading={false}
          error={400}
          onAwardDependents={mockState.onAwardDependents}
          notOnAwardDependents={mockState.notOnAwardDependents}
        />
      </Provider>,
    );

    expect(wrapper.find('div.usa-alert-info')).to.exist;
    wrapper.unmount();
  });

  it('should show an error alert when there is a 500 error', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <ViewDependentsLayout
          loading={false}
          error={500}
          onAwardDependents={mockState.onAwardDependents}
          notOnAwardDependents={mockState.notOnAwardDependents}
        />
      </Provider>,
    );

    expect(wrapper.find('div.usa-alert-error')).to.exist;
    wrapper.unmount();
  });
});
