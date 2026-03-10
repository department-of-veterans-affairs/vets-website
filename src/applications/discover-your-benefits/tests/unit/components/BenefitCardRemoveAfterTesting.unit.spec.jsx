import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import { BENEFITS_LIST } from '../../../constants/benefitsRemoveAfterTesting';

import BenefitCard from '../../../components/BenefitCardRemoveAfterTesting';

describe('<BenefitCard>', () => {
  it('renders benefit card', () => {
    const benefit = BENEFITS_LIST[0];
    const { container } = render(<BenefitCard benefit={benefit} />);

    expect(container.querySelector('h3')).to.contain.text(benefit.name);
    expect(container.querySelector('p')).to.have.text(benefit.description);
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(1);
    expect(container.querySelectorAll('va-link-action')).to.have.lengthOf(1);
  });

  it('renders time sensitive benefit card', () => {
    const benefit = BENEFITS_LIST.find(b => b.isTimeSensitive);
    const { container } = render(<BenefitCard benefit={benefit} />);

    expect(container.querySelector('h3')).to.contain.text(benefit.name);
    expect(container.querySelector('p')).to.have.text(benefit.description);
    expect(container.querySelector('div.blue-heading')).to.exist;
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(1);
  });
});

describe('Analytics tests', () => {
  let recordEventStub;
  beforeEach(function() {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(function() {
    recordEventStub.restore();
  });

  it('calls recordEvent when learn more link is clicked', () => {
    const benefit = BENEFITS_LIST[0];
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
  });
});
