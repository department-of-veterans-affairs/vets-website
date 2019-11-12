import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FLOW_TYPES } from '../../utils/constants';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

describe('VAOS <ConfirmationPage>', () => {
  it('should render direct schedule view', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {};

    const tree = shallow(<ConfirmationPage flowType={flowType} data={data} />);

    expect(tree.find('ConfirmationDirectScheduleInfo').exists()).to.be.true;

    tree.unmount();
  });

  it('should render request view', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(<ConfirmationPage flowType={flowType} data={data} />);

    expect(tree.find('ConfirmationRequestInfo').exists()).to.be.true;

    tree.unmount();
  });
});
