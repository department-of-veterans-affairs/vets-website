import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Covid19PhoneLink from '../../../../components/search-results-items/common/Covid19PhoneLink';

describe('Covid19PhoneLink', () => {
  it('Should render with number', () => {
    const phone = {
      number: '999-456-7890',
    };
    const wrapper = shallow(<Covid19PhoneLink phone={phone} />);
    expect(
      wrapper
        .find('strong')
        .text()
        .trim(),
    ).to.equal('Call to schedule:');
    expect(wrapper.find('Telephone').html()).to.equal(
      '<a class="no-wrap vads-u-margin-left--0p25" href="tel:+19994567890" aria-label="9 9 9. 4 5 6. 7 8 9 0.">999-456-7890</a>',
    );
    wrapper.unmount();
  });

  it('Should render with number and extension', () => {
    const phone = {
      number: '999-456-7890',
      extension: '421',
    };
    const wrapper = shallow(<Covid19PhoneLink phone={phone} />);
    expect(
      wrapper
        .find('strong')
        .text()
        .trim(),
    ).to.equal('Call to schedule:');
    expect(wrapper.find('Telephone').html()).to.equal(
      '<a class="no-wrap vads-u-margin-left--0p25" href="tel:+19994567890,421" aria-label="9 9 9. 4 5 6. 7 8 9 0. extension 4 2 1.">999-456-7890, ext. 421</a>',
    );
    wrapper.unmount();
  });

  it('Should render with number with parsed extension', () => {
    const phone = {
      number: '999-456-7890 x421',
    };
    const wrapper = shallow(<Covid19PhoneLink phone={phone} />);
    expect(
      wrapper
        .find('strong')
        .text()
        .trim(),
    ).to.equal('Call to schedule:');
    expect(wrapper.find('Telephone').html()).to.equal(
      '<a class="no-wrap vads-u-margin-left--0p25" href="tel:+19994567890,421" aria-label="9 9 9. 4 5 6. 7 8 9 0. extension 4 2 1.">999-456-7890, ext. 421</a>',
    );
    wrapper.unmount();
  });

  it('Should not render without number', () => {
    const phone = {};
    const wrapper = shallow(<Covid19PhoneLink phone={phone} />);
    expect(wrapper.html()).to.be.null;
    wrapper.unmount();
  });
});
