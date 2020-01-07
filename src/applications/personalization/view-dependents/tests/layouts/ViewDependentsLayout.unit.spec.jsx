import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import ViewDependentsLayout from '../../layouts/ViewDependentsLayout';

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
      <ViewDependentsLayout
        loading={false}
        error={false}
        onAwardDependents={mockState.onAwardDependents}
        notOnAwardDependents={mockState.notOnAwardDependents}
      />,
    );

    expect(wrapper.find('div.large-screen:vads-u-padding-left--6')).to.exist;
    wrapper.unmount();
  });
});
