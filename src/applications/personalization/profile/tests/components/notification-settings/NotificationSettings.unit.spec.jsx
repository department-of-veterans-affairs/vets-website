import React from 'react';
import { expect } from 'chai';
import NotificationSettings from '../../../components/notification-settings/NotificationSettings';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

describe('<NotificationSettings />', () => {
  it('shows alert when mobile phone is missing', () => {
    const view = renderWithProfileReducersAndRouter(<NotificationSettings />, {
      initialState: {},
      path: '/profile/notifications',
    });

    expect(view.getByText('Add a mobile phone number to your profile')).to
      .exist;
  });
});
