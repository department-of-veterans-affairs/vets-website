import { expect } from 'chai';
import sinon from 'sinon';

import { IntroductionPage } from '../../../containers/IntroductionPage';

describe('21-4140 container/IntroductionPage', () => {
  let sandbox;

  const defaultRoute = {
    formConfig: {
      prefillEnabled: true,
      savedFormMessages: {},
      formId: '21-4140',
    },
    pageList: [],
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('exports IntroductionPage component', () => {
    expect(IntroductionPage).to.exist;
    expect(typeof IntroductionPage).to.equal('function');
  });

  it('accepts route props', () => {
    const props = {
      route: defaultRoute,
      userLoggedIn: false,
      userIdVerified: false,
    };

    expect(() => IntroductionPage(props)).to.not.throw();
  });
});
