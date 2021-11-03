import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import ViewDependentsList from '../../components/ViewDependentsList/ViewDependentsList';
import removeDependents from '../../manage-dependents/redux/reducers';

describe('<ViewDependentsList />', () => {
  const onAwardSubhead = (
    <span>
      Dependents on award have been added to you disability claim.{' '}
      <strong>
        If a dependents status has changed, you need to let the VA know.
      </strong>
    </span>
  );

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
  };

  it('Should Render', () => {
    const screen = renderInReduxProvider(
      <ViewDependentsList
        header="Dependents on your VA benefits"
        subHeader={onAwardSubhead}
        isAward
      />,
      {
        mockState,
        reducers: removeDependents,
      },
    );

    expect(
      screen.findByRole('heading', { name: 'Dependents on your VA benefits' }),
    ).to.exist;
    expect(screen.findByText(/Cindy See/)).to.exist;
  });
});
