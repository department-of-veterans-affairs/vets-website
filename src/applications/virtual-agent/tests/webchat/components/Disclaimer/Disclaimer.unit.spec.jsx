import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import * as AdditionalInfoModule from '../../../../chatbot/features/shell/components/LeftColumnContent/AdditionalInfo';
import * as BeforeYouStartModule from '../../../../chatbot/features/shell/components/LeftColumnContent/BeforeYouStart';
import * as BetaTestingModule from '../../../../chatbot/features/shell/components/LeftColumnContent/BetaTesting';
import * as BreadcrumbsModule from '../../../../chatbot/features/shell/components/LeftColumnContent/Breadcrumbs';
import * as IntroModule from '../../../../chatbot/features/shell/components/LeftColumnContent/Intro';

import Disclaimer from '../../../../chatbot/features/shell/components/LeftColumnContent';

describe('Disclaimer', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Disclaimer', () => {
    it('should render the Disclaimer components', () => {
      sandbox
        .stub(BreadcrumbsModule, 'default')
        .returns(<div data-testId="breadcrumbs" />);
      sandbox.stub(IntroModule, 'default').returns(<div data-testId="intro" />);
      sandbox
        .stub(BetaTestingModule, 'default')
        .returns(<div data-testId="beta-testing" />);
      sandbox
        .stub(BeforeYouStartModule, 'default')
        .returns(<div data-testId="before-you-start" />);
      sandbox
        .stub(AdditionalInfoModule, 'default')
        .returns(<div data-testId="additional-info" />);

      const { getByTestId } = render(<Disclaimer />);

      expect(getByTestId('breadcrumbs')).to.exist;
      expect(getByTestId('intro')).to.exist;
      expect(getByTestId('beta-testing')).to.exist;
      expect(getByTestId('before-you-start')).to.exist;
      expect(getByTestId('additional-info')).to.exist;
    });
  });
});
