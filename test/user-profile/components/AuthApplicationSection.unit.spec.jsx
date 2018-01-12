import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import AuthApplicationSection from '../../../src/js/user-profile/components/AuthApplicationSection.jsx';

describe('<AuthApplicationSection>', () => {
  const props = {
    userProfile: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'rx',
        'messaging',
        'health-records',
        'evss-claims',
        'user-profile',
        'appeals-status',
        'form-save-in-progress',
        'form-prefill',
        'id-card'
      ]
    },
  };
  let windowOpen;
  let oldWindow;
  const setup = () => {
    oldWindow = global.window;
    windowOpen = sinon.stub().returns({ focus: f => f });
    global.window = {
      open: windowOpen,
      dataLayer: []
    };
  };
  const takeDown = () => {
    global.window = oldWindow;
  };
  before(setup);
  after(takeDown);

  it('should render', () => {
    const wrapper = shallow(<AuthApplicationSection {...props}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should display available services as well as verify link if there are some available services', () => {
    const wrapper = shallow(<AuthApplicationSection userProfile={{
      services: [
        'hca',
        'edu-benefits',
      ]
    }}/>);
    const availableServices = wrapper.find('.available-services');
    expect(availableServices.children('p')).to.have.length(2);
    expect(wrapper.find('.unavailable-services').exists()).to.be.true;
  });

  it('should not display verify link if all services are available', () => {
    const wrapper = shallow(<AuthApplicationSection {...props}/>);
    expect(wrapper.find('.available-services').exists()).to.be.true;
    expect(wrapper.find('.unavailable-services').exists()).to.be.false;
  });
});
