import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { NotificationChannelCheckboxesFieldset } from '~/applications/personalization/profile/components/notification-settings/NotificationChannelCheckboxesFieldset'; // Assume this is the correct path for your component

describe('<NotificationChannelCheckboxesFieldset />', () => {
  const defaultProps = {
    itemId: 'testId',
    itemName: 'testName',
    children: <div>Test Children</div>,
    hasSomeErrorUpdates: false,
    hasSomePendingUpdates: false,
    hasSomeSuccessUpdates: false,
  };

  it('renders the component with given children', () => {
    const { getByText } = render(
      <NotificationChannelCheckboxesFieldset {...defaultProps} />,
    );
    const children = getByText('Test Children');
    expect(children).to.exist;
  });

  it('displays the correct item name', () => {
    const { getByText } = render(
      <NotificationChannelCheckboxesFieldset {...defaultProps} />,
    );
    const itemName = getByText(defaultProps.itemName);
    expect(itemName).to.exist;
  });

  it('displays the description when provided', () => {
    const description = 'Test Description';
    const { getByText } = render(
      <NotificationChannelCheckboxesFieldset
        {...defaultProps}
        description={description}
      />,
    );
    const descriptionText = getByText(description);
    expect(descriptionText).to.exist;
  });

  it('sets the fieldset to disabled when hasSomePendingUpdates is true', () => {
    const { container } = render(
      <NotificationChannelCheckboxesFieldset
        {...defaultProps}
        hasSomePendingUpdates
      />,
    );
    const fieldset = container.querySelector('fieldset');
    expect(fieldset.disabled).to.be.true;
  });

  it('applies the correct border color classes based on props', () => {
    let { container } = render(
      <NotificationChannelCheckboxesFieldset
        {...defaultProps}
        hasSomeSuccessUpdates
      />,
    );
    expect(container.querySelector('fieldset').className).to.include(
      'vads-u-border-color--green',
    );

    container = render(
      <NotificationChannelCheckboxesFieldset
        {...defaultProps}
        hasSomeErrorUpdates
      />,
    ).container;
    expect(container.querySelector('fieldset').className).to.include(
      'vads-u-border-color--secondary',
    );

    container = render(
      <NotificationChannelCheckboxesFieldset {...defaultProps} />,
    ).container;
    expect(container.querySelector('fieldset').className).to.include(
      'vads-u-border-color--white',
    );
  });
});
