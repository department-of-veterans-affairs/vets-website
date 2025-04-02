import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { isValid } from 'date-fns';

import {
  ConfirmationPage,
  mapStateToProps,
} from '../../containers/ConfirmationPage';

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
  it('should validate the submission date correctly', () => {
    const validDate = new Date();
    const invalidDate = 'invalid-date-string';

    const wrapper = shallow(
      <ConfirmationPage
        form={{ submission: { timestamp: validDate }, data: {} }}
      />,
    );
    expect(isValid(wrapper.instance().props.form.submission.timestamp)).to.be
      .true;

    wrapper.setProps({
      form: { submission: { timestamp: invalidDate }, data: {} },
    });
    expect(isValid(wrapper.instance().props.form.submission.timestamp)).to.be
      .false;
    wrapper.unmount();
  });
  it('should return the correct state to props', () => {
    const mockState = {
      form: {
        data: {
          veteranFullName: {
            first: 'John',
            middle: 'A',
            last: 'Doe',
            suffix: 'Jr',
          },
        },
        formId: '12345',
        submission: {
          timestamp: '2023-10-01T12:00:00Z',
        },
      },
    };

    const expectedProps = {
      form: mockState.form,
    };

    expect(mapStateToProps(mockState)).to.deep.equal(expectedProps);
  });
});
