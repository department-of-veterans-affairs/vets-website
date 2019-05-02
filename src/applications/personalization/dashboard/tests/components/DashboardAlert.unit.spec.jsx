import React from 'react';
import { shallow } from 'enzyme';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';

import DashboardAlert, {
  DASHBOARD_ALERT_TYPES,
} from '../../components/DashboardAlert';

const content = <p />;
const headline = 'Headline';
const statusHeadline = 'closed';

describe('<DashboardAlert />', () => {
  it('should have the expected classnames', () => {
    const wrapper = shallow(
      <DashboardAlert
        content={content}
        headline={headline}
        statusHeadline={statusHeadline}
        status={DASHBOARD_ALERT_TYPES.closed}
      />,
    );
    expect(
      wrapper.find('.dashboard-alert').hasClass('dashboard-alert-closed'),
    ).to.equal(true);
    wrapper.unmount();
  });

  it('should pass aXe check', () =>
    axeCheck(
      <DashboardAlert
        content={content}
        headline={headline}
        statusHeadline={statusHeadline}
        status={DASHBOARD_ALERT_TYPES.closed}
      />,
    ));
});
