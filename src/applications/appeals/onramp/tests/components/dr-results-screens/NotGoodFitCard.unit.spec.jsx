import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import NotGoodFitCard from '../../../components/dr-results-screens/NotGoodFitCard';
import * as utils from '../../../utilities/dr-results-content-utils';

describe('NotGoodFitCard', () => {
  const card = 'CARD_HLR';
  const formResponses = { foo: 'bar' };
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(utils, 'getCardTitle').returns('Higher-Level Review');
    sandbox.stub(utils, 'getCardContent').returns(
      <ul>
        <li>
          You can’t submit new and relevant evidence for this type of review
        </li>
      </ul>,
    );

    sandbox
      .stub(utils, 'getLearnMoreLink')
      .returns(<va-link href="/learn" text="Learn more" />);
  });

  afterEach(() => sandbox.restore());

  it('renders the card title in an h3', () => {
    const screen = render(
      <NotGoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(screen.getByRole('heading', { level: 4 })).to.have.text(
      'Higher-Level Review',
    );
  });

  it('renders the not good fit reason content', () => {
    const screen = render(
      <NotGoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(
      screen.getByText(
        `You can’t submit new and relevant evidence for this type of review`,
      ),
    ).to.exist;
  });

  it('renders the learn more link', () => {
    const { container } = render(
      <NotGoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(container.innerHTML).to.contain('va-link');
  });

  it('renders with the correct data-testid', () => {
    const screen = render(
      <NotGoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(screen.getByTestId('not-good-fit-CARD_HLR')).to.exist;
  });
});
