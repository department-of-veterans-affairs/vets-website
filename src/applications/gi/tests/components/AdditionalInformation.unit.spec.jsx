import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AdditionalInformation from '../../components/profile/AdditionalInformation';

describe('<AdditionalInformation>', () => {
  const defaultProps = {
    institution: { type: 'PUBLIC' },
    constants: { FISCALYEAR: moment().format('YYYY') },
    onShowModal: () => {},
    eduSection103: false,
  };

  it('renders', () => {
    const wrapper = shallow(<AdditionalInformation {...defaultProps} />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('renders section 103 data', () => {
    const props = {
      ...defaultProps,
      eduSection103: true,
      institution: {
        ...defaultProps.institution,
        section103Message: 'Test message',
      },
    };

    const wrapper = shallow(<AdditionalInformation {...props} />);
    expect(wrapper.find('.section-103-message')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders section 103 data only when message set', () => {
    const props = {
      ...defaultProps,
      eduSection103: true,
      institution: {
        ...defaultProps.institution,
        section103Message: '',
      },
    };

    const wrapper = shallow(<AdditionalInformation {...props} />);
    expect(wrapper.find('.section-103-message')).to.have.lengthOf(0);
    wrapper.unmount();
  });
});
