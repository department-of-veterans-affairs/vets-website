import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SkinDeep from 'skin-deep';
import * as Scroll from 'react-scroll';
import { ConfirmationPage } from '../../../containers/ConfirmationPage';

const { scroller } = Scroll;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const generateForm = ({
  hasResponse = true,
  hasRegionalOffice = true,
  timestamp = new Date().toISOString(),
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
    data: {
      veteranFullName: { first: 'Jane', last: 'Doe' },
    },
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

describe('Income and asset statement confirmation page', () => {
  it('should render', () => {
    const form = generateForm();
    const tree = SkinDeep.shallowRender(<ConfirmationPage form={form} />);

    const heading = tree.everySubTree('h2');
    expect(heading.length).to.eql(1);
    expect(heading[0]?.text()).to.equal('Your application has been submitted');

    const info = tree.everySubTree('va-summary-box');
    expect(info.length).to.eql(1);
    expect(info[0]?.subTree('va-button').props.text).to.equal(
      'Print this page for your records',
    );
  });

  it('should render if no submission response', () => {
    const form = generateForm({ hasResponse: false });
    const tree = shallow(<ConfirmationPage form={form} />);

    const confirmation = tree.find('#pension_527ez_submission_confirmation');
    expect(confirmation.length).to.eql(0);
    tree.unmount();
  });
});
