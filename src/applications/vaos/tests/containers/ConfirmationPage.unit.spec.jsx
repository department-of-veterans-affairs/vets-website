import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FLOW_TYPES } from '../../utils/constants';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

describe('VAOS <ConfirmationPage>', () => {
  it('should render direct schedule view', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {};
    const fetchFacilityDetails = sinon.spy();

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('ConfirmationDirectScheduleInfo').exists()).to.be.true;
    expect(document.title).contain('Your appointment has been scheduled');
    expect(fetchFacilityDetails.called).to.be.true;

    tree.unmount();
  });

  it('should render request view', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};
    const fetchFacilityDetails = sinon.spy();

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('ConfirmationRequestInfo').exists()).to.be.true;
    expect(fetchFacilityDetails.called).to.be.true;
    expect(document.title).contain(
      'Your appointment request has been submitted',
    );

    tree.unmount();
  });

  it('should call startNewAppointmentFlow when new appointment button clicked', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const startNewAppointmentFlow = sinon.spy();
    const data = {};
    const fetchFacilityDetails = sinon.spy();

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        startNewAppointmentFlow={startNewAppointmentFlow}
        flowType={flowType}
        data={data}
      />,
    );

    tree
      .find('Link')
      .at(1)
      .props()
      .onClick();
    expect(startNewAppointmentFlow.called).to.be.true;

    tree.unmount();
  });
});
