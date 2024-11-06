import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import EditLink from '../../../components/EditLink';

describe('EditLink', () => {
  const URL = 'https://dev.va.org/link';
  const subject = () =>
    render(<EditLink href={URL} router={{ currentPage: 'test-stuff' }} />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  it('renders the correct label', () => {
    const { container } = subject();
    const link = $('va-link', container);
    expect(link).to.exist;
    expect(link).to.have.attr('text', 'Edit');
  });
});
