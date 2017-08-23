import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { IntroductionPage } from '../../../src/js/edu-benefits/1995/components/IntroductionPage';

describe('Edu 1995 <IntroductionPage>', () => {
  it('should render', () => {
    const page = findDOMNode(ReactTestUtils.renderIntoDocument(<IntroductionPage/>));

    expect(page.textContent).to.contain('Form 22-1995');
  });
  it('should go to next page', () => {
    const onPush = sinon.spy();
    const route = {
      pageList: [
        {},
        { path: 'next-page' }
      ]
    };
    const page = findDOMNode(ReactTestUtils.renderIntoDocument(
      <IntroductionPage
        route={route}
        router={{
          push: onPush
        }}/>
    ));

    ReactTestUtils.Simulate.click(page.querySelector('.usa-button-primary'));

    expect(onPush.calledWith(route.pageList[1].path)).to.be.true;
  });
});
