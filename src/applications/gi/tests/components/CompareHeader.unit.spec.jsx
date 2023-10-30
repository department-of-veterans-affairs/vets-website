import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import CompareHeader from '../../components/CompareHeader';

describe('<CompareHeader>', () => {
  it('should render', () => {
    const tree = shallow(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
        />
      </BrowserRouter>,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should get document title', () => {
    const tree = mount(
      <BrowserRouter>
        <CompareHeader
          smallScreen
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
        />
      </BrowserRouter>,
    );
    tree.update();

    expect(document.title).to.equal(
      'Compare institutions: GI Bill® Comparison Tool | Veterans Affairs',
    );
    tree.unmount();
  });

  it('should have div with card-wrappe class', () => {
    const tree = mount(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
          smallScreen
        />
      </BrowserRouter>,
    );
    expect(tree.find('div.card-wrapper').text()).to.equal(
      'Test Institution ARemoveTest Institution BRemoveReturn to search to add',
    );
    tree.unmount();
  });

  it('should not have div with card-wrappe class', () => {
    const tree = mount(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
          smallScreen={false}
        />
      </BrowserRouter>,
    );
    expect(tree.find('div.card-wrapper')).to.not.be.true;
    tree.unmount();
  });
});
