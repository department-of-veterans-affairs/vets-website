import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ViewDependentsListItem from '../../components/ViewDependentsList/ViewDependentsListItem';

const mockData = {
  name: 'Cindy See',
  social: '312-243-5634',
  onAward: true,
  birthdate: '05-05-1953',
  spouse: true,
  age: 32,
};

describe('<ViewDependentsListItem />', () => {
  it('Should Render', () => {
    const wrapper = shallow(
      <ViewDependentsListItem
        key={1}
        name={mockData.name}
        spouse={mockData.spouse}
        onAward={mockData.onAward}
        social={mockData.social}
        birthdate={mockData.birthdate}
        age={mockData.age}
      />,
    );
    expect(
      wrapper.contains(
        <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
          Spouse
        </p>,
      ),
    ).to.equal(true);
    wrapper.unmount();
  });
});
