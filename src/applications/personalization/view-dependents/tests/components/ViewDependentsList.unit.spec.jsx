import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ViewDependentsList from '../../components/ViewDependentsList/ViewDependentsList';

describe('<ViewDependentsList />', () => {
  const onAwardSubhead = (
    <span>
      Dependents on award have been added to you disability claim.{' '}
      <strong>
        If a dependents status has changed, you need to let the VA know.
      </strong>
    </span>
  );

  const onAwardDependents = [
    {
      firstName: 'Cindy',
      lastName: 'See',
      ssn: '312-243-5634',
      dateOfBirth: '05-05-1953',
      relationship: 'Child',
    },
    {
      firstName: 'Billy',
      lastName: 'Blank',
      ssn: '123-45-6789',
      dateOfBirth: '05-05-1953',
      relationship: 'Child',
    },
  ];

  it('Should Render', () => {
    const wrapper = shallow(
      <ViewDependentsList
        loading={false}
        header="Dependents on award"
        subHeader={onAwardSubhead}
        dependents={onAwardDependents}
      />,
    );

    expect(wrapper.contains(<h2>Dependents on award</h2>)).to.equal(true);
    wrapper.unmount();
  });

  it('Should show a loading indicator while loading', () => {
    const wrapper = shallow(
      <ViewDependentsList
        loading
        header="Dependents on award"
        subHeader={onAwardSubhead}
        dependents={onAwardDependents}
      />,
    );

    expect(wrapper.find('.loading-indicator-container')).to.exist;
    wrapper.unmount();
  });
});
