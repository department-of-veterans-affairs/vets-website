import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../containers/IntroductionPage';

describe('Edu 10203 <IntroductionPage>', () => {
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
    expect(tree.find('FormTitle').props().title).to.contain('Apply');
    expect(tree.find('withRouter(Connect(SaveInProgressIntro))').exists()).to.be
      .true;
    expect(tree.find('.process-step').length).to.equal(5);
    tree.unmount();
  });
});
