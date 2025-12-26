import React from 'react';
import { render, screen } from '@testing-library/react';
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
    render(<FormRenderer config={config} data={data} />);

    expect(screen.getByText('Veteran information')).toBeInTheDocument();
    expect(screen.getByText('Sarah Ann Johnson')).toBeInTheDocument();
  });
});
