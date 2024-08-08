import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithRouter } from '../utils';

import AskVAToDecide from '../../components/AskVAToDecide';

describe('<AskVAToDecide>', () => {
  it('should render component', () => {
    const { container, getByText } = renderWithRouter(<AskVAToDecide />);

    getByText('Ask for your Claim Decision');
    getByText(
      'You can ask us to start evaluating your claim if you don’t have any more documents or evidence to file.',
    );
    expect($('a', container).text).to.equal('View Details');
  });
});
