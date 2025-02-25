import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LicesnseCertificationServiceError from '../../components/LicesnseCertificationServiceError';

describe('<LicenseCertificationServiceError/>', () => {
  it('should render', () => {
    const wrapper = shallow(<LicesnseCertificationServiceError />);
    expect(wrapper.html()).to.not.be.undefined;
    expect(wrapper.find('va-alert').exists()).to.be.true;
    expect(wrapper.find('va-alert').prop('status')).to.equal('error');
    wrapper.unmount();
  });
});
