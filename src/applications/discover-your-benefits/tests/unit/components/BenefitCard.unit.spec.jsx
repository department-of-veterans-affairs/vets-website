import React from 'react';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import * as recordEventModule from 'platform/monitoring/record-event';

import { BENEFITS_LIST } from '../../../constants/benefits';

import BenefitCard from '../../../components/BenefitCard';

describe('<BenefitCard>', () => {
  it('renders benefit card', () => {
    const benefit = BENEFITS_LIST[0];
    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(container.querySelector('h3')).to.contain.text(benefit.name);
    expect(
      container.querySelector(
        'p.vads-u-margin-y--0.vads-u-margin-bottom--neg1p5',
      ),
    ).to.contain.text(benefit.description);
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(1);
  });

  it('renders recommended label when benefit is recommended', () => {
    const benefit = BENEFITS_LIST[0];

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => true} />,
    );

    expect(container.querySelector('.recommended-label')).to.exist;
    expect(container.querySelector('.recommended-label')).to.contain.text(
      'RECOMMENDED FOR YOU',
    );
  });

  it('does not render recommended label when not recommended', () => {
    const benefit = BENEFITS_LIST[0];

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(container.querySelector('.recommended-label')).to.not.exist;
  });

  it('adds negative margin class when not recommended', () => {
    const benefit = BENEFITS_LIST[0];

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    const eyebrow = container.querySelector('.category-eyebrow');
    expect(eyebrow.className).to.contain('vads-u-margin-top--neg0p5');
  });

  it('does not add negative margin class when recommended', () => {
    const benefit = BENEFITS_LIST[0];

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => true} />,
    );

    const eyebrow = container.querySelector('.category-eyebrow');
    expect(eyebrow.className).to.not.contain('vads-u-margin-top--neg0p5');
  });

  it('renders when to apply description', () => {
    const benefit = BENEFITS_LIST[0];

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(container).to.contain.text('When to apply');
    expect(container).to.contain.text(benefit.whenToApplyDescription);
  });

  it('renders whenToApplyNote when provided', () => {
    const benefit = {
      ...BENEFITS_LIST[0],
      whenToApplyNote: 'You must apply within 1 year.',
    };

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(container).to.contain.text('Note');
    expect(container).to.contain.text(benefit.whenToApplyNote);
  });

  it('does not render whenToApplyNote when undefined', () => {
    const benefit = {
      ...BENEFITS_LIST[0],
      whenToApplyNote: undefined,
    };

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(container).to.not.contain.text('Note');
  });

  it('does not render learn more link if URL is missing', () => {
    const benefit = {
      ...BENEFITS_LIST[0],
      learnMoreURL: null,
    };

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(container.querySelectorAll('va-link')).to.have.lengthOf(0);
  });

  it('sets correct data-testid', () => {
    const benefit = BENEFITS_LIST[0];

    const { getByTestId } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    expect(getByTestId(`benefit-card-${benefit.name}`)).to.exist;
  });

  it('sets aria-label on benefit name heading', () => {
    const benefit = BENEFITS_LIST[0];

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    const heading = container.querySelector('h3');
    expect(heading.getAttribute('aria-label')).to.equal(benefit.name);
  });

  it('calls recordEvent when learn more link is clicked', () => {
    const benefit = BENEFITS_LIST[0];

    const recordEventStub = sinon.stub(recordEventModule, 'default');

    const { container } = render(
      <BenefitCard benefit={benefit} isBenefitRecommended={() => false} />,
    );

    const link = container.querySelector('va-link');

    fireEvent.click(link);

    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.deep.equal({
      event: 'nav-link-click',
      'link-label': 'Learn more',
      'link-destination': benefit.learnMoreURL,
      'link-origin': `Learn more about ${benefit.name}`,
    });

    recordEventStub.restore();
  });
});
