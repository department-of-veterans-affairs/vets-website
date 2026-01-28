import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FormRenderer from '../FormRenderer';

describe('FormRenderer', () => {
  it('should render FormRenderer', () => {
    const config = {
      sections: [
        {
          label: 'Veteran information',
          parts: [
            {
              label: 'Name',
              value: '{{name.first}} {{name.middle}} {{name.last}}',
            },
            {
              label: 'Mailing address',
              parts: [
                {
                  label: 'Street',
                  value: '123 Main Str.',
                },
              ],
            },
          ],
        },
      ],
    };
    const data = {
      name: {
        first: 'Sarah',
        middle: 'Ann',
        last: 'Johnson',
      },
    };
    const tree = render(<FormRenderer config={config} data={data} />);

    expect(tree.getByText('Veteran information')).to.exist;
    expect(tree.getByText('Sarah Ann Johnson')).to.exist;
    tree.unmount();
  });
});
