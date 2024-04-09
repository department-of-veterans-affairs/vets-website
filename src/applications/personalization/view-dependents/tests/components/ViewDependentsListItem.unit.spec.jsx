import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import ViewDependentsListItem from '../../components/ViewDependentsList/ViewDependentsListItem';
import removeDependents from '../../manage-dependents/redux/reducers';

describe('<ViewDependentsListItem />', () => {
  const mockData = {
    firstName: 'Cindy',
    lastName: 'See',
    ssn: '312-243-5634',
    dateOfBirth: '05-05-1953',
    relationship: 'Child',
  };

  it('Should Render with all props visible', async () => {
    const screen = renderInReduxProvider(
      <ViewDependentsListItem {...mockData} />,
      {
        reducers: removeDependents,
      },
    );

    expect(await screen.findByText(/Cindy See/)).to.exist;
  });
});
