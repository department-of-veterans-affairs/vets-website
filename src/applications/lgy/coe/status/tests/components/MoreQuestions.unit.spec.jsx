import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { MoreQuestions } from '../../components/MoreQuestions';

describe('MoreQuestions', () => {
  it('should render', () => {
    const { container } = render(<MoreQuestions />);

    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
