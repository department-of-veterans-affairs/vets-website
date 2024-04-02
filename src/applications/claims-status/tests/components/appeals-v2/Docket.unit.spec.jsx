import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Docket from '../../../components/appeals-v2/Docket';
import { APPEAL_ACTIONS } from '../../../utils/appeals-v2-helpers';

describe('Appeals V2 Docket', () => {
  const defaultProps = {
    total: 123456,
    ahead: 23456,
    month: '2006-10-24',
    docketMonth: '2004-04-15',
    appealAction: APPEAL_ACTIONS.original,
    aod: false,
    frontOfDocket: false,
  };
  const amaProps = {
    total: 123456,
    totalAllDockets: 654321,
    ahead: 23456,
    month: '2019-02-01',
    appealAction: APPEAL_ACTIONS.original,
    aod: false,
    type: 'directReview',
    eta: {
      directReview: '2020-01-01',
      hearingRequest: '2025-01-01',
      evidenceSubmission: '2024-01-01',
    },
    eligibleToSwitch: true,
    switchDueDate: '2020-02-19',
  };

  it('should render', () => {
    const wrapper = shallow(<Docket {...defaultProps} />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should display frontOfDocket text', () => {
    const props = { ...defaultProps, frontOfDocket: true };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.text()).to.contain(
      'The Board is currently reviewing appeals from',
    );
    wrapper.unmount();
  });

  it('should display non-frontOfDocket text', () => {
    const wrapper = shallow(<Docket {...defaultProps} />);
    expect(wrapper.text()).to.contain(
      'appeals on the docket, not including Advanced on the Docket',
    );
    wrapper.unmount();
  });

  it('should render DocketCard', () => {
    const wrapper = shallow(<Docket {...defaultProps} />);
    expect(wrapper.find('DocketCard').length).to.equal(1);
    wrapper.unmount();
  });

  it('should not render DocketCard for aod', () => {
    const props = { ...defaultProps, aod: true };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.find('DocketCard').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render DocketCard for postCavcRemand', () => {
    const props = {
      ...defaultProps,
      appealAction: APPEAL_ACTIONS.postCavcRemand,
    };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.find('DocketCard').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render aod when both aod and appeal type postCavcRemand', () => {
    const props = {
      ...defaultProps,
      appealAction: APPEAL_ACTIONS.postCavcRemand,
      aod: true,
    };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.render().text()).to.contain(
      'Your appeal is Advanced on the Docket.',
    );
    wrapper.unmount();
  });

  it('should display aod text', () => {
    const props = { ...defaultProps, aod: true };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.text()).to.contain('Your appeal is Advanced on the Docket.');
    wrapper.unmount();
  });

  it('should display postCavcRemand text', () => {
    const props = {
      ...defaultProps,
      appealAction: APPEAL_ACTIONS.postCavcRemand,
    };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.text()).to.contain(
      'Your appeal was remanded by the U.S. Court of Appeals for Veterans Claims.',
    );
    wrapper.unmount();
  });

  it('should describe the chosen docket', () => {
    const wrapper = shallow(<Docket {...amaProps} />);
    expect(wrapper.text()).to.contain(
      'When you requested a Direct Review appeal',
    );
    wrapper.unmount();
  });

  it('should display the total number of appeals across all dockets', () => {
    const wrapper = shallow(<Docket {...amaProps} />);
    expect(wrapper.text()).to.contain(
      'there are 654,321 appeals waiting at the Board',
    );
    wrapper.unmount();
  });

  it('should include docket switch instructions if eligible', () => {
    const wrapper = shallow(<Docket {...amaProps} />);
    expect(wrapper.text()).to.contain(
      'Can I add new evidence or request a hearing?',
    );
    wrapper.unmount();
  });

  it('should hide docket switch instructions if not eligible', () => {
    const props = { ...amaProps, eligibleToSwitch: false };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.text()).to.not.contain(
      'Can I add new evidence or request a hearing?',
    );
    wrapper.unmount();
  });

  it('should include time estimates for other dockets, ordered by date', () => {
    const wrapper = shallow(<Docket {...amaProps} />);
    expect(wrapper.text()).to.contain(
      'January 2024 — Evidence Submission estimateJanuary 2025 — Hearing Request estimate',
    );
    wrapper.unmount();
  });

  it('should diplay information for the appropriate docket', () => {
    const props = { ...amaProps, type: 'hearingRequest' };
    const wrapper = shallow(<Docket {...props} />);
    expect(wrapper.text()).to.contain(
      'When you requested a Hearing Request appeal',
    );
    expect(wrapper.text()).to.contain(
      'What if I no longer want to request a hearing?',
    );
    expect(wrapper.text()).to.contain(
      'January 2020 — Direct Review estimateJanuary 2024 — Evidence Submission estimate',
    );
    wrapper.unmount();
  });
});
