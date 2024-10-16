import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import UploadRequirements from '../../../config/chapters/documents/UploadRequirements';

const mockStore = (data = {}) => ({
  getState: () => ({ form: { data } }),
  subscribe: () => {},
  dispatch: () => ({
    setFormData: () => {},
  }),
});

describe('UploadRequirements', () => {
  const renderJSX = data =>
    render(
      <Provider store={mockStore(data)}>
        <UploadRequirements />
      </Provider>,
    );

  it('should render VETERAN', () => {
    const data = {
      identity: 'VETERAN',
      vaLoanIndicator: false,
    };
    const { container } = renderJSX(data);

    expect($('h3', container)).to.exist;
    expect($$('li', container).length).to.equal(1);
  });
  it('should render VETERAN & vaLoanIndicator', () => {
    const data = {
      identity: 'VETERAN',
      vaLoanIndicator: true,
    };
    const { container } = renderJSX(data);

    expect($('h3', container)).to.exist;
    expect($$('li', container).length).to.equal(2);
  });
  it('should render ADSM', () => {
    const data = {
      identity: 'ADSM',
      vaLoanIndicator: false,
    };
    const { container } = renderJSX(data);

    expect($('h3', container)).to.exist;
    expect($$('li', container).length).to.equal(1);
  });
  it('should render NADNA', () => {
    const data = {
      identity: 'NADNA',
      vaLoanIndicator: false,
    };
    const { container } = renderJSX(data);

    expect($('h3', container)).to.exist;
    expect($$('li', container).length).to.equal(3);
  });
  it('should render DNANA', () => {
    const data = {
      identity: 'DNANA',
      vaLoanIndicator: false,
    };
    const { container } = renderJSX(data);

    expect($('h3', container)).to.exist;
    expect($$('li', container).length).to.equal(3);
  });
  it('should render DRNA', () => {
    const data = {
      identity: 'DRNA',
      vaLoanIndicator: false,
    };
    const { container } = renderJSX(data);

    expect($('h3', container)).to.exist;
    expect($$('li', container).length).to.equal(2);
  });
});
