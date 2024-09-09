import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import * as WhatToExpectModule from '../../../components/Disclaimer/WhatToExpect';
import * as ScreenReaderModule from '../../../components/Disclaimer/ScreenReader';
import * as WhatWeCollectModule from '../../../components/Disclaimer/WhatWeCollect';

import MoreAboutOurChatbot from '../../../components/Disclaimer/MoreAboutOurChatbot';

describe('MoreAboutOurChatbot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('MoreAboutOurChatbot', () => {
    it('should have header and info text', () => {
      sandbox
        .stub(WhatToExpectModule, 'default')
        .returns(<div data-testId="what-to-expect" />);
      sandbox
        .stub(ScreenReaderModule, 'default')
        .returns(<div data-testId="screen-reader" />);
      sandbox
        .stub(WhatWeCollectModule, 'default')
        .returns(<div data-testId="what-we-collect" />);

      const { getByTestId, container } = render(<MoreAboutOurChatbot />);

      const header = $('h3', container);

      expect(header).to.exist;
      expect(header.textContent).to.equal('More about our chatbot');

      expect(getByTestId('what-to-expect')).to.exist;
      expect(getByTestId('screen-reader')).to.exist;
      expect(getByTestId('what-we-collect')).to.exist;
    });
  });
});
