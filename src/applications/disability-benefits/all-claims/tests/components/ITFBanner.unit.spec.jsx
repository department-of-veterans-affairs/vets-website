import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';

import ITFBanner from '../../components/ITFBanner';

describe('ITFBanner', () => {
  it('should render an error message', () => {
    const tree = mount(
      <MemoryRouter>
        <ITFBanner status="error" />
      </MemoryRouter>,
    );
    expect(tree.text()).to.contain(
      'We can’t confirm if we have an intent to file on record for you right now',
    );
    tree.unmount();
  });

  it('should render an itf found message', () => {
    const tree = mount(
      <MemoryRouter>
        <ITFBanner status="itf-found" />
      </MemoryRouter>,
    );
    expect(tree.text()).to.contain('You already have an Intent to File');
    tree.unmount();
  });

  it('should render an itf created message', () => {
    const tree = mount(
      <MemoryRouter>
        <ITFBanner status="itf-created" />
      </MemoryRouter>,
    );
    expect(tree.text()).to.contain(
      'Your Intent to File request has been submitted',
    );
    tree.unmount();
  });

  it('should throw an error', () => {
    let tree;
    expect(() => {
      // component throws error in render; mount doesn't return reference until render is ran
      // mount component correctly and use setProps to trigger error state
      tree = mount(
        <MemoryRouter>
          <ITFBanner status="error" />
        </MemoryRouter>,
      );
      tree.setProps({ children: <ITFBanner status="nonsense" /> });
    }).to.throw();
    if (tree) tree.unmount();
  });
});
