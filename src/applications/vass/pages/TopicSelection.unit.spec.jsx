import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import TopicSelection from './TopicSelection';
import { topics } from '../services/Topic/topic';

describe('VASS Component: TopicSelection', () => {
  it('should render page title', () => {
    const screen = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render the checkbox group label', () => {
    const { container } = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );
    const checkboxGroup = container.querySelector('va-checkbox-group');

    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.getAttribute('label')).to.equal(
      'Check all that apply',
    );
  });

  it('should render all topic checkboxes', () => {
    const { container } = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );
    const checkboxes = container.querySelectorAll('va-checkbox');

    expect(checkboxes.length).to.equal(topics.length);
  });

  it('should render specific topic checkboxes', () => {
    const { container } = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );
    const checkboxes = container.querySelectorAll('va-checkbox');
    const labels = Array.from(checkboxes).map(cb => cb.getAttribute('label'));

    topics.forEach(topic => {
      expect(labels).to.include(topic);
    });
  });

  it('should render Back button', () => {
    const { container } = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );
    const buttons = container.querySelectorAll('va-button');
    const backButton = Array.from(buttons).find(
      button => button.getAttribute('text') === 'Back',
    );

    expect(backButton).to.exist;
    expect(backButton.getAttribute('secondary')).to.exist;
    expect(backButton.getAttribute('uswds')).to.exist;
  });

  it('should render Continue button', () => {
    const { container } = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );
    const buttons = container.querySelectorAll('va-button');
    const continueButton = Array.from(buttons).find(
      button => button.getAttribute('text') === 'Continue',
    );

    expect(continueButton).to.exist;
    expect(continueButton.getAttribute('uswds')).to.exist;
  });

  it('should mark checkbox as checked when selected', () => {
    const { container } = render(
      <MemoryRouter>
        <TopicSelection />
      </MemoryRouter>,
    );
    const checkboxes = container.querySelectorAll('va-checkbox');
    const compensationCheckbox = Array.from(checkboxes).find(
      checkbox => checkbox.getAttribute('value') === 'Compensation',
    );

    expect(compensationCheckbox.checked).to.be.false;

    const event = new CustomEvent('vaChange', {
      detail: { checked: true },
    });
    compensationCheckbox.dispatchEvent(event);

    expect(compensationCheckbox.checked).to.be.true;
  });
});
