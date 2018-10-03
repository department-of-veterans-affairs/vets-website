import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../../1990n/containers/IntroductionPage';

describe('Edu 1990n <IntroductionPage>', () => {
  it('should render', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        saveInProgress={{
          user: {
            login: {},
            profile: {
              services: [],
            },
          },
        }}
      />,
    );
    expect(tree.find('FormTitle').props().title).to.contain('Call to Service');
    expect(tree.find('Connect(SaveInProgressIntro)').exists()).to.be.true;
    expect(tree.find('.process-step').length).to.equal(4);
  });
});
