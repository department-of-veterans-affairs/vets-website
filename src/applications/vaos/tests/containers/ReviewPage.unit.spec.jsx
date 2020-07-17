import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { FLOW_TYPES, FETCH_STATUS } from '../../utils/constants';

import { ReviewPage } from '../../containers/ReviewPage';

describe('VAOS <ReviewPage>', () => {
  it('should render direct schedule view', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {};

    const tree = shallow(<ReviewPage flowType={flowType} data={data} />);

    expect(tree.find('ReviewDirectScheduleInfo').exists()).to.be.true;
    expect(
      tree
        .find('LoadingButton')
        .children()
        .text(),
    ).to.equal('Confirm appointment');

    tree.unmount();
  });

  it('should render review view', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(<ReviewPage flowType={flowType} data={data} />);

    expect(tree.find('ReviewRequestInfo').exists()).to.be.true;
    expect(
      tree
        .find('LoadingButton')
        .children()
        .text(),
    ).to.equal('Request appointment');
    expect(document.title).contain('Review your appointment details');

    tree.unmount();
  });

  it('should render submit loading state', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(
      <ReviewPage
        submitStatus={FETCH_STATUS.loading}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('LoadingButton').props().isLoading).to.be.true;

    tree.unmount();
  });

  it('should render submit error state', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(
      <ReviewPage
        submitStatus={FETCH_STATUS.failed}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('LoadingButton').props().isLoading).to.be.false;
    expect(tree.find('AlertBox').props().status).to.equal('error');

    tree.unmount();
  });

  it('should render submit error with facility', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(
      <ReviewPage
        submitStatus={FETCH_STATUS.failed}
        flowType={flowType}
        data={data}
        facilityDetails={{}}
      />,
    );
    const alertBox = tree.find('AlertBox');

    expect(tree.find('LoadingButton').props().isLoading).to.be.false;
    expect(alertBox.props().status).to.equal('error');
    expect(
      alertBox
        .dive()
        .find('FacilityAddress')
        .exists(),
    ).to.be.true;
    expect(alertBox.dive().text()).contain('Something went wrong');
    tree.unmount();
  });

  it('should render submit error with facility', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(
      <ReviewPage
        submitStatus={FETCH_STATUS.failed}
        submitStatusVaos400
        flowType={flowType}
        data={data}
        facilityDetails={{}}
      />,
    );
    const alertBox = tree.find('AlertBox');

    expect(tree.find('LoadingButton').props().isLoading).to.be.false;
    expect(alertBox.props().status).to.equal('error');
    expect(
      alertBox
        .dive()
        .find('FacilityAddress')
        .exists(),
    ).to.be.true;
    expect(alertBox.dive().text()).contain(
      'We’re sorry. You can’t schedule your appointment on the VA appointments tool.',
    );
    tree.unmount();
  });

  it('return to new appt page when data is empty', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};
    const router = {
      replace: sinon.spy(),
    };

    const tree = mount(
      <ReviewPage flowType={flowType} data={data} router={router} />,
    );

    expect(router.replace.called).to.be.true;

    tree.unmount();
  });
});
