import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../containers/IntroductionPage';
import manifest from '../../manifest.json';

const defaultProps = ({ isVerified = true } = {}) => ({
  loggedIn: true,
  isVerified,
  location: {
    pathname: '/introduction',
    basename: manifest.rootUrl,
  },
  route: {
    formConfig: {
      title: 'NOD',
      verifyRequiredPrefill: true,
      savedFormMessages: [],
    },
    pageList: [],
  },
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const tree = shallow(<IntroductionPage {...defaultProps()} />);
    const intro = tree.find('Connect(SaveInProgressIntro)');
    expect(intro).to.exist;
    expect(tree.find('FormTitle').props().title).to.eq('NOD');

    tree.unmount();
  });

  it('should render SaveInProgressIntro', () => {
    const tree = shallow(<IntroductionPage {...defaultProps()} />);
    const saveInProgressIntro = tree.find(
      'withRouter(Connect(SaveInProgressIntro))',
    );
    expect(saveInProgressIntro.length).to.equal(2);

    tree.unmount();
  });

  it('should show verify your account alert', () => {
    const props = defaultProps({ isVerified: false });
    const tree = shallow(<IntroductionPage {...props} />);
    const saveInProgressIntro = tree.find(
      'withRouter(Connect(SaveInProgressIntro))',
    );

    const alertText = tree
      .find('NeedsToVerify')
      .first()
      .html();
    expect(saveInProgressIntro.length).to.eq(0);
    expect(alertText).to.contain('/verify?');
    tree.unmount();
  });

  it('should render start button', () => {
    const props = {
      ...defaultProps(),
      contestableIssues: {
        issues: [{}],
        status: 'done',
        error: '',
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);
    const saveInProgressIntro = tree
      .find('withRouter(Connect(SaveInProgressIntro))')
      .first();
    expect(saveInProgressIntro.props().startText).to.include(
      'Start the Board Appeal request',
    );

    tree.unmount();
  });
});
