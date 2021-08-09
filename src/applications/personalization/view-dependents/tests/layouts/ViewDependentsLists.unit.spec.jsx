import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import removeDependents from '../../manage-dependents/redux/reducers';
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
    const screen = renderInReduxProvider(<ViewDependentsLists />, {
      mockState,
      reducers: removeDependents,
    });

    expect(screen.findByText(/Billy Blank/)).to.exist;
  });
});
