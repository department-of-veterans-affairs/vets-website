import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import Abbr from '../../../components/Abbreviation';
import content from '../../../locales/en/content.json';

describe('CG <Abbr>', () => {
  const subject = props => {
    return render(<Abbr {...props} />);
  };

  it('renders abbrKey text', () => {
    const { queryByText } = subject({ abbrKey: 'pdf' });
    expect(queryByText(content['dfn--pdf-abbr'])).to.exist;
  });

  it('renders the correct title attribute in the abbr tag', () => {
    const { container } = subject({ abbrKey: 'pdf' });
    const abbrElement = container.querySelector('abbr');

    expect(abbrElement).to.have.attribute('title', content['dfn--pdf-title']);
  });
});
