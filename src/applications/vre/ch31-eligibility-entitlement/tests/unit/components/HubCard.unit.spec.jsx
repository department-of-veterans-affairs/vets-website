import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import HubCard from '../../../components/HubCard';

describe('HubCard', () => {
  it('renders title, body, and va-card/va-link-action attributes', () => {
    const props = {
      title: 'Career Planning',
      body: 'Learn about the program and how to get started.',
      icon: 'work',
    };

    const { container, getByText } = render(<HubCard {...props} />);

    const wrapper = container.querySelector('.hub-card');
    expect(wrapper).to.exist;

    const card = container.querySelector('va-card');
    expect(card).to.exist;
    expect(card.getAttribute('icon-name')).to.equal('work');

    getByText('Career Planning');
    getByText('Learn about the program and how to get started.');

    const cta = container.querySelector('va-link-action');
    expect(cta).to.exist;
    expect(cta.getAttribute('href')).to.equal('https://va.gov/vso/');
    expect(cta.getAttribute('text')).to.equal('Call to action');
    expect(cta.getAttribute('type')).to.equal('secondary');
  });
});
