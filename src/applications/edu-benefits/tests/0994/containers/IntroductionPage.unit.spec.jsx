import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../../0994/containers/IntroductionPage';

describe('Edu 0994 <IntroductionPage>', () => {
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
      'Apply for Veteran Employment Through Technology Education Courses (VET TEC)',
    );
    expect(tree.find('withRouter(Connect(SaveInProgressIntro))').exists()).to.be
      .true;
    expect(tree.find('.process-step').length).to.equal(4);
    tree.unmount();
  });
});
