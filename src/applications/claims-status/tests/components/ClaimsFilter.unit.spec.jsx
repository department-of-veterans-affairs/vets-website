import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ClaimsFilter from '../../components/ClaimsFilter';

describe('<ClaimsFilter>', () => {
  it('should render VaButtonSegmented with correct label', () => {
    const { container } = render(
      <ClaimsFilter selected="all" onFilterChange={() => {}} />,
    );

    const buttonSegmented = container.querySelector('va-button-segmented');
    expect(buttonSegmented).to.exist;
    expect(buttonSegmented.getAttribute('label')).to.equal(
      'Claims status filter',
    );
  });

  [
    { selected: 'all', expectedIndex: '0' },
    { selected: 'active', expectedIndex: '1' },
    { selected: 'closed', expectedIndex: '2' },
  ].forEach(({ selected, expectedIndex }) => {
    it(`should set selected index to ${expectedIndex} when "${selected}" is selected`, () => {
      const { container } = render(
        <ClaimsFilter selected={selected} onFilterChange={() => {}} />,
      );

      const buttonSegmented = container.querySelector('va-button-segmented');
      expect(buttonSegmented.getAttribute('selected')).to.equal(expectedIndex);
    });
  });

  it('should call onFilterChange with correct value when button is clicked', () => {
    const onFilterChange = sinon.spy();
    const { container } = render(
      <ClaimsFilter selected="all" onFilterChange={onFilterChange} />,
    );

    const buttonSegmented = container.querySelector('va-button-segmented');

    // Simulate the vaButtonClick event
    const event = new CustomEvent('vaButtonClick', {
      detail: { value: 'closed' },
      bubbles: true,
    });
    buttonSegmented.dispatchEvent(event);

    expect(onFilterChange.calledOnce).to.be.true;
    expect(onFilterChange.calledWith('closed')).to.be.true;
  });

  it('should handle missing onFilterChange prop gracefully', () => {
    const { container } = render(<ClaimsFilter selected="all" />);

    const buttonSegmented = container.querySelector('va-button-segmented');

    // This should not throw an error
    const event = new CustomEvent('vaButtonClick', {
      detail: { value: 'active' },
      bubbles: true,
    });

    expect(() => {
      buttonSegmented.dispatchEvent(event);
    }).to.not.throw();
  });
});
