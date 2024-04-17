import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import removeDependents from '../../manage-dependents/redux/reducers';
import ViewDependentsLists from '../../layouts/ViewDependentsLists';

describe('<ViewDependentsLists />', () => {
  const mockState = {
    onAwardDependents: [
      {
        firstName: 'Billy',
        lastName: 'Blank',
        social: '312-243-5634',
        onAward: true,
        birthdate: '05-05-1983',
      },
    ],
    notOnAwardDependents: [
      {
        firstName: 'Frank',
        lastName: 'Fuzzy',
        social: '312-243-5634',
        birthdate: '05-05-1953',
      },
    ],
  };

  it('should render', async () => {
    const screen = renderInReduxProvider(
      <ViewDependentsLists
        onAwardDependents={mockState.onAwardDependents}
        notOnAwardDependents={mockState.notOnAwardDependents}
      />,
      {
        reducers: removeDependents,
      },
    );

    expect(await screen.findByText(/Billy Blank/)).to.exist;
  });
});
