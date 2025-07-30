import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import ViewDependentsLayout from '../../layouts/ViewDependentsLayout';
import removeDependents from '../../manage-dependents/redux/reducers';

describe('<ViewDependentsLayout />', () => {
  const mockState = {
    onAwardDependents: [
      {
        firstName: 'Billy',
        lastName: 'Blank',
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

  it('should render', async () => {
    const screen = renderInReduxProvider(
      <ViewDependentsLayout
        onAwardDependents={mockState.onAwardDependents}
        notOnAwardDependents={mockState.notOnAwardDependents}
      />,
      {
        mockState,
        reducers: removeDependents,
      },
    );

    expect(await screen.findByText(/Billy Blank/)).to.exist;
  });

  it('should show an info alert when there are no dependents', async () => {
    const screen = renderInReduxProvider(<ViewDependentsLayout />, {
      initialState: {},
      reducers: removeDependents,
    });

    expect(
      await screen.findByText(
        'We don’t have dependents information on file for you',
      ),
    ).to.exist;
  });

  it('should show an error alert when there is a 500 error', async () => {
    const screen = renderInReduxProvider(
      <ViewDependentsLayout error={{ code: 500 }} />,
      {
        initialState: {},
        reducers: removeDependents,
      },
    );

    expect(
      await screen.findByRole('heading', {
        name: 'We’re sorry. Something went wrong on our end',
      }),
    ).to.exist;
  });
});
