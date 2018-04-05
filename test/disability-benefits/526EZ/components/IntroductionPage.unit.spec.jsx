import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../../../src/js/disability-benefits/526EZ/components/IntroductionPage';

describe('526 <IntroductionPage>', () => {
  it('should render', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {
          }
        }}
        saveInProgress={{
          user: {
            login: {
            },
            profile: {
              savedForms: [],
              services: []
            }
          }
        }}/>
    );
    expect(tree.find('FormTitle').exists()).to.be.true;
    expect(tree.text()).to.contain('Sign In and Verify Your Identity');
  });
  it('should render signed in', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {
          }
        }}
        saveInProgress={{
          user: {
            login: {
              currentlyLoggedIn: true
            },
            profile: {
              savedForms: [],
              services: []
            }
          }
        }}/>
    );

    expect(tree.find('FormTitle').exists()).to.be.true;
    expect(tree.find('RequiredLoginView').length).to.equal(2);
  });
});
