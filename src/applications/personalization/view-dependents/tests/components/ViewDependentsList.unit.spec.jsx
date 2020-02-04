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
  ];

  const emptyDependents = [];

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

  it('Should show a message that the list is empty when no dependents are passed in', () => {
    const wrapper = shallow(
      <ViewDependentsList
        loading={false}
        header="Dependents on award"
        subHeader={onAwardSubhead}
        dependents={emptyDependents}
      />,
    );

    expect(wrapper.contains(<p>No dependents in this list.</p>)).to.equal(true);
    wrapper.unmount();
  });
});
