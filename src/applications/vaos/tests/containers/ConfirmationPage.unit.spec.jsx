import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FLOW_TYPES } from '../../utils/constants';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

describe('VAOS <ConfirmationPage>', () => {
  it('should render direct schedule view', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };
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
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };
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
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };
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

  it('should render view/schedule appointment buttons and fire GA event on click', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const closeConfirmationPage = sinon.spy();
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };
    const fetchFacilityDetails = sinon.spy();
    const startNewAppointmentFlow = sinon.spy();

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        closeConfirmationPage={closeConfirmationPage}
        flowType={flowType}
        data={data}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    const LinkButtons = tree.find('Link');
    expect(LinkButtons.length).to.equal(2);
    LinkButtons.at(1).simulate('click');
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-schedule-another-appointment-button-clicked',
    );
    tree.unmount();
  });

  it('should redirect if no form data', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};
    const fetchFacilityDetails = sinon.spy();
    const router = {
      replace: sinon.spy(),
    };

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        flowType={flowType}
        data={data}
        router={router}
      />,
    );

    expect(tree.find('ConfirmationRequestInfo').exists()).to.be.true;
    expect(fetchFacilityDetails.called).to.be.false;
    expect(router.replace.called).to.be.true;

    tree.unmount();
  });
});
