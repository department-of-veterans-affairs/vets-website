import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FormRenderer from '../FormRenderer';

describe('FormRenderer', () => {
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
  it('should render FormRenderer', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    expect(tree.getByText('Veteran information')).to.exist;
    expect(tree.getByText('Sarah Ann Johnson')).to.exist;
    tree.unmount();
  });

  it('should accurately render the sections as an ordered list', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    const olElement = document.querySelector('#ol-1');
    const listItems = document.querySelectorAll('#ol-1 li');

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(1);
    tree.unmount();
  });

  // it('should accurately render checklist field as a list item', () => {
  //   const tree = render(<FormRenderer config={config} data={data} />);

  //   const olElement = document.querySelector('#ol-45');
  //   const listItems = document.querySelectorAll('#ol-45 li');

  //   expect(olElement).to.exist;
  //   expect(listItems.length).to.equal(2);

  //   tree.unmount();
  // });
});
