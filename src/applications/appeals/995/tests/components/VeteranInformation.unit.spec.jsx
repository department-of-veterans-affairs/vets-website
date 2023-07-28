import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from '../../utils/ui';
import { VeteranInformation } from '../../components/VeteranInformation';

describe('<VeteranInformation>', () => {
  it('should render with empty data', () => {
    const { container } = render(<VeteranInformation />);
    expect($('.blue-bar-block', container)).to.exist;
  });

  it('should render profile data', () => {
    const data = {
      profile: {
        userFullName: {
          first: 'uno',
          middle: 'dos',
          last: 'tres',
        },
        dob: '2000-01-05',
        gender: 'F',
      },
      veteran: {
        vaFileLastFour: '8765',
        ssnLastFour: '5678',
      },
    };
    const { container } = render(<VeteranInformation {...data} />);

    expect($('h3')).to.exist;
    expect($('.name', container).textContent).to.equal('uno dos tres');
    expect($('.ssn', container).textContent).to.contain('5678');
    expect($('.vafn', container).textContent).to.contain('8765');
    expect($('.dob', container).textContent).to.contain('January 5, 2000');
    expect($('.gender', container).textContent).to.contain('Female');
    expect($$('.dd-privacy-mask', container).length).to.eq(5);
  });
});
