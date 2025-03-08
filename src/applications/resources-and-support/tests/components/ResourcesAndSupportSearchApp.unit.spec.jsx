import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import ResourcesAndSupportSearchApp from '../../components/ResourcesAndSupportSearchApp';
import * as useArticleDataModule from '../../hooks/useArticleData';
import mockData from '../articles.json';

describe('ResourcesAndSupportSearchApp', () => {
  let useArticleDataStub;

  beforeEach(() => {
    useArticleDataStub = sinon.stub(useArticleDataModule, 'default');
  });

  afterEach(() => {
    useArticleDataStub.restore();
  });

  const assertBasicElementsExist = () => {
    expect(document.querySelector('h1').textContent).to.equal(
      'Resources and Support Search Results',
    );
    expect(
      document.querySelector(
        '[label="Search resources and support articles or all of VA.gov"]',
      ),
    ).to.exist;
    expect(document.querySelector('[label="Resources and Support"]')).to.exist;
    expect(document.querySelector('[label="All VA.gov"]')).to.exist;
    expect(document.querySelector('va-search-input')).to.exist;
    expect(document.querySelector('va-pagination')).to.exist;
    expect(document.querySelector('.usa-unstyled-list')).to.exist;
    expect(document.querySelector('h2').textContent).to.equal(
      'Enter a query to get started.',
    );
  };

  it('renders the correct view for mobile when articles exist', () => {
    window.innerWidth = 400;
    useArticleDataStub.returns([mockData, null]);

    render(<ResourcesAndSupportSearchApp />);

    expect(document.querySelector('va-icon[icon="add"]')).to.exist;
    expect(document.querySelector('va-icon[icon="remove"]')).to.exist;

    assertBasicElementsExist();
  });

  it('renders the correct view for mobile when articles do not exist', () => {
    window.innerWidth = 400;
    useArticleDataStub.returns([null, null]);

    render(<ResourcesAndSupportSearchApp />);

    expect(document.querySelector('va-loading-indicator')).to.exist;
  });

  it('renders the correct view for desktop when articles exist', () => {
    window.innerWidth = 1200;
    useArticleDataStub.returns([mockData, null]);

    render(<ResourcesAndSupportSearchApp />);

    assertBasicElementsExist();
  });

  it('renders the correct view for mobile when articles do not exist', () => {
    window.innerWidth = 1200;
    useArticleDataStub.returns([null, null]);

    render(<ResourcesAndSupportSearchApp />);

    expect(document.querySelector('va-loading-indicator')).to.exist;
  });
});
