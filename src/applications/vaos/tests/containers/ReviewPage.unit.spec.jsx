import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ReviewPage } from '../../containers/ReviewPage';

describe('VAOS <ReviewPage>', () => {
  it('should render direct schedule view', () => {
    const data = {
      isDirectSchedule: true,
    };

    const tree = shallow(<ReviewPage data={data} />);

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
    const data = {
      isDirectSchedule: false,
    };

    const tree = shallow(<ReviewPage data={data} />);

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
