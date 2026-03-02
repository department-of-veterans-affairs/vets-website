import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { setFocus } from '../../utils/page';

import Notification from '../../components/Notification';

describe('<Notification>', () => {
  const title = 'Testing title';
  const body = 'Testing body';

  it('should render success class', () => {
    const { container, getByText } = render(
      <Notification title={title} body={body} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'success');
    getByText(title);
    getByText(body);
  });

  it('should render error class', () => {
    const { container, getByText } = render(
      <Notification title={title} body={body} type="error" />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'error');
    getByText(title);
    getByText(body);
  });

  it('should render alert thats closeable', () => {
    const { container, getByText } = render(
      <Notification title={title} body={body} onClose={() => true} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('closeable', 'true');
    getByText(title);
    getByText(body);
  });

  it('should render alert and focus', async () => {
    const setAlertFocus = () => {
      setFocus('.claims-alert');
    };

    const { container } = render(
      <Notification title={title} body={body} onSetFocus={setAlertFocus} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    await waitFor(() => {
      expect(document.activeElement).to.equal(selector);
    });
  });

  it('should pass role prop to va-alert', () => {
    const { container } = render(
      <Notification title={title} body={body} role="alert" type="error" />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('role', 'alert');
  });

  describe('maskTitle prop (PII protection)', () => {
    it('should mask title by default (secure by default)', () => {
      const { container } = render(
        <Notification title="medical-records.pdf" body={body} />,
      );

      const titleElement = container.querySelector('h2');
      expect(titleElement).to.exist;
      expect(titleElement).to.have.attr('data-dd-privacy', 'mask');
      expect(titleElement).to.have.attr(
        'data-dd-action-name',
        'notification title with filename',
      );
    });

    it('should mask title when maskTitle={true}', () => {
      const { container } = render(
        <Notification
          title="upload-failed-document.pdf"
          body={body}
          maskTitle
        />,
      );

      const titleElement = container.querySelector('h2');
      expect(titleElement).to.exist;
      expect(titleElement).to.have.attr('data-dd-privacy', 'mask');
      expect(titleElement).to.have.attr(
        'data-dd-action-name',
        'notification title with filename',
      );
    });

    it('should NOT mask title when maskTitle={false}', () => {
      const { container } = render(
        <Notification
          title="Your claim was submitted"
          body={body}
          maskTitle={false}
        />,
      );

      const titleElement = container.querySelector('h2');
      expect(titleElement).to.exist;
      expect(titleElement).to.not.have.attr('data-dd-privacy');
      expect(titleElement).to.not.have.attr('data-dd-action-name');
    });

    it('should mask error notifications with file names', () => {
      const fileNameTitle = 'Upload failed: john-smith-medical.pdf';
      const { container } = render(
        <Notification title={fileNameTitle} body={body} type="error" />,
      );

      const titleElement = container.querySelector('h2');
      expect(titleElement).to.exist;
      expect(titleElement).to.have.attr('data-dd-privacy', 'mask');
    });

    it('should support explicit false for success messages', () => {
      const { container } = render(
        <Notification
          title="Upload successful"
          body="Your document was uploaded"
          type="success"
          maskTitle={false}
        />,
      );

      const titleElement = container.querySelector('h2');
      expect(titleElement).to.exist;
      expect(titleElement).to.not.have.attr('data-dd-privacy');
    });
  });
});
