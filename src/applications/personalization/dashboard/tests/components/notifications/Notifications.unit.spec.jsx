import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';

import { Notifications } from '../../../components/notifications/Notifications';

describe('<Notifications />', () => {
  it('should render', () => {
    const notifications = [
      {
        id: '12345',
        type: 'abc',
        attributes: {
          createdAt: '2023-05-15T19:00:00Z',
          dismissed: false,
          templateId: 'f9947b27-df3b-4b09-875c-7f76594d766d',
          updatedAt: '2023-05-15T19:00:00Z',
          vaProfileId: '1',
        },
      },
      {
        id: '67890',
        type: 'abc',
        attributes: {
          createdAt: '2023-05-14T19:00:00Z',
          dismissed: false,
          templateId: 'f9947b27-df3b-4b09-875c-7f76594d766d',
          updatedAt: '2023-05-14T19:00:00Z',
          vaProfileId: '1',
        },
      },
    ];
    const initialState = {
      featureToggles: {
        [Toggler.TOGGLE_NAMES.myVaEnableNotificationComponent]: false,
      },
    };
    const tree = renderWithStoreAndRouter(
      <Notifications
        getNotifications={() => {}}
        notifications={notifications}
      />,
      { initialState },
    );

    expect(tree.getByText('Notifications')).to.exist;
    expect(tree.getAllByText('You have new debt.').length).to.eq(2);
    expect(tree.getAllByText('Manage your VA debt').length).to.eq(2);
    expect(tree.getByText('Monday, May 15, 2023')).to.exist;
    expect(tree.getByText('Sunday, May 14, 2023')).to.exist;
  });
});
