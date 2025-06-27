import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { addHours, addMinutes } from 'date-fns';
import sinon from 'sinon';

import DowntimeApproaching from '../components/DowntimeApproaching';

describe('<DowntimeApproaching>', () => {
  const dt = new Date('2025-06-25T16:00:00-00:00');
  const startTime = addMinutes(dt, 30);
  const endTime = addHours(startTime, 1);
  const props = {
    appTitle: 'Test App',
    dismissDowntimeWarning: () => {},
    endTime,
    initializeDowntimeWarnings: () => {},
    isDowntimeWarningDismissed: false,
    startTime,
  };

  it('should render with a properly formatted date and times', () => {
    const { getByText } = render(<DowntimeApproaching {...props} />);
    expect(getByText(/June 25th/)).to.exist;
    expect(
      getByText(
        /between\s+\d{1,2}:\d{2}\s+(A|P)M\s+and\s+\d{1,2}:\d{2}\s+(A|P)M/,
      ),
    ).to.exist;
  });

  it('should render modal with correct title and message', () => {
    const { container, getByText } = render(<DowntimeApproaching {...props} />);
    const vaModalElement = container.querySelector('va-modal');
    expect(vaModalElement).to.exist;
    expect(vaModalElement.getAttribute('modal-title')).to.eq(
      'The Test App will be down for maintenance soon',
    );
    expect(vaModalElement.getAttribute('secondary-button-text')).to.eq(
      'Dismiss',
    );
    expect(vaModalElement.getAttribute('visible')).to.eq('true');
    expect(
      getByText(
        /We’ll be doing some work on the Test App on June 25th between/i,
      ),
    ).to.exist;
  });

  it('should render children when provided', () => {
    const { getByTestId } = render(
      <DowntimeApproaching {...props}>
        <div data-testid="child-content">Child content</div>
      </DowntimeApproaching>,
    );
    expect(getByTestId('child-content')).to.exist;
  });

  it('should not show modal when isDowntimeWarningDismissed is true', () => {
    const { container } = render(
      <DowntimeApproaching {...props} isDowntimeWarningDismissed />,
    );
    const vaModalElement = container.querySelector('va-modal');
    expect(vaModalElement).to.exist;
    expect(vaModalElement.getAttribute('visible')).to.eq('false');
  });

  it('should call dismissDowntimeWarning when modal onCloseEvent is triggered', () => {
    const dismissSpy = sinon.spy();
    const { container } = render(
      <DowntimeApproaching {...props} dismissDowntimeWarning={dismissSpy} />,
    );
    const vaModalElement = container.querySelector('va-modal');
    fireEvent(vaModalElement, new CustomEvent('closeEvent'));
    expect(dismissSpy.calledWith(props.appTitle)).to.be.true;
  });

  it('should render custom messaging.title and messaging.content when provided', () => {
    const messaging = {
      title: 'Custom Downtime Title',
      content: <div>Custom downtime content for users.</div>,
    };
    const { container, getByText } = render(
      <DowntimeApproaching {...props} messaging={messaging} />,
    );
    const vaModalElement = container.querySelector('va-modal');
    expect(vaModalElement).to.exist;
    expect(vaModalElement.getAttribute('modal-title')).to.eq(
      'Custom Downtime Title',
    );
    expect(getByText('Custom downtime content for users.')).to.exist;
  });
});
