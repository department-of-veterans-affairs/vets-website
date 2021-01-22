import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ConfirmationPage from '../../containers/ConfirmationPage';
import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../../constants';

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

  const testPage = status =>
    shallow(<ConfirmationPage submissionStatus={status} {...defaultProps} />);

  it('should render success status', () => {
    const tree = testPage(submissionStatuses.succeeded);
    expect(tree.text()).to.contain('Claim ID number');
    tree.unmount();
  });

  it('should render retry status', () => {
    const tree = testPage(submissionStatuses.retry);
    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain("It's taking us longer than expected");
    tree.unmount();
  });
  it('should render exhausted status', () => {
    const tree = testPage(submissionStatuses.exhausted);
    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain("It's taking us longer than expected");
    tree.unmount();
  });
  it('should render apiFailure status', () => {
    const tree = testPage(submissionStatuses.apiFailure);
    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain("It's taking us longer than expected");
    tree.unmount();
  });
  it('should render other status', () => {
    const tree = testPage(submissionStatuses.failed);
    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain('Something went wrong');
    tree.unmount();
  });

  it('should render default print instructions when areConfirmationEmailTogglesOn false', () => {
    const tree = testPage(submissionStatuses.succeeded);
    expect(tree.find('#note-print').text()).to.contain(
      'Please print this page',
    );
    tree.unmount();
  });

  it('should render note about email when areConfirmationEmailTogglesOn true', () => {
    const props = {
      ...defaultProps,
      areConfirmationEmailTogglesOn: true,
    };

    const tree = shallow(
      <ConfirmationPage
        submissionStatus={submissionStatuses.succeeded}
        {...props}
      />,
    );
    expect(tree.find('#note-email').text()).to.contain(
      "We'll send you an email to confirm",
    );
    tree.unmount();
  });

  it('should not render email message when there is an error and areConfirmationEmailTogglesOn true', () => {
    const props = {
      ...defaultProps,
      areConfirmationEmailTogglesOn: true,
      submissionStatus: submissionStatuses.failed,
    };

    const tree = shallow(<ConfirmationPage {...props} />);
    expect(tree.find('#note-email').length).to.equal(0);
    tree.unmount();
  });
  it('should reset wizard state & values', () => {
    sessionStorage.setItem(WIZARD_STATUS, 'a');
    sessionStorage.setItem(FORM_STATUS_BDD, 'b');
    sessionStorage.setItem(SAVED_SEPARATION_DATE, 'c');

    const tree = testPage(submissionStatuses.succeeded);
    expect(tree.text()).to.contain('Claim ID number');
    expect(sessionStorage.getItem(WIZARD_STATUS)).to.be.null;
    expect(sessionStorage.getItem(FORM_STATUS_BDD)).to.be.null;
    expect(sessionStorage.getItem(SAVED_SEPARATION_DATE)).to.be.null;
    tree.unmount();
  });
});
