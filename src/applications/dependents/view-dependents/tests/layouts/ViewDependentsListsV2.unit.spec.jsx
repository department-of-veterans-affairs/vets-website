import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import removeDependents from '../../manage-dependents/redux/reducers';
import ViewDependentsLists from '../../layouts/ViewDependentsListsV2';

describe('<ViewDependentsListsV2 />', () => {
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
        showDependentsContent
      />,
      {
        reducers: removeDependents,
      },
    );

    expect(await screen.findByText(/Billy Blank/)).to.exist;
    expect(await screen.findByText(/Frank Fuzzy/)).to.exist;
    expect(await screen.container.querySelectorAll('va-card')).to.have.lengthOf(
      2,
    );
    expect(
      await screen.container.querySelector('va-link-action[type="secondary"]'),
    ).to.exist;
  });

  it('should not render action link', async () => {
    const screen = renderInReduxProvider(
      <ViewDependentsLists
        onAwardDependents={[]}
        notOnAwardDependents={mockState.notOnAwardDependents}
        showDependentsContent={false}
      />,
      {
        reducers: removeDependents,
      },
    );

    expect(await screen.findByText(/Frank Fuzzy/)).to.exist;
    expect(await screen.container.querySelectorAll('va-card')).to.have.lengthOf(
      1,
    );
    expect(
      await screen.container.querySelector('va-link-action[type="secondary"]'),
    ).to.exist;
  });
});
