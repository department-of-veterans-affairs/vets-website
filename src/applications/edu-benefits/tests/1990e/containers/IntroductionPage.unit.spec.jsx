import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../../1990e/containers/IntroductionPage';

describe('Edu 1990e <IntroductionPage>', () => {
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
    expect(tree.find('FormTitle').props().title).to.contain(
      'Apply to use transferred',
    );
    expect(tree.find('Connect(SaveInProgressIntro)').exists()).to.be.true;
    expect(tree.find('.process-step').length).to.equal(4);
  });
});
