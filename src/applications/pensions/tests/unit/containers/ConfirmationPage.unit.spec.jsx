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

    const heading = tree.everySubTree('h2');
    expect(heading.length).to.eql(1);
    expect(heading[0]?.text()).to.equal('Your Veterans Pension application');

    const alert = tree.everySubTree('va-alert', { status: 'success' });
    expect(alert.length).to.eql(1);

    const info = tree.everySubTree('va-summary-box');
    expect(info.length).to.eql(1);
    expect(info[0]?.subTree('va-button').props.text).to.equal(
      'Print this page for your records',
    );

    const sections = tree.everySubTree('section');
    expect(sections.length).to.eql(3);
    expect(sections[0].subTree('h3').text()).to.equal(
      'If you need to submit supporting documents',
    );
    expect(sections[1].subTree('h3').text()).to.equal('What to expect next');
    expect(sections[2].subTree('h3').text()).to.equal(
      'How to contact us if you have questions',
    );

    const address = tree.everySubTree('p', { className: 'va-address-block' });
    expect(address.length).to.eql(1);

    const phoneNums = tree.everySubTree('va-telephone');
    expect(phoneNums.length).to.eql(2);
    expect(phoneNums[0].props.international).to.be.true;
    expect(phoneNums[1].props.tty).to.be.true;
  });

  it('should render if no submission response', () => {
    const form = generateForm({ hasResponse: false });
    const tree = shallow(<ConfirmationPage form={form} />);

    const confirmation = tree.find('#pension_527ez_submission_confirmation');
    expect(confirmation.length).to.eql(0);
    tree.unmount();
  });
});
