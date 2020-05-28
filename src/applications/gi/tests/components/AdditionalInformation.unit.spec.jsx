import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import AdditionalInformation from '../../components/profile/AdditionalInformation';

describe('<AdditionalInformation>', () => {
  const defaultProps = {
    institution: { type: 'PUBLIC' },
    constants: { FISCALYEAR: moment().format('YYYY') },
    onShowModal: () => {},
  };

  it('renders', () => {
    const wrapper = shallow(<AdditionalInformation {...defaultProps} />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  describe('section 103 info', () => {
    const props = {
      ...defaultProps,
      institution: {
        ...defaultProps.institution,
        section103Message: 'Test message',
      },
    };

    it('renders for non-OJT institutions', () => {
      const wrapper = shallow(<AdditionalInformation {...props} />);
      expect(wrapper.find('.section-103-message')).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('renders for OJT institutions', () => {
      const ojtProps = {
        ...props,
        institution: {
          ...props.institution,
          type: 'OJT',
        },
      };

      const wrapper = shallow(<AdditionalInformation {...ojtProps} />);
      expect(wrapper.find('.section-103-message')).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('does not render without message', () => {
      const noMessageProps = {
        ...props,
        institution: {
          ...props.institution,
          section103Message: '',
        },
      };

      const wrapper = shallow(<AdditionalInformation {...noMessageProps} />);
      expect(wrapper.find('.section-103-message')).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('tracks section 103 link click', () => {
      const wrapper = mount(<AdditionalInformation {...props} />);

      expect(global.window.dataLayer.length).to.eq(0);
      wrapper
        .find('.section-103-message button')
        .at(0)
        .simulate('click');

      const recordedEvent = global.window.dataLayer[0];
      expect(recordedEvent.event).to.eq('gibct-modal-displayed');
      expect(recordedEvent['gibct-modal-displayed']).to.eq(
        'protection-against-late-va-payments',
      );
      wrapper.unmount();
    });
  });
});
