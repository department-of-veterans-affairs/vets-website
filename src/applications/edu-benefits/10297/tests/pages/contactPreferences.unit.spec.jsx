import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-10297 Contact preferences page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.contactPreferences;

  const renderPage = (
    data = {
      contactInfo: {},
      contactMethod: {},
      'view:receiveTextMessages': {},
    },
  ) => {
    return render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
    );
  };

  it('only renders mail contact method option if user does not enter email or phone number', () => {
    const screen = renderPage();
    expect(screen.container.querySelector("va-radio-option[label='Mail']")).to
      .exist;
    expect(screen.container.querySelector("va-radio-option[label='Email']")).not
      .to.exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Mobile Phone']"),
    ).not.to.exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Home Phone']"),
    ).not.to.exist;
  });

  it('renders mail and email contact method option if user enters email', () => {
    const screen = renderPage({
      contactInfo: { emailAddress: 'test@example.com' },
      contactMethod: {},
    });
    expect(screen.container.querySelector("va-radio-option[label='Mail']")).to
      .exist;
    expect(screen.container.querySelector("va-radio-option[label='Email']")).to
      .exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Mobile Phone']"),
    ).not.to.exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Home Phone']"),
    ).not.to.exist;
  });

  it('renders mail and mobile phone contact method option if user enters mobile phone number', () => {
    const screen = renderPage({
      contactInfo: {
        mobilePhone: { contact: '1231231234', isValid: true },
      },
      contactMethod: {},
    });
    expect(screen.container.querySelector("va-radio-option[label='Mail']")).to
      .exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Mobile Phone']"),
    ).to.exist;
    expect(screen.container.querySelector("va-radio-option[label='Email']")).not
      .to.exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Home Phone']"),
    ).not.to.exist;
  });

  it('renders mail and home phone contact method option if user enters home phone number', () => {
    const screen = renderPage({
      contactInfo: {
        homePhone: { contact: '1231231234', isValid: true },
      },
      contactMethod: {},
    });
    expect(screen.container.querySelector("va-radio-option[label='Mail']")).to
      .exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Home Phone']"),
    ).to.exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Mobile Phone']"),
    ).not.to.exist;
    expect(screen.container.querySelector("va-radio-option[label='Email']")).not
      .to.exist;
  });

  it('renders mail and home phone contact method option if user enters home phone number', () => {
    const screen = renderPage({
      contactInfo: {
        homePhone: { contact: '1231231234', isValid: true },
      },
      contactMethod: {},
    });
    expect(screen.container.querySelector("va-radio-option[label='Mail']")).to
      .exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Home Phone']"),
    ).to.exist;
    expect(
      screen.container.querySelector("va-radio-option[label='Mobile Phone']"),
    ).not.to.exist;
    expect(screen.container.querySelector("va-radio-option[label='Email']")).not
      .to.exist;
  });

  it('renders noMobilePhoneAlert if user does not have a valid mobile phone number', () => {
    const screen = renderPage();

    expect(
      screen.getByText(
        'We can’t send you text message notifications because we don’t have a mobile phone number on file for you.',
      ),
    ).to.exist;
  });

  it('renders internationalTextMessageAlert if user has an international mobile phone number', () => {
    const screen = renderPage({
      contactInfo: {
        mobilePhone: { contact: '1231231234', countryCode: 'CAN' },
      },
    });

    expect(
      screen.getByText(
        'You can’t choose to get text message notifications because you have an international mobile phone number.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('renders emailOnFileWithSomeoneElseAlert if email is on file for someone else', () => {
    const screen = renderPage({
      contactInfo: {},
      contactMethod: {},
      duplicateEmail: [{ value: 'test@abc.com', dupe: true }],
      'view:receiveTextMessages': {
        receiveTextMessages: 'No, just send me email notifications',
      },
    });

    expect(
      screen.getByText(
        'You can’t choose to get email notifications because your email is on file for another person with education benefits.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('renders mobilePhoneOnFileWithSomeoneElseAlert if mobile phone is on file for someone else', () => {
    const screen = renderPage({
      contactInfo: {},
      contactMethod: {},
      duplicatePhone: [{ value: '1231231234', dupe: true }],
      'view:receiveTextMessages': {
        receiveTextMessages: 'Yes, send me text notifications',
      },
    });

    expect(
      screen.getByText(
        'You can’t choose to get text notifications because your mobile phone number is on file for another person with education benefits.',
        { exact: false },
      ),
    ).to.exist;
  });
});
