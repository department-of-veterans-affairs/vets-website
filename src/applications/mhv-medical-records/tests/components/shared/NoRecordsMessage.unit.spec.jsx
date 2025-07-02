import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import NoRecordsMessage from '../../../components/shared/NoRecordsMessage';
import { recordType } from '../../../util/constants';

describe('NoRecordsMessage', () => {
  it('renders the basic no records message without timeFrame', () => {
    const { getByTestId } = render(
      <NoRecordsMessage type={recordType.ALLERGIES} />,
    );

    const message = getByTestId('no-records-message');
    expect(message).to.exist;
    expect(message.textContent).to.equal(
      'There are no allergies or reactions in your VA medical records.',
    );
  });

  it('renders the no records message with timeFrame', () => {
    const { getByTestId } = render(
      <NoRecordsMessage type={recordType.VACCINES} timeFrame="the last year" />,
    );

    const message = getByTestId('no-records-message');
    expect(message).to.exist;
    expect(message.textContent).to.equal(
      'There are no vaccines in your VA medical records for the last year.',
    );
  });

  it('renders the record list item container with correct attributes', () => {
    const { getByTestId } = render(
      <NoRecordsMessage type={recordType.HEALTH_CONDITIONS} />,
    );

    const container = getByTestId('record-list-item');
    expect(container).to.exist;
    expect(container.tagName.toLowerCase()).to.equal('va-card');
    expect(container.hasAttribute('background')).to.be.true;
    expect(container.getAttribute('class')).to.include('record-list-item');
    expect(container.getAttribute('class')).to.include('vads-u-margin-top--4');
    expect(container.getAttribute('class')).to.include(
      'vads-u-margin-bottom--8',
    );
  });

  it('renders special content for vitals record type', () => {
    const { getByText, getByTestId } = render(
      <NoRecordsMessage type={recordType.VITALS} />,
    );

    // Check for vitals-specific content
    expect(getByText('Vitals include:')).to.exist;
    expect(getByText('Blood pressure and blood oxygen level')).to.exist;
    expect(getByText('Breathing rate and heart rate')).to.exist;
    expect(getByText('Height and weight')).to.exist;
    expect(getByText('Temperature')).to.exist;

    // Check that the standard message is still rendered
    const message = getByTestId('no-records-message');
    expect(message.textContent).to.equal(
      'There are no vitals in your VA medical records.',
    );
  });

  it('renders special content for vitals with timeFrame', () => {
    const { getByText, getByTestId } = render(
      <NoRecordsMessage
        type={recordType.VITALS}
        timeFrame="the past 6 months"
      />,
    );

    // Check for vitals-specific content
    expect(getByText('Vitals include:')).to.exist;
    expect(getByText('Blood pressure and blood oxygen level')).to.exist;
    expect(getByText('Breathing rate and heart rate')).to.exist;
    expect(getByText('Height and weight')).to.exist;
    expect(getByText('Temperature')).to.exist;

    // Check that the standard message with timeFrame is rendered
    const message = getByTestId('no-records-message');
    expect(message.textContent).to.equal(
      'There are no vitals in your VA medical records for the past 6 months.',
    );
  });

  it('renders correctly for care summaries and notes', () => {
    const { getByTestId } = render(
      <NoRecordsMessage type={recordType.CARE_SUMMARIES_AND_NOTES} />,
    );

    const message = getByTestId('no-records-message');
    expect(message.textContent).to.equal(
      'There are no care summaries and notes in your VA medical records.',
    );
  });

  it('renders correctly for labs and tests', () => {
    const { getByTestId } = render(
      <NoRecordsMessage
        type={recordType.LABS_AND_TESTS}
        timeFrame="this month"
      />,
    );

    const message = getByTestId('no-records-message');
    expect(message.textContent).to.equal(
      'There are no lab and test results in your VA medical records for this month.',
    );
  });

  it('handles undefined or null props gracefully', () => {
    const { getByTestId } = render(<NoRecordsMessage />);

    const message = getByTestId('no-records-message');
    expect(message).to.exist;
    expect(message.textContent).to.equal(
      'There are no undefined in your VA medical records.',
    );
  });

  it('applies correct CSS classes to the message header', () => {
    const { getByTestId } = render(
      <NoRecordsMessage type={recordType.ALLERGIES} />,
    );

    const message = getByTestId('no-records-message');
    expect(message.className).to.include('vads-u-font-size--base');
    expect(message.className).to.include('vads-u-font-weight--normal');
    expect(message.className).to.include('vads-u-font-family--sans');
    expect(message.className).to.include('vads-u-margin-top--0');
    expect(message.className).to.include('vads-u-margin-bottom--0');
  });

  it('uses h2 tag for the message', () => {
    const { getByTestId } = render(
      <NoRecordsMessage type={recordType.VACCINES} />,
    );

    const message = getByTestId('no-records-message');
    expect(message.tagName.toLowerCase()).to.equal('h2');
  });

  it('renders vitals list as unordered list with correct items', () => {
    const { container } = render(<NoRecordsMessage type={recordType.VITALS} />);

    const list = container.querySelector('ul');
    expect(list).to.exist;

    const listItems = container.querySelectorAll('li');
    expect(listItems).to.have.lengthOf(4);
    expect(listItems[0].textContent).to.equal(
      'Blood pressure and blood oxygen level',
    );
    expect(listItems[1].textContent).to.equal('Breathing rate and heart rate');
    expect(listItems[2].textContent).to.equal('Height and weight');
    expect(listItems[3].textContent).to.equal('Temperature');
  });
});
