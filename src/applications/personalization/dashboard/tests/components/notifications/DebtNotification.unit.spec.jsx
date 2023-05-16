import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DebtNotification } from '../../../components/notifications/DebtNotification';

describe('<DebtNotification />', () => {
  it('should render', () => {
    const notification = {
      id: '12345',
      type: 'abc',
      attributes: {
        createdAt: '2013-07-16T19:00:00Z',
        dismissed: false,
        templateId: 'abc-xyz',
        updatedAt: '2013-07-16T19:00:00Z',
        vaProfileId: '1',
      },
    };
    const tree = render(
      <DebtNotification
        notification={notification}
        dismissNotification={() => {}}
      />,
    );

    expect(tree.getByTestId('dashboard-notification-alert')).to.not.be.null;
    expect(tree.getByText('You have new debt.')).to.not.be.null;
    expect(tree.getByText('Manage your VA debt')).to.not.be.null;
    expect(tree.getByText('Tuesday, July 16, 2013')).to.not.be.null;
    tree.unmount();
  });
});
