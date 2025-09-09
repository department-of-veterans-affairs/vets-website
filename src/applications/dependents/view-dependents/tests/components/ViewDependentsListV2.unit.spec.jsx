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

  const mockStore = {
    getState: () => ({
      removeDependents: {
        submittedDependents: [],
        openFormlett: false,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const defaultProps = {
    header: 'Dependents on your VA benefits',
    subHeader: onAwardSubhead,
    isAward: true,
    link: 'https://example.com',
    linkText: 'Link Text',
    loading: false,
    manageDependentsToggle: true,
  };

  const renderComponent = (dependents, props = {}) => {
    return renderInReduxProvider(
      <ViewDependentsList
        {...defaultProps}
        {...props}
        dependents={dependents}
      />,
      {
        store: mockStore,
        reducers: removeDependents,
      },
    );
  };

  const createDateString = date => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const createChildTurning18 = daysFromNow => {
    const upcomingBirthday = new Date();
    upcomingBirthday.setDate(upcomingBirthday.getDate() + daysFromNow);

    const birthDate = new Date(upcomingBirthday);
    birthDate.setFullYear(birthDate.getFullYear() - 18);

    return {
      firstName: 'Billy',
      lastName: 'Blank',
      ssn: '3122435634',
      relationship: 'Child',
      dateOfBirth: createDateString(birthDate),
      upcomingRemoval: createDateString(upcomingBirthday),
    };
  };

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
    const { container } = renderComponent(dependents);

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

  it('should show upcoming removal alert when removal date is within 90 days', () => {
    const dependentsWithUpcomingRemoval = [createChildTurning18(45)];
    const { container } = renderComponent(dependentsWithUpcomingRemoval);

    expect($('va-alert', container)).to.exist;
    expect($('va-alert p', container).textContent).to.include(
      'We’ll remove this child from your disability benefits when they turn 18',
    );
  });

  it('should not show upcoming removal alert when removal date is beyond 90 days', () => {
    const dependentsWithDistantRemoval = [createChildTurning18(120)];
    const { container } = renderComponent(dependentsWithDistantRemoval);

    expect($('va-alert', container)).to.not.exist;
  });
});
