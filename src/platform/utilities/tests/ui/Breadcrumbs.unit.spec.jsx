import React from 'react';
import SkinDeep from 'skin-deep';
import { Link } from 'react-router';
import { expect } from 'chai';

import Breadcrumbs from '../../../../platform/utilities/ui/Breadcrumbs';

const props = {
  pathHref: [
    <a href="/" key="1">Home</a>,
    <a href="/foo/" key="2">Foo Overview</a>,
    <a href="/foo/123" key="3">Foo Page Depth 1</a>,
  ],
  pathLinks: [
    <Link to="/" key="1">Home Link</Link>,
    <Link to="/foo/" key="2">Foo Overview Link</Link>,
    <Link to="/foo/123" key="3">Foo Page Depth 1 Link</Link>,
  ]
};

describe('<Breadcrumbs>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const vdom = tree.getRenderOutput();

    expect(vdom).to.not.be.undefined;
  });

  it('should render custom props', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs
        id="foo"
        listId="foo-list"
        mobileWidth="375">
        {props.pathHref}
      </Breadcrumbs>
    );
    const navElem = tree.subTree('nav');
    const orderedList = tree.subTree('ol');

    expect(navElem.props.id).to.equal('foo');
    expect(orderedList.props.listId).to.equal('foo-list');
    expect(orderedList.props.mobileWidth).to.equal('375');
  });

  it('should render undocumented props', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs aria-labelledby="foo-id-1">
        {props.pathHref}
      </Breadcrumbs>
    );
    const orderedList = tree.subTree('ol');

    expect(orderedList.props['aria-labelledby']).to.equal('foo-id-1');
  });

  it('should render exactly one <nav> element', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const navElem = tree.everySubTree('nav');

    expect(navElem).to.be.ok;
    expect(navElem.length).to.equal(1);
  });

  it('should render the correct <nav> props', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs id="foo">
        {props.pathHref}
      </Breadcrumbs>
    );
    const navElem = tree.subTree('nav');

    expect(navElem.props.className).to.equal('va-nav-breadcrumbs');
    expect(navElem.props['aria-label']).to.equal('Breadcrumb');
    expect(navElem.props['aria-live']).to.equal('polite');
  });

  it('should render exactly one <p> element', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const helperText = tree.everySubTree('p');

    expect(helperText).to.be.ok;
    expect(helperText.length).to.equal(1);
  });

  it('should render the correct <p> props', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const orderedList = tree.subTree('p');

    expect(orderedList.props.className).to.equal('usa-sr-only');
  });

  it('should render exactly one <ol> element', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const orderedList = tree.everySubTree('ol');

    expect(orderedList).to.be.ok;
    expect(orderedList.length).to.equal(1);
  });

  it('should render the correct <ol> props', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs id="foo">
        {props.pathHref}
      </Breadcrumbs>
    );
    const orderedList = tree.subTree('ol');

    expect(orderedList.props.className).to.equal('row va-nav-breadcrumbs-list columns');
  });

  it('should render exactly three <li> elements', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const listItems = tree.everySubTree('li');

    expect(listItems).to.be.ok;
    expect(listItems.length).to.equal(3);
  });

  it('should render an array of <a> tags correctly', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathHref}
      </Breadcrumbs>
    );
    const links = tree.everySubTree('a');

    expect(links).to.be.ok;
    expect(links.length).to.equal(3);
    expect(links[0].text()).to.equal('Home');
    expect(links[1].text()).to.equal('Foo Overview');
    expect(links[2].text()).to.equal('Foo Page Depth 1');
  });

  it('should render an array of <Link> components correctly', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        {props.pathLinks}
      </Breadcrumbs>
    );
    const links = tree.everySubTree('Link');

    expect(links).to.be.ok;
    expect(links.length).to.equal(3);
    expect(links[0].subTree().text()).to.equal('Home Link');
    expect(links[1].subTree().text()).to.equal('Foo Overview Link');
    expect(links[2].subTree().text()).to.equal('Foo Page Depth 1 Link');
  });

  it('should render individual children correctly', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        <a href="/" key="1">Home Hard Coded</a>
        <a href="/foo/" key="2">Foo Overview Hard Coded</a>
        <a href="/foo/123" key="3">Foo Page Depth 1 Hard Coded</a>
      </Breadcrumbs>
    );
    const links = tree.everySubTree('a');

    expect(links).to.be.ok;
    expect(links.length).to.equal(3);
    expect(links[0].text()).to.equal('Home Hard Coded');
    expect(links[1].text()).to.equal('Foo Overview Hard Coded');
    expect(links[2].text()).to.equal('Foo Page Depth 1 Hard Coded');
  });

  it('should render the correct <a> props', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs id="foo">
        {props.pathHref}
      </Breadcrumbs>
    );
    const links = tree.everySubTree('a');

    expect(links[0].props['aria-current']).to.not.exist;
    expect(links[1].props['aria-current']).to.not.exist;
    expect(links[2].props['aria-current']).to.equal('page');
  });
});
