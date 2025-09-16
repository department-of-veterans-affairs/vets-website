import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import GoodFitCard from '../../../components/dr-results-screens/GoodFitCard';
import * as utils from '../../../utilities/dr-results-content-utils';
import * as c from '../../../constants/results-content/dr-screens/card-content';

describe('GoodFitCard', () => {
  const card = 'CARD_HLR';
  const formResponses = { foo: 'bar' };
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(utils, 'getCardTitle').returns('Higher-Level Review');
    sandbox.stub(utils, 'getCardContent').returns(
      <ul>
        <li>You have new and relevant evidence</li>
      </ul>,
    );

    sandbox
      .stub(utils, 'getLearnMoreLink')
      .returns(<va-link href="/learn" text="Learn more" />);

    sandbox
      .stub(utils, 'getStartLink')
      .returns(<va-link-action href="/start" text="Start" />);

    sandbox.stub(utils, 'getDecisionTimeline').returns('3-6 months');
    sandbox.stub(c, 'CARD_SC').value('CARD_SC');
  });

  afterEach(() => sandbox.restore());

  it('renders the card title in an h3', () => {
    const screen = render(
      <GoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(screen.getByRole('heading', { level: 3 })).to.have.text(
      'Higher-Level Review',
    );
  });

  it('renders the good fit reason content', () => {
    const screen = render(
      <GoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(screen.getByText('You have new and relevant evidence')).to.exist;
  });

  it('renders the average decision timeline', () => {
    const screen = render(
      <GoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(screen.getByText('3-6 months')).to.exist;
  });

  it('does not render the note if card is Supplemental Claims', () => {
    const screen = render(
      <GoodFitCard card={c.CARD_SC} formResponses={formResponses} />,
    );

    expect(screen.queryByText(/You cannot request more than 1/)).to.be.null;
  });

  it('renders the learn more link', () => {
    const { container } = render(
      <GoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(container.innerHTML).to.contain('va-link');
  });

  it('renders the start link', () => {
    const { container } = render(
      <GoodFitCard card={card} formResponses={formResponses} />,
    );

    expect(container.innerHTML).to.contain('va-link-action');
  });
});
