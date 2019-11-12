import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FLOW_TYPES } from '../../utils/constants';

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

    tree.unmount();
  });
});
