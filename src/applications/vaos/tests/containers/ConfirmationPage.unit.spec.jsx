import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FLOW_TYPES } from '../../utils/constants';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

describe('VAOS <ConfirmationPage>', () => {
  it('should render direct schedule view', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const closeConfirmationPage = sinon.spy();
    const data = {};
    const fetchFacilityDetails = sinon.spy();

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        closeConfirmationPage={closeConfirmationPage}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('ConfirmationDirectScheduleInfo').exists()).to.be.true;
    expect(fetchFacilityDetails.called).to.be.true;

    tree.unmount();
    expect(closeConfirmationPage.called).to.be.true;
  });

  it('should render request view', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const closeConfirmationPage = sinon.spy();
    const data = {};
    const fetchFacilityDetails = sinon.spy();

    const tree = shallow(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        closeConfirmationPage={closeConfirmationPage}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('ConfirmationRequestInfo').exists()).to.be.true;
    expect(fetchFacilityDetails.called).to.be.true;

    tree.unmount();
    expect(closeConfirmationPage.called).to.be.true;
  });
});
