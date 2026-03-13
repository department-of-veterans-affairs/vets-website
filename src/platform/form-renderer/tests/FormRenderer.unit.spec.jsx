import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FormRenderer from '../FormRenderer';

describe('FormRenderer', () => {
  const submission = require('./testdata');

  it('should render FormRenderer', () => {
    const tree = render(
      <FormRenderer config={submission.config} data={submission.data} />,
    );

    expect(tree.getByText('Section 1: Veteran information')).to.exist;
    tree.unmount();
  });

  it('should accurately render the sections as an ordered list', () => {
    const tree = render(
      <FormRenderer config={submission.config} data={submission.data} />,
    );
    const olElement = document.querySelector('#ol-section-0-group-0');
    const listItems = document.querySelectorAll('#ol-section-0-group-0 li');
    const firstItemTextContent = listItems[0].textContent;
    expect(firstItemTextContent).to.equal('Name:Bruno Mars');

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(3);
    tree.unmount();
  });

  it.skip('should accurately render checklist field as a list item', () => {
    const tree = render(
      <FormRenderer config={submission.config} data={submission.data} />,
    );

    const olElement = document.querySelector('#ol-section-1-group-1');
    const listItems = document.querySelectorAll('#ol-section-1-group-1 li');
    const firstItemTextContent = listItems[0].textContent;
    const secondItemTextContent = listItems[1].textContent;

    expect(olElement).to.exist;
    expect(listItems.length).to.equal(4);
    expect(firstItemTextContent).to.equal(
      'Is this child your biological child?No',
    );
    expect(secondItemTextContent).to.equal(
      "What's your relationship to this child?✓ They're my adopted child✓ They're my stepchild",
    );

    tree.unmount();
  });
  it('screen reader message should be present in the dom', () => {
    const tree = render(
      <FormRenderer config={submission.config} data={submission.data} />,
    );

    const orderedLists = document.querySelectorAll('ol');
    const count = orderedLists.length;
    const srElement = document.querySelector('#ol-section-0-group-1-continue');

    expect(srElement).to.exist;
    expect(count).to.equal(3);
    expect(srElement.textContent).to.equal(
      'Question numbering continues from the previous section.',
    );

    tree.unmount();
  });
});
