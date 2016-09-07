import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Nav from '../../../src/js/edu-benefits/components/Nav';

describe('<Nav>', () => {
  it('should render all chapters', () => {
    const currentUrl = '/some-url';
    const chapters = [
      {
        name: 'Some url',
        pages: []
      },
      {
        name: 'Some url2',
        pages: []
      }
    ];
    const pages = {
      '/some-url': {
        complete: false
      },
      '/some-url2': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav pages={pages} chapters={chapters} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.step').length).to.equal(chapters.length);
    expect(tree.everySubTree('.two').length).to.equal(1);
    expect(tree.everySubTree('.step')[0].subTree('h5').text()).to.equal(chapters[0].name);
  });
  it('should render all pages in chapters', () => {
    const currentUrl = '/some-url';
    const chapters = [
      {
        path: '/some-url',
        name: 'Some url',
        pages: [
          {
            path: '/some-url/2',
            name: 'Some url 2',
          },
          {
            path: '/some-url/3',
            name: 'Some url 3',
          }
        ]
      }
    ];
    const pages = {
      '/some-url': {
        complete: false
      },
      '/some-url/2': {
        complete: false
      },
      '/some-url/3': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav pages={pages} chapters={chapters} currentUrl={currentUrl}/>);
    expect(tree.subTree('.usa-unstyled-list').everySubTree('li').length).to.equal(chapters[0].pages.length);
    expect(tree.subTree('.usa-unstyled-list').everySubTree('li')[0].text()).to.equal(chapters[0].pages[0].name);
  });
  it('active chapters have section-current', () => {
    const currentUrl = '/some-url';
    const chapters = [
      {
        name: 'Some url',
        pages: [{
          path: '/some-url'
        }]
      }
    ];
    const pages = {
      '/some-url': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav pages={pages} chapters={chapters} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.section-current').length).to.equal(1);
  });
  it('active pages have sub-section-current', () => {
    const currentUrl = '/some-url/thing';
    const chapters = [
      {
        path: '/some-url',
        name: 'Some url',
        pages: [{ path: '/some-url/thing', name: 'Test' }]
      }
    ];
    const pages = {
      '/some-url/thing': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav pages={pages} chapters={chapters} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.sub-section-current').length).to.equal(1);
  });
  it('complete chapters have section-complete', () => {
    const currentUrl = '/some-url';
    const chapters = [
      {
        name: 'Some url',
        pages: [{ path: '/some-url/thing', name: 'Test' }]
      }
    ];
    const pages = {
      '/some-url/thing': {
        complete: true
      }
    };
    const tree = SkinDeep.shallowRender(<Nav pages={pages} chapters={chapters} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.section-complete').length).to.equal(1);
  });
  it('complete chapters with pages have section-complete', () => {
    const currentUrl = '/some-url/thing';
    const chapters = [
      {
        path: '/some-url',
        name: 'Some url',
        pages: [{ path: '/some-url/thing', name: 'Test' }]
      }
    ];
    const pages = {
      '/some-url/thing': {
        complete: true
      }
    };
    const tree = SkinDeep.shallowRender(<Nav pages={pages} chapters={chapters} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.section-complete').length).to.equal(1);
  });
});
