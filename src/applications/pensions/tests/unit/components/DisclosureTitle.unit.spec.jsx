import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import createDisclosureTitle from '../../../components/DisclosureTitle';

describe('Pensions DisclosureTitle', () => {
  it('should render', () => {
    const DisclosureTitle = createDisclosureTitle('test', 'Blah blah');

    const { container } = render(
      <DisclosureTitle
        id="id"
        formData={{ test: { first: 'Jane', last: 'Doe' } }}
      />,
    );

    expect(container.textContent).to.contain('Jane Doe');
    expect(container.textContent).to.contain('Blah blah');
  });

  it('should render spouse name', () => {
    const DisclosureTitle = createDisclosureTitle('spouse', 'Blah blah');

    const { container } = render(
      <DisclosureTitle
        id="id"
        formData={{
          maritalStatus: 'MARRIED',
          marriages: [
            {
              spouseFullName: {
                first: 'John',
                last: 'Doe',
              },
            },
            {
              spouseFullName: {
                first: 'Jane',
                last: 'Doe',
              },
            },
          ],
        }}
      />,
    );

    expect(container.textContent).to.contain('Jane Doe');
    expect(container.textContent).to.contain('Blah blah');
  });
});
