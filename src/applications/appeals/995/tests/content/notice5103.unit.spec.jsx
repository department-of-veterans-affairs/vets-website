import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { Notice5103Description, reviewField } from '../../content/notice5103';

describe('Notice5103Description', () => {
  const analyticsEvent = {
    'alert-box-type': 'info',
    'alert-box-heading': 'If you have a presumptive condition',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': true,
    'reason-for-alert': 'presumptive condition details',
  };
  it('should render', () => {
    global.window.dataLayer = [];
    const { container, getAllByRole } = render(
      <div>
        <Notice5103Description />
      </div>,
    );

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'visible-alert-box',
      ...analyticsEvent,
    });
    const headers = getAllByRole('heading');
    expect(headers.length).to.eq(2);
    expect(headers[0].tagName).to.eq('H3');
    expect(headers[0].textContent).to.contain(
      'If you have a presumptive condition',
    );
    expect(headers[1].tagName).to.eq('H3');
    expect(headers[1].textContent).to.contain('Review and acknowledge');
    expect($('va-alert[visible="true"]', container)).to.exist;
  });
  it('should update analytics after closing alert', async () => {
    global.window.dataLayer = [];
    const { container, getAllByRole } = render(
      <div>
        <Notice5103Description onReviewPage />
      </div>,
    );

    $('va-alert', container).__events.closeEvent();

    await waitFor(() => {
      const event = global.window.dataLayer.slice(-1)[0];
      expect(event).to.deep.equal({
        event: 'int-alert-box-close',
        ...analyticsEvent,
      });
      const headers = getAllByRole('heading');
      expect(headers.length).to.eq(2);
      expect(headers[0].tagName).to.eq('H4'); // hidden when va-alert closed
      expect(headers[1].tagName).to.eq('H4');
      expect($('va-alert[visible="false"]', container)).to.exist;
    });
  });
});

describe('reviewField', () => {
  it('should render yes value', () => {
    const Field = reviewField;
    const { container } = render(
      <Field>{React.createElement('div', { formData: true })}</Field>,
    );

    expect($('dt', container).textContent).to.contain(
      'I certify that I have reviewed',
    );
    expect($('dd', container).textContent).to.contain('Yes, I certify');
  });
  it('should render no value', () => {
    const Field = reviewField;
    const { container } = render(
      <Field>{React.createElement('div', { formData: false })}</Field>,
    );

    expect($('dt', container).textContent).to.contain(
      'I certify that I have reviewed',
    );
    expect($('dd', container).textContent).to.contain('No, I didn’t certify');
  });
});
