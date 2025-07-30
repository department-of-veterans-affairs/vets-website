import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';
import { PaperlessDelivery } from '../../../components/paperless-delivery/PaperlessDelivery';

describe('PaperlessDelivery', () => {
  let screen;

  beforeEach(() => {
    screen = render(<PaperlessDelivery />);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the heading', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Paperless delivery');
  });

  it('should render the description', () => {
    expect(
      screen.getByText(
        /When you sign up, you’ll start receiving fewer documents by mail/,
      ),
    );
  });

  it('should render the note', () => {
    expect(screen.getByText(/enroll in additional paperless delivery options/));
  });
});
