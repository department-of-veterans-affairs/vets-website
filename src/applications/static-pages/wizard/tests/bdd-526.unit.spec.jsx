import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import { Wizard } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from 'applications/disability-benefits/all-claims/constants';
import pages from 'applications/disability-benefits/wizard/pages';

describe('Form 526 Wizard', () => {
  let defaultProps;
  const setWizardStatus = value => sessionStorage.setItem(WIZARD_STATUS, value);
  const getDateDiff = (diff, type = 'days') => moment().add(diff, type);
  const getDateFormat = date => date.format('YYYY-M-D').split('-');
  const getPageHistory = (wrap, page) => wrap.state('pageHistory')[page].name;

  beforeEach(() => {
    setWizardStatus('');
    defaultProps = {
      pages,
      expander: false,
      setWizardStatus,
    };
  });

  it('should render the wizard wrapped in a form element', () => {
    const wrapper = shallow(<Wizard {...defaultProps} />);
    expect(wrapper.exists('form')).to.equal(true);
    wrapper.unmount();
  });

  // TODO: unskip all these tests once `<Date>` is replaced with the `<va-date>` web component
  it.skip('should take you to the disability start with no warning message', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(getPageHistory(wrapper, 0)).to.equal('start');

    // start BDD flow
    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });
    expect(getPageHistory(wrapper, 1)).to.equal('bdd');

    // valid BDD date = between 90-180 days from today; 80 = file disability
    const [year, month, day] = getDateFormat(getDateDiff(80, 'days'));
    wrapper.find('Date').invoke('onValueChange')({
      day: { value: day, dirty: true },
      month: { value: month, dirty: true },
      year: { value: year, dirty: true },
    });

    // start disability benefits form button
    expect(getPageHistory(wrapper, 2)).to.equal('file-claim-early');
    expect(wrapper.find('a[href$="introduction"]')).to.exist;
    expect(wrapper.find('#other_ways_to_file_526')).to.exist;
    wrapper.unmount();
  });

  it.skip('should take you to the BDD start with no warning message', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(getPageHistory(wrapper, 0)).to.equal('start');

    // start BDD flow
    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });
    expect(getPageHistory(wrapper, 1)).to.equal('bdd');

    // valid BDD date = between 90-180 days from today
    const [year, month, day] = getDateFormat(getDateDiff(100, 'days'));
    wrapper.find('Date').invoke('onValueChange')({
      day: { value: day, dirty: true },
      month: { value: month, dirty: true },
      year: { value: year, dirty: true },
    });

    // start BDD form button
    expect(getPageHistory(wrapper, 2)).to.equal('file-bdd');
    expect(wrapper.find('a[href$="introduction"]')).to.exist;
    expect(wrapper.find('#learn_about_bdd')).to.exist;
    wrapper.unmount();
  });

  it.skip('should show the not-eligible warning message', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(getPageHistory(wrapper, 0)).to.equal('start');

    // start BDD flow
    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });
    expect(getPageHistory(wrapper, 1)).to.equal('bdd');

    // valid BDD date = between 90-180 days from today
    const [year, month, day] = getDateFormat(getDateDiff(190, 'days'));
    wrapper.find('Date').invoke('onValueChange')({
      day: { value: day, dirty: true },
      month: { value: month, dirty: true },
      year: { value: year, dirty: true },
    });

    expect(getPageHistory(wrapper, 2)).to.equal('unable-to-file-bdd');
    expect(wrapper.find('#not-eligible-for-bdd')).to.exist;
    wrapper.unmount();
  });

  // Date errors
  it.skip('should show invalid year range error', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(getPageHistory(wrapper, 0)).to.equal('start');

    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });

    // valid BDD date = between 90-180 days from today
    const [year, month, day] = getDateFormat(getDateDiff(100, 'days'));
    wrapper.find('Date').invoke('onValueChange')({
      day: { value: day, dirty: true },
      month: { value: month, dirty: true },
      year: { value: year, dirty: true },
    });
    expect(wrapper.find('a[href$="introduction"]')).to.exist;
    expect(wrapper.find('#learn_about_bdd')).to.exist;

    // now make it invalid
    const [yearFuture] = getDateFormat(getDateDiff(200, 'years'));
    wrapper.find('Date').invoke('onValueChange')({
      day: { value: '', dirty: false },
      month: { value: '', dirty: false },
      year: { value: yearFuture, dirty: true },
    });

    expect(wrapper.find('.input-error-date')).to.exist;
    // This is a key for an i18next translation value - real text will be used
    // in a non-testing environment
    expect(wrapper.find('.usa-input-error-message').text()).to.contain(
      'year-range',
    );
    // make sure we're not rendering the start BDD button
    expect(wrapper.find('a[href$="introduction"]')).to.be.empty;
    expect(wrapper.find('#learn_about_bdd')).to.be.empty;
    wrapper.unmount();
  });
  it.skip('should show invalid date error', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });

    wrapper.find('Date').invoke('onValueChange')({
      day: { value: '1', dirty: true },
      month: { value: '1', dirty: true },
      year: { value: '0000', dirty: true },
    });

    expect(wrapper.find('.input-error-date')).to.exist;
    expect(wrapper.find('.usa-input-error-message').text()).to.contain(
      'provide a valid date',
    );
    wrapper.unmount();
  });
  it.skip('should show date not in the future error', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });

    const [year, month, day] = getDateFormat(getDateDiff(-1, 'days'));
    wrapper.find('Date').invoke('onValueChange')({
      day: { value: day, dirty: true },
      month: { value: month, dirty: true },
      year: { value: year, dirty: true },
    });

    expect(wrapper.find('.input-error-date')).to.exist;
    expect(wrapper.find('.usa-input-error-message').text()).to.contain(
      'must be in the future',
    );
    wrapper.unmount();
  });

  // new claim flow - skipping since wizard is depreacted and 526 subtask will
  // be implemented soon
  it.skip('should allow disability form start when filing a new claim', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(getPageHistory(wrapper, 0)).to.equal('start');

    // start disability benefit flow
    wrapper.find('input[value="appeals"]').invoke('onChange')({
      target: { value: 'appeals' },
    });
    expect(getPageHistory(wrapper, 1)).to.equal('appeals');

    wrapper.find('input[value="file-claim"]').invoke('onChange')({
      target: { value: 'file-claim' },
    });

    // start disability benefits form button
    expect(getPageHistory(wrapper, 2)).to.equal('file-claim');
    expect(wrapper.find('a[href$="introduction"]')).to.exist;
    expect(wrapper.find('#other_ways_to_file_526')).to.exist;
    wrapper.unmount();
  });

  // disagreeing flow - skipping since wizard is depreacted and 526 subtask will
  // be implemented soon
  it.skip('should allow disability form start when filing a new claim', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(getPageHistory(wrapper, 0)).to.equal('start');

    // start disability benefit flow
    wrapper.find('input[value="appeals"]').invoke('onChange')({
      target: { value: 'appeals' },
    });
    expect(getPageHistory(wrapper, 1)).to.equal('appeals');

    wrapper.find('input[value="disagree-file-claim"]').invoke('onChange')({
      target: { value: 'disagree-file-claim' },
    });

    // start disability benefits form button
    expect(getPageHistory(wrapper, 2)).to.equal('disagree-file-claim');
    expect(wrapper.find('a[href$="decision-reviews/"]')).to.exist;
    expect(wrapper.find('a[href$="introduction"]')).to.be.empty;
    wrapper.unmount();
  });
});
