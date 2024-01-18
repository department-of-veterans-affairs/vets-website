import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SkinDeep from 'skin-deep';
import * as Scroll from 'react-scroll';
import { ConfirmationPage } from '../../../containers/ConfirmationPage';
import { scrollToTop } from '../../../helpers';

const generateForm = ({
  hasResponse = true,
  hasRegionalOffice = true,
  timestamp = new Date('12/29/2014'),
} = {}) => {
  return {
    submission: {
      ...(hasResponse && {
        response: {
          confirmationNumber: 'V-PEN-177',
          ...(hasRegionalOffice && {
            regionalOffice: [
              'Attention: Western Region',
              'VA Regional Office',
              'P.O. Box 8888',
              'Muskogee, OK 74402-8888',
            ],
          }),
        },
      }),
      timestamp,
    },
    data: { veteranFullName: { first: 'Jane', last: 'Doe' } },
  };
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

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const form = generateForm();
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

  it('should render with empty regionalOffice', () => {
    const form = generateForm({ hasRegionalOffice: false });
    const tree = shallow(<ConfirmationPage form={form} />);

    expect(tree.find('address').children().length).to.eql(0);
    tree.unmount();
  });

  it('should render if no submission response', () => {
    const form = generateForm({ hasResponse: false });
    const tree = shallow(<ConfirmationPage form={form} />);

    expect(tree.find('.claim-list').children().length).to.eql(4);
    tree.unmount();
  });
});
