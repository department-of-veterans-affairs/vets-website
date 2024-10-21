import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SpouseViewField, {
  FormerSpouseHeader,
} from '../../components/SpouseViewField';

describe('SpouseViewField component', () => {
  it('should render the full name correctly', () => {
    const formData = {
      fullName: {
        first: 'John',
        middle: 'A.',
        last: 'Doe',
        suffix: 'Jr.',
      },
    };

    const { container } = render(<SpouseViewField formData={formData} />);
    const heading = container.querySelector('h4');

    expect(heading).to.exist;
    expect(heading).to.have.text('John A. Doe, Jr.');
    expect(heading).to.have.class('vads-u-margin-y--2');
  });

  it('should render without a middle name and suffix', () => {
    const formData = {
      fullName: {
        first: 'Jane',
        middle: '',
        last: 'Smith',
        suffix: '',
      },
    };

    const { container } = render(<SpouseViewField formData={formData} />);
    const heading = container.querySelector('h4');

    expect(heading).to.exist;
    expect(heading).to.have.text('Jane Smith');
  });
});

describe('FormerSpouseHeader component', () => {
  it('should render the formatted name correctly', () => {
    const formData = {
      fullName: {
        first: 'john',
        last: 'doe',
      },
    };

    const { container } = render(<FormerSpouseHeader formData={formData} />);
    const legend = container.querySelector('legend');
    const heading = legend.querySelector('h3');

    expect(legend).to.exist;
    expect(legend).to.have.class('schemaform-block-title');
    expect(heading).to.exist;
    expect(heading).to.have.text('Former marriage to John Doe');
    expect(heading).to.have.class('vads-u-color--gray-dark');
  });
});
