import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ConfirmationPage from '../../containers/ConfirmationPage';
import { submissionStatuses } from '../../constants';

describe('Disability Benefits 526EZ <ConfirmationPage>', () => {
  const defaultProps = {
    fullName: {
      first: 'First',
      middle: 'M',
      last: 'Last',
      suffix: 'Sr.',
    },
    disabilities: ['something something'],
    submittedAt: '2019-02-20',
  };

  const testPage = (status, text) => {
    const tree = shallow(
      <ConfirmationPage submissionStatus={status} {...defaultProps} />,
    );

    expect(tree.text()).to.contain(text);

    tree.unmount();
  };

  it('should render success status', () => {
    testPage(submissionStatuses.succeeded, 'Claim ID number');
  });

  it('should render retry status', () => {
    testPage(submissionStatuses.retry, 'Confirmation number');
  });
  it('should render exhausted status', () => {
    testPage(submissionStatuses.exhausted, 'Confirmation number');
  });
  it('should render apiFailure status', () => {
    testPage(submissionStatuses.apiFailure, 'Confirmation number');
  });
  it('should render other status', () => {
    testPage(submissionStatuses.failed, 'Something went wrong on our end');
  });
});
