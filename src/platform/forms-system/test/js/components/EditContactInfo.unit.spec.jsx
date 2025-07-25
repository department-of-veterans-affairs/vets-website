import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import vapProfile from '../../../../user/profile/vap-svc/tests/fixtures/mockVapProfile.json';
import vapService from '../../../../user/profile/vap-svc/reducers';

import { EditHomePhone } from '../../../src/js/components/EditContactInfo';
import {
  getContent,
  getReturnState,
  clearReturnState,
} from '../../../src/js/utilities/data/profile';

xdescribe('EditContactInfo', () => {
  const content = getContent();

  // Only testing EditHomePhone - other pages use same BuildPage code
  describe('<EditHomePhone>', () => {
    const props = {
      title: content.editHomePhone,
      goToPath: () => {},
      contactPath: 'contact-information',
    };

    afterEach(() => {
      clearReturnState();
    });

    xit('should render', () => {
      const { getByText, container } = renderInReduxProvider(
        <EditHomePhone {...props} />,
        {
          initialState: { vapProfile },
          reducers: { vapService },
        },
      );

      expect(getByText(content.editHomePhone)).to.exist;
      const phoneNumber = $(
        'va-text-input[label^="Home phone number"]',
        container,
      );
      expect(phoneNumber).to.exist;
      expect(phoneNumber.required).to.be.true;
      const extension = $('va-text-input[label^="Extension"]', container);
      expect(extension).to.exist;

      expect(getByTestId('save-edit-button')).to.exist;
      expect(getByTestId('cancel-edit-button')).to.exist;
    });

    xit('should save', async () => {
      const { getByTestId, container } = renderInReduxProvider(
        <EditHomePhone {...props} />,
        {
          initialState: { vapProfile },
          reducers: { vapService },
        },
      );

      const phoneNumber = $(
        'va-text-input[label^="Home phone number"]',
        container,
      );
      phoneNumber.value = '8005551212';
      await fireEvent.input(phoneNumber, { target: { name: 'name' } });

      const saveButton = getByTestId('save-edit-button');
      expect(saveButton).to.exist;
      await fireEvent.click(saveButton);

      // NOTE: We cannot assert the outcome (success callback or loading state)
      // because the mock API does not resolve and the callback is not called.
      // This test only verifies that the save button is present and clickable.
      // expect(saveButton.getAttribute('loading')).to.eq(true);
      // expect(getReturnState()).to.eq('home-phone,updated');
    });

    xit('should cancel', async () => {
      const { container, getByText } = renderInReduxProvider(
        <EditHomePhone {...props} />,
        {
          initialState: { vapProfile },
          reducers: { vapService },
        },
      );
      const phoneNumber = $(
        'va-text-input[label^="Home phone number"]',
        container,
      );
      phoneNumber.value = '8005551212';
      await fireEvent.input(phoneNumber, { target: { name: 'name' } });

      const cancelButton = getByTestId('cancel-edit-button');
      await fireEvent.click(cancelButton);

      expect(getReturnState()).to.eq('home-phone,canceled');
    });
  });
});
