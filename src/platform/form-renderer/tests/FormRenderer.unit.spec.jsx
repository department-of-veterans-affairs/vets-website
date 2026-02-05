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
    const olElement = document.querySelector('#ol-section-0-group-0');
    const listItems = document.querySelectorAll('#ol-section-0-group-0 li');
    const firstItemTextContent = listItems[0].textContent;
    expect(firstItemTextContent).to.equal('Name:Samantha Carrie Reid');

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(1);
    tree.unmount();
  });

  it('should accurately render checklist field as a list item', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    const olElement = document.querySelector('#ol-section-1-group-1');
    const listItems = document.querySelectorAll('#ol-section-1-group-1 li');
    const firstItemTextContent = listItems[0].textContent;
    const secondItemTextContent = listItems[1].textContent;

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(2);
    expect(firstItemTextContent).to.equal(
      'Is this child your biological child?No',
    );
    expect(secondItemTextContent).to.equal(
      "What's your relationship to this child?✓ They're my adopted child✓ They're my stepchild",
    );

    tree.unmount();
  });
  it('screen reader message should be present in the dom', () => {
    const tree = render(<FormRenderer config={config} data={data} />);

    const orderedLists = document.querySelectorAll('ol');
    const count = orderedLists.length;
    const srElement = document.querySelector('#ol-section-1-group-1-continue');

    expect(srElement).to.exist;
    expect(count).to.equal(2);
    expect(srElement.textContent).to.equal(
      'Question numbering continues in this section.',
    );

    tree.unmount();
  });
});
