import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import LeftColumnContent from '../../../../../chatbot/features/shell/components/LeftColumnContent';
import * as AdditionalInfoModule from '../../../../../chatbot/features/shell/components/LeftColumnContent/AdditionalInfo';
import * as BeforeYouStartModule from '../../../../../chatbot/features/shell/components/LeftColumnContent/BeforeYouStart';
import * as BetaTestingModule from '../../../../../chatbot/features/shell/components/LeftColumnContent/BetaTesting';
import * as BreadcrumbsModule from '../../../../../chatbot/features/shell/components/LeftColumnContent/Breadcrumbs';
import * as IntroModule from '../../../../../chatbot/features/shell/components/LeftColumnContent/Intro';
import * as MoreAboutOurChatbotModule from '../../../../../chatbot/features/shell/components/LeftColumnContent/MoreAboutOurChatbot';

describe('LeftColumnContent', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox
      .stub(BreadcrumbsModule, 'default')
      .returns(<div data-testid="breadcrumbs" />);
    sandbox.stub(IntroModule, 'default').returns(<div data-testid="intro" />);
    sandbox
      .stub(BetaTestingModule, 'default')
      .returns(<div data-testid="beta-testing" />);
    sandbox
      .stub(BeforeYouStartModule, 'default')
      .returns(<div data-testid="before-you-start" />);
    sandbox
      .stub(AdditionalInfoModule, 'default')
      .returns(<div data-testid="additional-info" />);
    sandbox
      .stub(MoreAboutOurChatbotModule, 'default')
      .returns(<div data-testid="more-about-our-chatbot" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders all left column content sections', () => {
    const { getByTestId } = render(<LeftColumnContent />);

    expect(getByTestId('breadcrumbs')).to.exist;
    expect(getByTestId('intro')).to.exist;
    expect(getByTestId('beta-testing')).to.exist;
    expect(getByTestId('before-you-start')).to.exist;
    expect(getByTestId('additional-info')).to.exist;
    expect(getByTestId('more-about-our-chatbot')).to.exist;
  });
});
