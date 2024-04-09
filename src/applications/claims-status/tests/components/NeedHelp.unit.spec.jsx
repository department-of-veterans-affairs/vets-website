import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { NeedHelp } from '../../components/NeedHelp';

describe('AskVAQuestions', () => {
  it('should render', () => {
    const { container } = render(<NeedHelp />);
    expect($('va-need-help', container)).to.exist;
    expect($$('va-telephone', container).length).to.equal(2);
  });
});
