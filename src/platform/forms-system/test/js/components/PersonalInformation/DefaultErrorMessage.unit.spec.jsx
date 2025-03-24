import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { DefaultErrorMessage } from '../../../../src/js/components/PersonalInformation/DefaultErrorMessage';

describe('DefaultErrorMessage', () => {
  it('should render with a single missing field', () => {
    const { getByText } = render(
      <DefaultErrorMessage missingFields={['ssn']} />,
    );

    expect(getByText(/Your VA account is missing your Social Security number/))
      .to.exist;
    expect(getByText(/Tell us you may be missing your Social Security number/))
      .to.exist;
  });

  it('should render with multiple missing fields', () => {
    const { getByText } = render(
      <DefaultErrorMessage missingFields={['ssn', 'vaFileNumber']} />,
    );

    expect(
      getByText(
        /Your VA account is missing your Social Security number and VA file number/,
      ),
    ).to.exist;
    expect(
      getByText(
        /Tell us you may be missing your Social Security number and VA file number/,
      ),
    ).to.exist;
  });

  it('should handle unknown missing fields gracefully', () => {
    const { getByText, queryByText } = render(
      <DefaultErrorMessage missingFields={['ssn', 'unknownField']} />,
    );

    // Should only include the known field in the message
    expect(getByText(/Your VA account is missing your Social Security number/))
      .to.exist;
    expect(queryByText(/unknownField/)).to.not.exist;
  });

  it('should NOT render with empty missing fields array', () => {
    const { container } = render(<DefaultErrorMessage missingFields={[]} />);

    expect(container.textContent).to.equal('');
  });

  it('should NOT render with null missing fields array', () => {
    const { container } = render(<DefaultErrorMessage missingFields={null} />);

    expect(container.textContent).to.equal('');
  });

  it('should render contact information correctly', () => {
    const { container } = render(
      <DefaultErrorMessage missingFields={['ssn']} />,
    );

    // needs to render phone number and tty number
    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements).to.have.lengthOf(2);

    // should use the VA benefits number by default
    const vaElement = Array.from(phoneElements).find(
      el => el.getAttribute('contact') === CONTACTS.VA_BENEFITS,
    );
    expect(vaElement).to.exist;

    // tty would also be rendered
    const ttyElement = Array.from(phoneElements).find(
      el => el.getAttribute('contact') === '711',
    );
    expect(ttyElement).to.exist;
    expect(ttyElement.hasAttribute('tty')).to.be.true;
  });
});
