import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Covid19PhoneLink from '../../../../components/search-results-items/common/Covid19PhoneLink';

describe('Covid19PhoneLink', () => {
  it('Should render web component with number', () => {
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
    expect(wrapper.find('va-telephone').html()).to.equal(
      '<va-telephone className="vads-u-margin-left--0p25" contact="9994567890" message-aria-describedby="Call to schedule"></va-telephone>',
    );
    wrapper.unmount();
  });

  it('Should render web component with number and extension', () => {
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
    expect(wrapper.find('va-telephone').html()).to.equal(
      '<va-telephone className="vads-u-margin-left--0p25" contact="9994567890" extension="421" message-aria-describedby="Call to schedule"></va-telephone>',
    );
    wrapper.unmount();
  });

  it('Should render web component with number with parsed extension', () => {
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
    expect(wrapper.find('va-telephone').html()).to.equal(
      '<va-telephone className="vads-u-margin-left--0p25" contact="9994567890" extension="421" message-aria-describedby="Call to schedule"></va-telephone>',
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
