import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import { Wizard } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from 'applications/disability-benefits/all-claims/constants';
import pages from 'applications/disability-benefits/wizard/pages';

describe('the Education Benefits Wizard', () => {
  let defaultProps;
  const setWizardStatus = value => sessionStorage.setItem(WIZARD_STATUS, value);
  const getDateDiff = (diff, type = 'days') => moment().add(diff, type);
  // const getDateFormat = date => date.format('YYYY-M-D');
  // const getDateDiffFormat = (diff, type) =>
  //   getDateFormat(getDateDiff(diff, type));

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

  it('should take you to the 1990E form with no warning alert', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;

    // start BDD flow
    wrapper.find('input[value="bdd"]').invoke('onChange')({
      target: { value: 'bdd' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'bdd',
    });

    // valid BDD = 90-180 days from today
    const year = getDateDiff(200, 'years').year();
    wrapper.find('input[name="discharge-dateYear"]').invoke('onChange')({
      target: { value: year },
    });
    wrapper.find('input[name="discharge-dateYear"]').invoke('onBlur');
    // wrapper
    //   .find('Date')
    //   .props()
    //   .onValueChange({
    //     day: { value: '', dirty: false },
    //     month: { value: '', dirty: false },
    //     year: { value: year, dirty: true },
    //   });
    // console.log(wrapper.find('Date').props(), year, wrapper.html());
    expect(wrapper.find('.input-error-date').exists()).to.be.true;
    // expect(wrapper.find('.input-error-date').text()).to.contain('year between');
    wrapper.unmount();
  });
});
