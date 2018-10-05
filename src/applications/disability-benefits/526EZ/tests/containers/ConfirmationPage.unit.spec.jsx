import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _ from 'lodash/fp';

import ConfirmationPage from '../../containers/ConfirmationPage';
import initialData from '../schema/initialData.js';

import { submissionStatuses } from '../../constants';

describe('Disability Benefits 526EZ <ConfirmationPage>', () => {
  const defaultProps = {
    fullName: {
      first: 'Sally',
      last: 'Alphonse',
    },
    disabilities: _.set("disabilities[0]['view:selected']", true, initialData)
      .disabilities,
    claimId: '123456',
    jobId: '123abc',
    submittedAt: '2018-04-12',
    submissionStatus: submissionStatuses.succeeded,
  };

  it('should render', () => {
    const tree = shallow(<ConfirmationPage {...defaultProps} />);

    expect(
      tree
        .find('.confirmation-page-title')
        .render()
        .text(),
    ).to.equal('Your claim has been submitted.');
    expect(
      tree
        .find('span')
        .at(1)
        .render()
        .text()
        .trim(),
    ).to.equal('For Sally  Alphonse');
    expect(
      tree
        .find('p')
        .at(0)
        .render()
        .text(),
    ).to.contain('We process applications in the order we receive them.');
    expect(
      tree
        .find('p')
        .at(1)
        .render()
        .text(),
    ).to.contain('Thank you for filing a claim');
    expect(
      tree
        .find('.disability-list')
        .render()
        .text(),
    ).to.contain(initialData.disabilities[0].name);
    expect(
      tree
        .find('.disability-list')
        .render()
        .text(),
    ).to.not.contain(initialData.disabilities[1].name);
  });

  it('should render 4142 helper text when 4142 option selected for any disability', () => {
    const newProps = _.set(
      'disabilities[0][view:uploadPrivateRecords]',
      'no',
      defaultProps,
    );

    const wrapper = shallow(<ConfirmationPage {...newProps} />);
    expect(wrapper.render().text()).to.contain(
      'you’ll need to fill out an Authorization to Disclose Information to the VA (VA Form 21-4142).',
    );
  });

  it('should not render 4142 helper text when 4142 option not selected for any disability', () => {
    const newProps = _.set(
      'disabilities[0][view:uploadPrivateRecords]',
      'yes',
      defaultProps,
    );

    const wrapper = shallow(<ConfirmationPage {...newProps} />);
    expect(wrapper.render().text()).to.not.contain(
      'you’ll need to fill out an Authorization to Disclose Information to the VA (VA Form 21-4142).',
    );
  });

  it('should render a confirmation number', () => {
    const wrapper = shallow(<ConfirmationPage {...defaultProps} />);
    expect(wrapper.render().text()).to.contain(defaultProps.claimId);
  });

  it('should render a formatted full name', () => {
    const fullName = {
      first: 'Sally',
      middle: 'Ruth',
      last: 'Alphonse',
      suffix: 'Jr.',
    };
    const newProps = _.set('fullName', fullName, defaultProps);

    const wrapper = shallow(<ConfirmationPage {...newProps} />);
    const { first, middle, last, suffix } = fullName;
    expect(wrapper.render().text()).to.contain(
      `${first} ${middle} ${last} ${suffix}`,
    );
  });

  it('should render a formatted submission date', () => {
    const wrapper = shallow(<ConfirmationPage {...defaultProps} />);
    expect(wrapper.render().text()).to.contain('April 12, 2018');
  });

  it('should render a success message', () => {
    const wrapper = shallow(<ConfirmationPage {...defaultProps} />);
    const text = wrapper.render().text();
    expect(text).to.contain('Claim ID number');
    expect(text).to.contain(defaultProps.claimId);
  });

  it('should render a "check later" message', () => {
    const wrapper = shallow(
      <ConfirmationPage
        {...defaultProps}
        submissionStatus={submissionStatuses.retry}
      />,
    );
    const text = wrapper.render().text();
    expect(text).to.contain('Please allow 24 hours');
    expect(text).to.contain('Confirmation number');
    expect(text).to.contain(defaultProps.jobId);
  });

  it('should render a failure message', () => {
    const wrapper = shallow(
      <ConfirmationPage
        {...defaultProps}
        submissionStatus={submissionStatuses.failed}
      />,
    );
    const text = wrapper.render().text();
    expect(text).to.not.contain('Please allow 24 hours');
    expect(text).to.contain('Something went wrong');
  });
});
