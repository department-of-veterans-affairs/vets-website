import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import ViewDependentsLayout from '../../layouts/ViewDependentsLayout';
import removeDependents from '../../manage-dependents/redux/reducers';

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
    const screen = renderInReduxProvider(<ViewDependentsLayout />, {
      mockState,
      reducers: removeDependents,
    });

    expect(screen.findByText(/Billy Blank/)).to.exist;
  });

  it('should show an info alert when there are no dependents', () => {
    const screen = renderInReduxProvider(<ViewDependentsLayout />, {
      initialState: {},
      reducers: removeDependents,
    });

    expect(
      screen.findByRole('heading', {
        name: 'We don’t have dependents information on file for you',
      }),
    ).to.exist;
  });

  it('should show an error alert when there is a 500 error', () => {
    const screen = renderInReduxProvider(<ViewDependentsLayout />, {
      initialState: {
        errors: [
          {
            code: 500,
          },
        ],
      },
      reducers: removeDependents,
    });

    expect(
      screen.findByRole('heading', {
        name: 'We’re sorry. Something went wrong on our end',
      }),
    ).to.exist;
  });
});
