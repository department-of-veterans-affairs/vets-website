import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import ViewDependentsList from '../../components/ViewDependentsList/ViewDependentsList';
import removeDependents from '../../manage-dependents/redux/reducers';

describe('<ViewDependentsList />', () => {
  const onAwardSubhead = (
    <span>
      Dependents on award have been added to your disability claim.{' '}
      <strong>
        If a dependent’s status has changed, you need to let the VA know.
      </strong>
    </span>
  );

  const dependents = [
    {
      firstName: 'Billy',
      lastName: 'Blank',
      ssn: '312-243-5634',
      relationship: 'Child',
      dateOfBirth: '1983-05-05',
    },
    {
      firstName: 'Cindy',
      lastName: 'See',
      ssn: '312-243-5634',
      relationship: 'Spouse',
      dateOfBirth: '1953-05-05',
    },
  ];

  it('should render the component with the provided dependents', async () => {
    const { findByRole, findByText } = renderInReduxProvider(
      <ViewDependentsList
        header="Dependents on your VA benefits"
        subHeader={onAwardSubhead}
        isAward
        link="https://example.com"
        linkText="Link Text"
        loading={false}
        dependents={dependents}
      />,
      {
        initialState: {
          removeDependents: {
            submittedDependents: [],
          },
        },
        reducers: removeDependents,
      },
    );

    expect(
      await findByRole('heading', {
        name: 'Dependents on your VA benefits',
      }),
    ).to.exist;
    expect(await findByText(/Cindy See/)).to.exist;
  });
});
