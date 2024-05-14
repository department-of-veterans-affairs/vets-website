import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import * as BreadcrumbsModule from '../../../components/Disclaimer/Breadcrumbs';
import * as IntroModule from '../../../components/Disclaimer/Intro';
import * as BetaTestingModule from '../../../components/Disclaimer/BetaTesting';
import * as BeforeYouStartModule from '../../../components/Disclaimer/BeforeYouStart';
import * as AdditionalInfoModule from '../../../components/Disclaimer/AdditionalInfo';

import Disclaimer from '../../../components/Disclaimer/Disclaimer';

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
