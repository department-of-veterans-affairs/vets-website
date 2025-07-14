import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import NotInGoodStanding from '../../../../components/01-personal-information-chapter/NotInGoodStanding';

describe('NotInGoodStanding', () => {
  it('renders the alert headline, message, and navigation buttons', () => {
    const { getByText, container } = render(
      <NotInGoodStanding goToPath={() => {}} />,
    );

    expect(
      getByText(
        'You must be in good standing with the bar to become accredited.',
      ),
    ).to.exist;
    expect(
      getByText(
        /In order to be accredited by VA as an attorney, an individual must be a member in good standing of the bar of the highest court of a state or territory of the United States\./,
        { exact: false },
      ),
    ).to.exist;

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).to.be.greaterThan(0);
  });
});
