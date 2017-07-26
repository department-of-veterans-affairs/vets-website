import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { IntroductionPage } from '../../../src/js/hca/components/IntroductionPage';

import createCommonStore from '../../../src/js/common/store';
import hcaReducer from '../../../src/js/hca/reducer';

const defaultProps = createCommonStore(hcaReducer).getState();

defaultProps.fetchInProgressForm = sinon.spy();
defaultProps.loadInProgressDataIntoForm = sinon.spy();
defaultProps.updateLogInUrl = sinon.spy();

describe('hca <IntroductionPage>', () => {
  it('should render', () => {
    const page = findDOMNode(ReactTestUtils.renderIntoDocument(<IntroductionPage {...defaultProps}/>));

    expect(page.textContent).to.contain('10-10EZ');
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
          }}
          {...defaultProps}/>
    ));

    ReactTestUtils.Simulate.click(page.querySelector('.usa-button-primary'));

    expect(onPush.calledWith(route.pageList[1].path)).to.be.true;
  });
});
