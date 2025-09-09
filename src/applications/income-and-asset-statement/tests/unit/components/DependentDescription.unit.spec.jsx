import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DependentDescription } from '../../../components/DependentDescription';

describe('pension <DependentDescription>', () => {
  it('should render Veteran content', () => {
    const { container } = render(
      <DependentDescription claimantType="VETERAN" />,
    );
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(container.textContent).to.include(
      'A spouse, unless you live apart, are estranged, and don’t help pay',
    );
    expect(container.textContent).to.include(
      'An unmarried child (including adopted children or stepchildren)',
    );
    expect(container.textContent).to.include(
      'If your dependent is an unmarried child',
    );
    expect(container.textContent).to.include(
      'A natural or adoptive parent has custody of a child',
    );
  });

  it('should render Spouse content', () => {
    const { container } = render(
      <DependentDescription claimantType="SPOUSE" />,
    );
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(container.textContent).to.include(
      'An unmarried child (including an adopted child or stepchild) who you support',
    );
    expect(container.textContent).to.include('They’re under 18 years old');
    expect(container.textContent).to.include(
      'They’re between the ages of 18 and 23 years old',
    );
    expect(container.textContent).to.include(
      'They’re living with a permanent disability',
    );
  });

  it('should render Custodian content', () => {
    const { container } = render(
      <DependentDescription claimantType="CUSTODIAN" />,
    );
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(container.textContent).to.include(
      'A spouse, unless you live apart, are estranged, and don’t help pay',
    );
    expect(container.textContent).to.include(
      'The Veteran’s surviving unmarried child/children who you support',
    );
    expect(container.textContent).to.include(
      'If the child’s custodian is an institution',
    );
  });

  it('should render Parent content', () => {
    const { container } = render(
      <DependentDescription claimantType="PARENT" />,
    );
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(container.textContent).to.include(
      'A spouse, unless you live apart, are estranged, and don’t help pay',
    );
  });

  it('should render empty when claimantType is missing', () => {
    const { container } = render(<DependentDescription />);
    const selector = container.querySelector('va-additional-info');
    expect(selector).not.to.exist;
  });
});
