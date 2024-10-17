import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CustomPageReview from '../../components/CustomPageReview';
import maximalData from '../fixtures/data/maximal.json';

const props = {
  ...maximalData,
  className: 'vads-u-margin-top--neg4',
  dataValue: '',
  moreRow: true,
};

const invalidProps = {
  data: {},
  className: 'vads-u-margin-top--neg4',
  dataValue: '',
  moreRow: true,
};

const ethnicityAndRaceProps = {
  title: 'Your ethnicity and race',
  question: 'What is your ethnicity?',
  dataValue: 'ethnicity',
  questionTwo: 'What is your race?',
  dataValue2: 'orginRace',
};

const educationProps = {
  title: 'Your education',
  question: 'What’s the highest level of education you have completed?',
  dataValue: 'highestLevelOfEducation.level',
};

describe('<CustomPageReview>', () => {
  it('should render', () => {
    const wrapper = shallow(<CustomPageReview {...props} />);
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should render moreRow with labels', () => {
    const wrapper = shallow(
      <CustomPageReview {...props} {...ethnicityAndRaceProps} />,
    );

    expect(wrapper).to.not.be.undefined;
    expect(wrapper.find('h4').text()).to.equal('Your ethnicity and race');

    expect(wrapper.find('dt').length).to.equal(2);
    expect(wrapper.find('dd').length).to.equal(2);

    expect(
      wrapper
        .find('dt')
        .at(0)
        .text(),
    ).to.equal('What is your ethnicity?');
    expect(
      wrapper
        .find('dd')
        .at(0)
        .text(),
    ).to.equal('Prefer not to answer');

    expect(
      wrapper
        .find('dt')
        .at(1)
        .text(),
    ).to.equal('What is your race?');
    expect(
      wrapper
        .find('dd')
        .at(1)
        .text(),
    ).to.equal('Prefer not to answer');

    wrapper.unmount();
  });

  it('should render nested dataValue', () => {
    const wrapper = shallow(
      <CustomPageReview {...props} {...educationProps} />,
    );
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should render nested dataValue invalid', () => {
    const wrapper = shallow(
      <CustomPageReview {...invalidProps} {...educationProps} />,
    );
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should edit page onClick', () => {
    const editPage = sinon.spy();
    const wrapper = shallow(
      <CustomPageReview {...props} editPage={editPage} />,
    );

    const editButton = wrapper.find('va-button').hostNodes();
    editButton.simulate('click');
    expect(editPage.calledOnce).to.be.true;

    wrapper.unmount();
  });
});
