import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';

import { services, serviceStatus } from '../../../src/js/common/containers/DowntimeNotification';
import { PartialDowntimeNotification, renderPartialDowntime } from '../../../src/js/common/containers/PartialDowntimeNotification';

const beforeNow = moment().subtract(1, 'minute').toDate();
const moreThanHour = moment().add(1, 'hour').add(1, 'hour').toDate();
const endTime = moment().add(6, 'hour').toDate();

const innerText = 'This is the inner text';
function getComponent(dependencies = [], getScheduledDowntime = () => {}, setCurrentStatus = () => {}, unsetCurrentStatus = () => {}) {
  return enzyme.shallow(
    <PartialDowntimeNotification
      dependencies={dependencies}
      scheduledDowntime={null}
      setCurrentStatus={setCurrentStatus}
      unsetCurrentStatus={unsetCurrentStatus}
      getScheduledDowntime={getScheduledDowntime}>
      <span>{innerText}</span>
    </PartialDowntimeNotification>
  );
}

function renderDown() {
  return enzyme.shallow(renderPartialDowntime('Test Service', { endTime: moment(endTime) }, {}, innerText));
}

describe('renderPartialDowntime', () => {
  it('should render content in a warning message', () => {
    const wrapper = renderDown();
    expect(wrapper.text()).to.contain(innerText, 'The message was not rendered');
    expect(wrapper.find(`[data-status="${serviceStatus.down}"]`)).to.have.lengthOf(1, 'The correct status was rendered');
  });
});

describe('<PartialDowntimeNotification/>', () => {
  const scheduledDowntime = [
    { service: services.appeals, startTime: moreThanHour, endTime },
    { service: services.mhv, startTime: beforeNow, endTime }
  ];

  it('should pass a renderDown function to DowntimeNotification', () => {
    const wrapper = getComponent([services.mhv]);
    wrapper.setProps({ isReady: true, scheduledDowntime });
    expect(wrapper.prop('renderDown')).to.be.a('function');
  });
});
