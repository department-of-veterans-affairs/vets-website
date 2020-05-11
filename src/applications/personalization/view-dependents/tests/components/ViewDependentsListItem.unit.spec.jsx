import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
import ViewDependentsListItem from '../../components/ViewDependentsList/ViewDependentsListItem';

describe('<ViewDependentsListItem />', () => {
  const mockData = {
    firstName: 'Cindy',
    lastName: 'See',
    ssn: '312-243-5634',
    dateOfBirth: '05-05-1953',
    relationship: 'Child',
  };

  it('Should Render with all props visible', () => {
    const wrapper = render(
      <ViewDependentsListItem
        key={1}
        firstName={mockData.firstName}
        lastName={mockData.lastName}
        ssn={mockData.ssn}
        dateOfBirth={mockData.dateOfBirth}
        relationship={mockData.relationship}
      />,
    );

    expect(wrapper.text()).to.contain('Child');
    expect(wrapper.text()).to.contain('Cindy');
    expect(wrapper.text()).to.contain('See');
    expect(wrapper.text()).to.contain('312-243-5634');
    expect(wrapper.text()).to.contain('May 5, 1953');
  });
});
