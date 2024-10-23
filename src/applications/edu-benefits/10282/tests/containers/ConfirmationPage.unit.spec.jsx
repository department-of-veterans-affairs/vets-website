import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

const form = {
  submission: {
    timestamp: '2024-01-02T03:04:05.067Z',
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      middle: '',
      last: 'Doe',
    },
  },
};

const formNoData = {
  submission: {},
  data: {},
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree).to.not.be.undefined;

    tree.unmount();
  });

  it('should render without name', () => {
    const tree = shallow(<ConfirmationPage form={formNoData} />);
    expect(tree).to.not.be.undefined;

    tree.unmount();
  });
});
