import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import EmergencyNote from '../../../components/EmergencyNote';
import { getByBrokenText } from '../../../util/testUtils';

describe('EmergencyNote component', () => {
  it('renders without errors', () => {
    const screen = render(<EmergencyNote />);
    const { getByText } = screen;
    const alert = document.querySelector('va-alert');

    expect(alert.getAttribute('background-only')).to.equal('true');
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
    expect(alert.getAttribute('status')).to.equal('warning');
    expect(alert.getAttribute('visible')).to.equal('true');

    expect(getByText('Don’t use messages for emergencies')).to.exist;
    expect(
      getByBrokenText(
        'Your care team may take up to 3 business days to reply.',
        alert,
      ),
    ).to.exist;
    expect(
      getByText(
        'If you need help sooner, use one of these urgent communications options:',
      ),
    ).to.exist;
    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, connect with our Veterans Crisis Line. We offer confidential support anytime, day or night.',
        alert,
      ),
    ).to.exist;
    expect(getByText('If you think your life or health is in danger,')).to
      .exist;
  });
});
