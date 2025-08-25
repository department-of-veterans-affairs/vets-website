import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ViewDependentsList from '../../components/ViewDependentsList/ViewDependentsListV2';
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
      ssn: '3122435634',
      relationship: 'Child',
      dateOfBirth: '05/05/2018',
    },
    {
      firstName: 'Cindy',
      lastName: 'See',
      ssn: '3122435635',
      relationship: 'Spouse',
      dateOfBirth: '05/06/1993',
    },
  ];

  it('should render the component with the provided dependents', () => {
    const { container } = renderInReduxProvider(
      <ViewDependentsList
        header="Dependents on your VA benefits"
        subHeader={onAwardSubhead}
        isAward
        link="https://example.com"
        linkText="Link Text"
        loading={false}
        dependents={dependents}
        manageDependentsToggle
      />,
      {
        store: {
          getState: () => ({
            removeDependents: {
              submittedDependents: [],
              openFormlett: false,
            },
          }),
          subscribe: () => {},
          dispatch: () => {},
        },
        reducers: removeDependents,
      },
    );

    expect($$('va-card', container).length).to.equal(2);
    expect($('h2', container).textContent).to.eq(
      'Dependents on your VA benefits',
    );

    expect($$('h3', container).map(el => el.textContent)).to.deep.equal([
      'Billy Blank',
      'Cindy See',
    ]);

    expect($$('dd', container).map(el => el.textContent)).to.deep.equal([
      'Child',
      'May 5, 2018',
      '7 years old',
      '●●●–●●-5634ending with 5 6 3 4',
      'Spouse',
      'May 6, 1993',
      '32 years old',
      '●●●–●●-5635ending with 5 6 3 5',
    ]);

    expect(
      $$('va-button[text="Remove this dependent"]', container).length,
    ).to.equal(2);
  });
});
