import React from 'react';
import { shallow } from 'enzyme';
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
        id="alert"
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

  it('should have a valid header and id', () => {
    const wrapper = shallow(
      <DashboardAlert
        id="alert"
        content={content}
        headline={headline}
        statusHeadline={statusHeadline}
        status={DASHBOARD_ALERT_TYPES.closed}
      />,
    );
    expect(wrapper.find('#dashboard-alert-header-alert').exists()).to.equal(
      true,
    );
    expect(wrapper.find('.dashboard-alert').prop('aria-labelledby')).to.equal(
      'dashboard-alert-header-alert',
    );
    wrapper.unmount();
  });
});
