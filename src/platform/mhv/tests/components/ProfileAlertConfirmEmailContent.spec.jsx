import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import { ProfileAlertConfirmEmailContent } from 'platform/mhv/components/MhvAlertConfirmEmail/ProfileAlertConfirmEmailContent';

describe('<ProfileAlertConfirmEmailContent />', () => {
  const clickButton = (container, clickSecondary = false) => {
    fireEvent(
      container.querySelector('va-button-pair'),
      new CustomEvent(clickSecondary ? 'secondaryClick' : 'primaryClick', {
        bubbles: true,
      }),
    );
  };

  it('renders text, email address, and button pair', async () => {
    const { container, getByText } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        onEditClick={() => {}}
      />,
    );

    await waitFor(() => {
      // Intro text
      getByText(
        /We’ll send notifications about your VA health care and benefits to this email\./i,
      );

      // Email address
      getByText('vet@va.gov');

      // Button pair exists
      const buttonPair = container.querySelector('va-button-pair');
      expect(buttonPair).to.exist;

      // Check props on the web component
      expect(buttonPair.getAttribute('left-button-text')).to.equal('Confirm');
      expect(buttonPair.getAttribute('right-button-text')).to.equal(
        'Edit contact email',
      );
    });
  });

  it('calls onConfirmClick when primary button is clicked', async () => {
    const onConfirmClick = sinon.spy();

    const { container } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={onConfirmClick}
        onEditClick={() => {}}
      />,
    );

    await waitFor(() => {
      clickButton(container);
      expect(onConfirmClick.calledOnce).to.be.true;
    });
  });

  it('calls onEditClick when secondary button is clicked', async () => {
    const onEditClick = sinon.spy();

    const { container } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        onEditClick={onEditClick}
      />,
    );

    await waitFor(() => {
      clickButton(container, true);
      expect(onEditClick.calledOnce).to.be.true;
    });
  });
});
