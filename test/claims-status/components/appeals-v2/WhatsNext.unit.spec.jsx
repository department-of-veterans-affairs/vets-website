import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import WhatsNext from '../../../../src/js/claims-status/components/appeals-v2/WhatsNext';

const defaultProps = {
  nextEvents: [
    {
      title: 'Additional evidence',
      description: `VBA must reveiw any additional evidence you submit prios to certifying
      your appeal to the Board of Veterans’ Appeals. This evidence could cause VBA
      to grant your appeal, but if not, they will need to produce an additional
      Statement of the Case.`,
      durationText: '11 months',
      cardDescription: 'Test description contents',
    }, {
      title: 'Appeal certified to the Board',
      description: 'Your appeal will be sent to the Board of Veterans’ Appeals in Washington, D.C.',
      durationText: '2 months',
      cardDescription: 'Test description contents'
    }
  ]
};

describe('<WhatsNext/>', () => {
  it('renders', () => {
    const wrapper = shallow(<WhatsNext {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('renders a list of all next events for a given currentStatus', () => {
    const wrapper = shallow(<WhatsNext {...defaultProps}/>);
    const nextEventList = wrapper.find('NextEvent');
    expect(nextEventList.length).to.equal(defaultProps.nextEvents.length);
  });
});
