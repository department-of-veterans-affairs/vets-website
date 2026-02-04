import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import ApplicantContactInfoCard from '../../components/ApplicantContactInfoCard';

describe('<ApplicantContactInfoCard />', () => {
  const formData = {
    email: 'test@example.com',
    phoneNumber: '5551234567',
  };

  it('renders contact information', () => {
    const { getByText } = render(
      <ApplicantContactInfoCard formData={formData} />,
    );

    expect(getByText('Your phone number')).to.exist;
    expect(getByText('Your email address')).to.exist;
    expect(getByText('test@example.com')).to.exist;
    expect(getByText('555-123-4567')).to.exist;
  });

  it('renders "Not provided" for missing email', () => {
    const dataWithoutEmail = { phoneNumber: '5551234567' };
    const { getByText } = render(
      <ApplicantContactInfoCard formData={dataWithoutEmail} />,
    );
    expect(getByText('Not provided')).to.exist;
  });

  it('calls onEdit with "phone" when phone edit button is clicked', () => {
    const onEditSpy = sinon.spy();
    const { getByTestId } = render(
      <ApplicantContactInfoCard formData={formData} onEdit={onEditSpy} />,
    );

    fireEvent.click(getByTestId('edit-phone-button'));
    expect(onEditSpy.calledWith('phone')).to.be.true;
  });

  it('calls onEdit with "email" when email edit button is clicked', () => {
    const onEditSpy = sinon.spy();
    const { getByTestId } = render(
      <ApplicantContactInfoCard formData={formData} onEdit={onEditSpy} />,
    );

    fireEvent.click(getByTestId('edit-email-button'));
    expect(onEditSpy.calledWith('email')).to.be.true;
  });

  it('renders additional content when provided', () => {
    const content = 'Additional help text';
    const { getByText } = render(
      <ApplicantContactInfoCard formData={formData} content={content} />,
    );

    expect(getByText(content)).to.exist;
  });
});
