import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentHeading from './AppointmentHeading';

describe('AppointmentHeading', () => {
  const sandbox = sinon.createSandbox();
  let onClickHandler;

  const defaultBacklink = {
    text: 'Back to appointments',
    href: '/my-health/appointments',
  };

  beforeEach(() => {
    onClickHandler = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render back link with correct text and href', () => {
    const { getByTestId } = render(
      <AppointmentHeading backlink={defaultBacklink} />,
    );

    const backLink = getByTestId('back-link');
    expect(backLink).to.exist;
    expect(backLink).to.have.attribute('text', 'Back to appointments');
    expect(backLink).to.have.attribute('href', '/my-health/appointments');
  });

  it('should render back link with back attribute', () => {
    const { getByTestId } = render(
      <AppointmentHeading backlink={defaultBacklink} />,
    );

    const backLink = getByTestId('back-link');
    expect(backLink).to.have.attribute('back');
  });

  it('should render heading when provided', () => {
    const { getByText } = render(
      <AppointmentHeading
        backlink={defaultBacklink}
        heading="Cancel appointment"
      />,
    );

    expect(getByText('Cancel appointment')).to.exist;
  });

  it('should not render heading when not provided', () => {
    const { container } = render(
      <AppointmentHeading backlink={defaultBacklink} />,
    );

    const heading = container.querySelector('h1');
    expect(heading).to.not.exist;
  });

  it('should render info text when provided', () => {
    const { getByText } = render(
      <AppointmentHeading
        backlink={defaultBacklink}
        infoText="Please confirm you want to cancel this appointment."
      />,
    );

    expect(getByText('Please confirm you want to cancel this appointment.')).to
      .exist;
  });

  it('should not render info text when not provided', () => {
    const { container } = render(
      <AppointmentHeading backlink={defaultBacklink} />,
    );

    const paragraph = container.querySelector('p');
    expect(paragraph).to.not.exist;
  });

  it('should render both heading and info text when provided', () => {
    const { getByText } = render(
      <AppointmentHeading
        backlink={defaultBacklink}
        heading="Cancel appointment"
        infoText="Please confirm you want to cancel this appointment."
      />,
    );

    expect(getByText('Cancel appointment')).to.exist;
    expect(getByText('Please confirm you want to cancel this appointment.')).to
      .exist;
  });

  it('should call onClick handler when back link is clicked', async () => {
    const backlinkWithClick = {
      ...defaultBacklink,
      onClick: onClickHandler,
    };

    const { getByTestId } = render(
      <AppointmentHeading backlink={backlinkWithClick} />,
    );

    const backLink = getByTestId('back-link');
    await userEvent.click(backLink);

    expect(onClickHandler.calledOnce).to.be.true;
  });

  it('should render heading with correct class name', () => {
    const { container } = render(
      <AppointmentHeading
        backlink={defaultBacklink}
        heading="Cancel appointment"
      />,
    );

    const heading = container.querySelector('h1');
    expect(heading).to.exist;
    expect(heading).to.have.class('vads-u-margin-y--2p5');
  });

  it('should render back link with correct aria-label', () => {
    const { getByTestId } = render(
      <AppointmentHeading backlink={defaultBacklink} />,
    );

    const backLink = getByTestId('back-link');
    expect(backLink).to.have.attribute('aria-label', 'Back link');
  });

  it('should work without onClick handler', () => {
    const { getByTestId } = render(
      <AppointmentHeading backlink={defaultBacklink} />,
    );

    const backLink = getByTestId('back-link');
    expect(backLink).to.exist;
    expect(backLink).to.not.have.attribute('onClick');
  });
});
