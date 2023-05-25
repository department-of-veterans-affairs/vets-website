import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import vapProfile from '../../../../user/profile/vap-svc/tests/fixtures/mockVapProfile.json';
import vapService from '../../../../user/profile/vap-svc/reducers';

import { EditHomePhone } from '../../../src/js/components/EditContactInfo';
import {
  getContent,
  getReturnState,
  clearReturnState,
} from '../../../src/js/utilities/data/profile';

describe('EditContactInfo', () => {
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

    it('should render', () => {
      const { getByText, getByLabelText, container } = renderInReduxProvider(
        <EditHomePhone {...props} />,
        {
          initialState: { vapProfile },
          reducers: { vapService },
        },
      );

      expect(getByText(content.editHomePhone)).to.exist;
      const phoneNumber = getByLabelText('Home phone number', { exact: false });
      expect(phoneNumber).to.exist;
      expect(container.innerHTML).to.include('*Required');
      expect(getByLabelText('Extension', { exact: false })).to.exist;
      expect(getByText('Save')).to.exist;
      expect(getByText('Cancel')).to.exist;
    });
    it('should save', async () => {
      const { getByTestId, getByLabelText } = renderInReduxProvider(
        <EditHomePhone {...props} />,
        {
          initialState: { vapProfile },
          reducers: { vapService },
        },
      );

      const saveButton = getByTestId('save-edit-button');
      const phoneNumber = getByLabelText('Home phone number', { exact: false });
      await fireEvent.change(phoneNumber, { target: { value: '8005551212' } });
      await fireEvent.click(saveButton);

      expect(saveButton.textContent).to.contain('Saving changes');
      // success callback not called until after API call
      // expect(getReturnState()).to.eq('home-phone,updated');
    });
    it('should cancel', async () => {
      const { getByText, getByLabelText } = renderInReduxProvider(
        <EditHomePhone {...props} />,
        {
          initialState: { vapProfile },
          reducers: { vapService },
        },
      );

      const phoneNumber = getByLabelText('Home phone number', { exact: false });
      await fireEvent.change(phoneNumber, { target: { value: '8005551212' } });
      await fireEvent.click(getByText('Cancel'));

      expect(getReturnState()).to.eq('home-phone,canceled');
    });
  });
});
