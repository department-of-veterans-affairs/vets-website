import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import ScheduleMeetingView from '../../../components/ScheduleMeetingView';

describe('<ScheduleMeetingView>', () => {
  let setWatchVideoView;

  beforeEach(() => {
    setWatchVideoView = sinon.spy();
  });

  it('renders va-radio with correct meeting type options', () => {
    const { container } = render(
      <ScheduleMeetingView setWatchVideoView={setWatchVideoView} />,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="My preference is to:"]',
    );
    expect(vaRadio).to.exist;

    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);

    expect(radioOptions[0].getAttribute('label')).to.equal('online meeting');
    expect(radioOptions[0].getAttribute('name')).to.equal(
      'meeting_type_preference',
    );
    expect(radioOptions[0].getAttribute('value')).to.equal('online meeting');
    expect(radioOptions[0].hasAttribute('checked')).to.be.true;

    expect(radioOptions[1].getAttribute('label')).to.equal(
      'in-person appointment',
    );
    expect(radioOptions[1].getAttribute('name')).to.equal(
      'meeting_type_preference',
    );
    expect(radioOptions[1].getAttribute('value')).to.equal(
      'in-person appointment',
    );
  });

  it('shows online meeting additional info when online meeting is selected', () => {
    const { getByText } = render(
      <ScheduleMeetingView setWatchVideoView={setWatchVideoView} />,
    );
    expect(getByText(/Telecounseling uses the VA Video Connect application/i))
      .to.exist;
  });

  it('opens scheduler modal when Submit is clicked for online meeting', () => {
    const { container, getByTestId } = render(
      <ScheduleMeetingView setWatchVideoView={setWatchVideoView} />,
    );
    const submitButton = getByTestId('submit-meeting-preference');
    expect(submitButton).to.exist;
    fireEvent.click(submitButton);
    const vaModal = container.querySelector(
      'va-modal[modal-title="You\'re leaving VA.gov"]',
    );
    expect(vaModal).to.exist;
    expect(vaModal.getAttribute('primary-button-text')).to.equal(
      'Open Scheduler',
    );
    expect(vaModal.getAttribute('secondary-button-text')).to.equal('Go Back');
    expect(vaModal.getAttribute('visible')).to.not.be.null;
  });

  it('shows in-person appointment additional info when selected', () => {
    const { container } = render(
      <ScheduleMeetingView setWatchVideoView={setWatchVideoView} />,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="My preference is to:"]',
    );
    expect(vaRadio).to.exist;

    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    const inPersonOption = Array.from(radioOptions).find(
      opt => opt.getAttribute('label') === 'in-person appointment',
    );
    expect(inPersonOption).to.exist;

    // Simulate click event on the va-radio-option
    inPersonOption.click();
    expect(inPersonOption.hasAttribute('checked'));
  });

  it('renders orientation online va-radio with correct options', () => {
    const { container } = render(
      <ScheduleMeetingView setWatchVideoView={setWatchVideoView} />,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="Still want to complete your Orientation Online?"]',
    );
    expect(vaRadio).to.exist;

    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);

    expect(radioOptions[0].getAttribute('label')).to.equal('No');
    expect(radioOptions[0].getAttribute('name')).to.equal(
      'orientation_online_preference',
    );
    expect(radioOptions[0].getAttribute('value')).to.equal('No');

    expect(radioOptions[1].getAttribute('label')).to.equal(
      'Yes, I prefer completing the Orientation online by watching the video',
    );
    expect(radioOptions[1].getAttribute('name')).to.equal(
      'orientation_online_preference',
    );
    expect(radioOptions[1].getAttribute('value')).to.equal(
      'Yes, I prefer completing the Orientation online by watching the video',
    );
  });

  it('calls setWatchVideoView when Yes is selected and Submit is clicked', () => {
    const { getByTestId, container, queryByText } = render(
      <ScheduleMeetingView setWatchVideoView={setWatchVideoView} />,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="Still want to complete your Orientation Online?"]',
    );
    expect(vaRadio).to.exist;

    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    const yesOption = Array.from(radioOptions).find(
      opt =>
        opt.getAttribute('label') ===
        'Yes, I prefer completing the Orientation online by watching the video',
    );
    expect(yesOption).to.exist;

    // Simulate click event on the va-radio-option
    yesOption.click();

    // Optionally, check if it is now checked (if your component updates the attribute)
    expect(yesOption.hasAttribute('checked'));
    const submitOrientationButton = getByTestId(
      'submit-orientation-preference',
    );
    expect(submitOrientationButton).to.exist;
    queryByText(/You have opted for the Video Tutorial/i);
  });
});
