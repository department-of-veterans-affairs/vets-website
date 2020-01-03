import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import ViewDependentsLists from '../../layouts/ViewDependentsLists';

describe('<ViewDependentsLists />', () => {
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
      <ViewDependentsLists
        loading={false}
        onAwardDependents={mockState.onAwardDependents}
        notOnAwardDependents={mockState.notOnAwardDependents}
      />,
    );

    expect(wrapper.find('ViewDependentsList').length).to.equal(2);
    wrapper.unmount();
  });
});
