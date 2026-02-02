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
            label: 'Personal information',
            parts: [
              {
                label: 'Name',
                value:
                  '{{veteranInformation.fullName.first}} {{veteranInformation.fullName.middle}} {{veteranInformation.fullName.last}}',
              },
            ],
          },
        ],
      },
      {
        label: 'Add one or more children',
        listSource: 'childrenToAdd',
        parts: [
          {
            label:
              'Child {{LIST_INDEX}}: {{fullName.first}} {{fullName.middle}} {{fullName.last}}',
            parts: [
              {
                label: 'Your relationship to this child',
                parts: [
                  {
                    label: 'Is this child your biological child?',
                    value: "{{formatBool isBiologicalChild 'Yes' 'No'}}",
                  },
                  {
                    label: "What's your relationship to this child?",
                    style: 'checklist',
                    options: [
                      {
                        label: "They're my adopted child",
                        value: '{{relationshipToChild.adopted}}',
                      },
                      {
                        label: "They're my stepchild",
                        value: '{{relationshipToChild.stepchild}}',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const data = {
    veteranInformation: {
      fullName: {
        first: 'Samantha',
        last: 'Reid',
        middle: 'Carrie',
      },
    },
    childrenToAdd: [
      {
        relationshipToChild: {
          adopted: true,
          stepchild: true,
        },
        isBiologicalChild: false,
        fullName: {
          first: 'Andrew',
          middle: 'Benson',
          last: 'Nikigawa',
        },
      },
    ],
  };
  it('should render FormRenderer', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    expect(tree.getByText('Veteran information')).to.exist;
    expect(tree.getByText('Samantha Carrie Reid')).to.exist;
    tree.unmount();
  });

  it('should accurately render the sections as an ordered list', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    const olElement = document.querySelector('#ol-2');
    const listItems = document.querySelectorAll('#ol-2 li');

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(1);
    tree.unmount();
  });

  it('should accurately render checklist field as a list item', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    const olElement = document.querySelector('#ol-7');
    const listItems = document.querySelectorAll('#ol-7 li');

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(2);

    tree.unmount();
  });
});
