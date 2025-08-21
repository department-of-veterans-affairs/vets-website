import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { addHours, format } from 'date-fns';
import externalServiceStatus from '~/platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import RenderClaimsWidgetDowntimeNotification from '../../components/RenderClaimsWidgetDowntimeNotification';

const children = <div data-testid="test-children" />;

describe('<RenderClaimsWidgetDowntimeNotification />', () => {
  const expectChildrenToBeRendered = view => {
    expect(view.queryByTestId('dashboard-section-claims-and-appeals-loader')).to
      .not.exist;
    expect(view.getByTestId('test-children')).to.exist;
  };

  it('should render the downtime message when external service status is down', () => {
    const downtime = {
      status: externalServiceStatus.down,
      endTime: { toDate: () => addHours(new Date(), 30) },
    };

    const view = render(
      RenderClaimsWidgetDowntimeNotification(
        { status: downtime.status, endTime: downtime.endTime },
        children,
      ),
    );

    expect(view.getByTestId('dashboard-section-claims-and-appeals-loader')).to
      .exist;
    expect(view.queryByTestId('test-children')).to.not.exist;
    expect(
      view.getByText(format(downtime.endTime.toDate(), 'PPPp'), {
        exact: false,
      }),
    ).to.exist;
  });

  it('should not render the downtime message when when external service status is ok', () => {
    const view = render(
      RenderClaimsWidgetDowntimeNotification(
        { status: externalServiceStatus.ok },
        children,
      ),
    );

    expectChildrenToBeRendered(view);
  });

  it('should not render the downtime message when when external service status is downtime approaching', () => {
    const view = render(
      RenderClaimsWidgetDowntimeNotification(
        { status: externalServiceStatus.downtimeApproaching },
        children,
      ),
    );

    expectChildrenToBeRendered(view);
  });
});
