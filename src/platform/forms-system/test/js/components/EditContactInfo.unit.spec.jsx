import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import {
  EditHomePhone,
  // EditMobilePhone,
  // EditEmail,
  // EditAddress,
} from '../../../src/js/components/EditContactInfo';
import { getContent } from '../../../src/js/utilities/data/profile';
import vapService from '../../../../user/profile/vap-svc/reducers';

const mockStore = createStore(vapService);

// Skipping these tests for now because we need to mock numerous API calls
describe.skip('EditContactInfo', () => {
  const content = getContent();

  describe('<EditHomePhone>', () => {
    const props = {
      title: content.editHomePhone,
      goToPath: () => {},
      contactPath: 'contact-information',
    };
    it('should render', () => {
      const { getByText, getByLabelText } = render(
        <Provider store={mockStore}>
          <EditHomePhone {...props} />,
        </Provider>,
      );

      expect(getByText(content.editHomePhone)).to.exist;
      const phoneNumber = getByLabelText('Home phone number', { exact: false });
      expect(phoneNumber).to.exist;
      expect(phoneNumber).to.contain.text('Required');
      expect(getByText('Update')).to.exist;
      expect(getByText('Cancel')).to.exist;
    });
  });
});
