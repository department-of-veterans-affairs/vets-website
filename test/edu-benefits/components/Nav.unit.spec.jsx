import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Nav from '../../../src/js/edu-benefits/components/Nav';

describe('<Nav>', () => {
  it('should render all panels', () => {
    const currentUrl = '/some-url';
    const panels = [
      {
        path: '/some-url',
        name: 'Some url',
        sections: []
      },
      {
        path: '/some-url2',
        name: 'Some url2',
        sections: []
      }
    ];
    const sections = {
      '/some-url': {
        complete: false
      },
      '/some-url2': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav sections={sections} panels={panels} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.step').length).to.equal(panels.length);
    expect(tree.everySubTree('.two').length).to.equal(1);
    expect(tree.everySubTree('.step')[0].subTree('h5').text()).to.equal(panels[0].name);
  });
  it('should render all sections in panels', () => {
    const currentUrl = '/some-url';
    const panels = [
      {
        path: '/some-url',
        name: 'Some url',
        sections: [
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
    const sections = {
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
    const tree = SkinDeep.shallowRender(<Nav sections={sections} panels={panels} currentUrl={currentUrl}/>);
    expect(tree.subTree('.usa-unstyled-list').everySubTree('li').length).to.equal(panels[0].sections.length);
    expect(tree.subTree('.usa-unstyled-list').everySubTree('li')[0].text()).to.equal(panels[0].sections[0].name);
  });
  it('active panels have section-current', () => {
    const currentUrl = '/some-url';
    const panels = [
      {
        path: '/some-url',
        name: 'Some url',
        sections: []
      }
    ];
    const sections = {
      '/some-url': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav sections={sections} panels={panels} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.section-current').length).to.equal(1);
  });
  it('active sections have sub-section-current', () => {
    const currentUrl = '/some-url/thing';
    const panels = [
      {
        path: '/some-url',
        name: 'Some url',
        sections: [{ path: '/some-url/thing', name: 'Test' }]
      }
    ];
    const sections = {
      '/some-url/thing': {
        complete: false
      }
    };
    const tree = SkinDeep.shallowRender(<Nav sections={sections} panels={panels} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.sub-section-current').length).to.equal(1);
  });
  it('complete panels have section-complete', () => {
    const currentUrl = '/some-url';
    const panels = [
      {
        path: '/some-url',
        name: 'Some url',
        sections: []
      }
    ];
    const sections = {
      '/some-url': {
        complete: true
      }
    };
    const tree = SkinDeep.shallowRender(<Nav sections={sections} panels={panels} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.section-complete').length).to.equal(1);
  });
  it('complete panels with sections have section-complete', () => {
    const currentUrl = '/some-url/thing';
    const panels = [
      {
        path: '/some-url',
        name: 'Some url',
        sections: [{ path: '/some-url/thing', name: 'Test' }]
      }
    ];
    const sections = {
      '/some-url/thing': {
        complete: true
      }
    };
    const tree = SkinDeep.shallowRender(<Nav sections={sections} panels={panels} currentUrl={currentUrl}/>);
    expect(tree.everySubTree('.section-complete').length).to.equal(1);
  });
});
