import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SkinDeep from 'skin-deep';
import * as Scroll from 'react-scroll';
import { ConfirmationPage } from '../../containers/ConfirmationPage';
import { scrollToTop } from '../../helpers';

const form = {
  submission: {
    response: {
      confirmationNumber: 'V-PEN-177',
      regionalOffice: [
        'Attention: Western Region',
        'VA Regional Office',
        'P.O. Box 8888',
        'Muskogee, OK 74402-8888',
      ],
    },
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe',
    },
  },
};

describe('scrollToTop function', () => {
  let scrollToSpy;
  beforeEach(() => {
    scrollToSpy = sinon.stub(Scroll.scroller, 'scrollTo');
  });
  afterEach(() => {
    scrollToSpy.restore();
  });

  it('should call scroller.scrollTo with correct parameters', () => {
    scrollToTop();
    expect(scrollToSpy.calledOnce).to.be.true;
    expect(
      scrollToSpy.calledWith('topScrollElement', {
        duration: 500,
        delay: 0,
        smooth: true,
      }),
    ).to.be.true;
  });
});

describe('ConfirmationPage', () => {
  let wrapper;
  let preventDefaultSpy;

  beforeEach(() => {
    preventDefaultSpy = sinon.spy();
    wrapper = shallow(<ConfirmationPage form={form} />);
  });

  it('toggleExpanded should toggle isExpanded state and call preventDefault', () => {
    const initialState = wrapper.state('isExpanded');

    wrapper.instance().toggleExpanded({ preventDefault: preventDefaultSpy });
    expect(preventDefaultSpy.calledOnce).to.be.true;
    expect(wrapper.state('isExpanded')).to.equal(!initialState);

    wrapper.instance().toggleExpanded({ preventDefault: preventDefaultSpy });
    expect(wrapper.state('isExpanded')).to.equal(initialState);
  });
});

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ConfirmationPage form={form} />);

    expect(tree.subTree('.confirmation-page-title').text()).to.equal(
      'Claim submitted',
    );
    expect(
      tree
        .everySubTree('span')[1]
        .text()
        .trim(),
    ).to.equal('for Jane Doe');
    expect(tree.everySubTree('li')[2].text()).to.contain('Western Region');
    expect(tree.everySubTree('p')[0].text()).to.contain(
      'We process claims in the order we receive them',
    );
    expect(tree.everySubTree('p')[1].text()).to.contain(
      'We may contact you for more information or documents.',
    );
    expect(tree.everySubTree('p')[3].text()).to.contain('VA Regional Office');
  });
});
