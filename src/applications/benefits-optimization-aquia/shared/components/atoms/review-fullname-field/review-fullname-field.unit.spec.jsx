import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ReviewFullnameField } from './review-fullname-field';

describe('ReviewFullnameField', () => {
  it('should render full name with all parts', () => {
    const name = {
      first: 'Leia',
      middle: 'Amidala',
      last: 'Organa',
      suffix: 'Commander',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Leia Amidala Organa Commander');
  });

  it('should render name without middle name', () => {
    const name = {
      first: 'Wedge',
      last: 'Antilles',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Wedge Antilles');
  });

  it('should render name without suffix', () => {
    const name = {
      first: 'Gial',
      middle: 'Natalon',
      last: 'Ackbar',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Gial Natalon Ackbar');
  });

  it('should render only first and last name', () => {
    const name = {
      first: 'Mon',
      last: 'Mothma',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Mon Mothma');
  });

  it('should use default label "Full Name"', () => {
    const name = {
      first: 'Bail',
      last: 'Organa',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Full Name');
  });

  it('should use custom label', () => {
    const name = {
      first: 'Bail',
      last: 'Organa',
    };

    const { container } = render(
      <ReviewFullnameField label="Veteran Name" value={name} />,
    );

    expect(container.textContent).to.include('Veteran Name');
  });

  it('should render empty text when value is null', () => {
    const { container } = render(<ReviewFullnameField value={null} />);

    expect(container.textContent).to.include('Not provided');
  });

  it('should render empty text when value is undefined', () => {
    const { container } = render(<ReviewFullnameField value={undefined} />);

    expect(container.textContent).to.include('Not provided');
  });

  it('should render custom empty text', () => {
    const { container } = render(
      <ReviewFullnameField value={null} emptyText="Name not available" />,
    );

    expect(container.textContent).to.include('Name not available');
  });

  it('should hide when value is empty and hideWhenEmpty is true', () => {
    const { container } = render(
      <ReviewFullnameField value={null} hideWhenEmpty />,
    );

    expect(container.querySelector('.review-row')).to.not.exist;
  });

  it('should handle empty name object', () => {
    const { container } = render(<ReviewFullnameField value={{}} />);

    expect(container.textContent).to.include('Not provided');
  });

  it('should handle name with only spaces', () => {
    const name = {
      first: '   ',
      last: '   ',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Not provided');
  });

  it('should trim whitespace from name parts', () => {
    const name = {
      first: '  Carlist  ',
      middle: '  R  ',
      last: '  Rieekan  ',
    };

    const { container } = render(<ReviewFullnameField value={name} />);

    expect(container.textContent).to.include('Carlist R Rieekan');
  });
});
