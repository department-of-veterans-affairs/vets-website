import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DebtNotification } from '../../../../common/components/DebtNotification';

describe('<DebtNotification />', () => {
  it('should render', () => {
    const notification = {
      id: '12345',
      type: 'abc',
      attributes: {
        createdAt: '2023-05-14T12:00:00Z',
        dismissed: false,
        templateId: 'abc-xyz',
        updatedAt: '2023-05-14T12:00:00Z',
        vaProfileId: '1',
      },
    };
    const tree = render(
      <DebtNotification
        notification={notification}
        dismissNotification={() => {}}
      />,
    );

    expect(tree.getByTestId('dashboard-notification-alert')).to.exist;
    expect(tree.getByText('You have new debt.')).to.exist;
    expect(tree.getByText('Manage your VA debt')).to.exist;
    expect(tree.getByText('Sunday, May 14, 2023')).to.exist;
  });
});
