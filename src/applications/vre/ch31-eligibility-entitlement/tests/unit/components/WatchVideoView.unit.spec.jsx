import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import WatchVideoView from '../../../components/WatchVideoView';

describe('<WatchVideoView>', () => {
  let setScheduleMeetingView;

  beforeEach(() => {
    setScheduleMeetingView = sinon.spy();
  });

  it('renders the success alert and video tutorial link', () => {
    const { getByText, getByRole, container } = render(
      <WatchVideoView setScheduleMeetingView={setScheduleMeetingView} />,
    );
    expect(
      getByRole('heading', { name: /You have opted for the Video Tutorial/i }),
    ).to.exist;
    expect(
      getByText(
        /You have opted to complete your Orientation by watching the VA Video Tutorial/i,
      ),
    ).to.exist;
    let vaLink = Array.from(container.querySelectorAll('va-link')).find(
      link => link.getAttribute('text') === 'Video Tutorial 1',
    );
    expect(vaLink).to.exist;
    vaLink = Array.from(container.querySelectorAll('va-link')).find(
      link =>
        link.getAttribute('text') === 'Download Certificate of Completion',
    );
    expect(vaLink).to.exist;
  });

  it('renders the counselor radio options', () => {
    const { container } = render(
      <WatchVideoView setScheduleMeetingView={setScheduleMeetingView} />,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="Still want to meet with your counselor?"]',
    );
    expect(vaRadio).to.exist;
    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
    expect(radioOptions[0].getAttribute('label')).to.equal('No');
    expect(radioOptions[1].getAttribute('label')).to.equal(
      'Yes, I prefer meeting with my Counselor',
    );
  });

  it('calls setScheduleMeetingView when "Yes" is selected and Submit is clicked', () => {
    const { container, getByTestId, queryByText } = render(
      <WatchVideoView setScheduleMeetingView={setScheduleMeetingView} />,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="Still want to meet with your counselor?"]',
    );
    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    const yesOption = Array.from(radioOptions).find(
      opt =>
        opt.getAttribute('label') === 'Yes, I prefer meeting with my Counselor',
    );
    yesOption.click();
    const submitButton = getByTestId('submit-counselor-preference');
    expect(submitButton).to.exist;
    fireEvent.click(submitButton);
    queryByText(/You have opted for the Video Tutorial/i);
  });
});
