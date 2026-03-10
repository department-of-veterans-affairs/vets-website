import React, { createRef } from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import SmAlert from '../../../components/shared/SmAlert';

describe('SmAlert component', () => {
  it('renders a va-alert element with forwarded props', () => {
    const { container } = render(
      <SmAlert status="success" slim closeable data-testid="test-alert">
        <p>Alert content</p>
      </SmAlert>,
    );

    const vaAlert = container.querySelector('va-alert');
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attribute('status', 'success');
    expect(vaAlert).to.have.attribute('slim', 'true');
    expect(vaAlert).to.have.attribute('closeable', 'true');
  });

  it('renders children inside va-alert', () => {
    const { container } = render(
      <SmAlert status="info">
        <p data-testid="child-content">Hello veteran</p>
      </SmAlert>,
    );

    const childContent = container.querySelector(
      '[data-testid="child-content"]',
    );
    expect(childContent).to.exist;
    expect(childContent.textContent).to.equal('Hello veteran');
  });

  it('renders sr-only span with aria-live="polite" and aria-atomic="true"', () => {
    const { container } = render(
      <SmAlert status="success" srMessage="Test message">
        <p>Content</p>
      </SmAlert>,
    );

    const srSpan = container.querySelector('span[aria-live="polite"]');
    expect(srSpan).to.exist;
    expect(srSpan).to.have.attribute('aria-atomic', 'true');
    expect(srSpan.className).to.include('sr-only');
  });

  it('sr-only span is initially empty even when srMessage is provided', () => {
    const { container } = render(
      <SmAlert status="success" srMessage="Folder renamed">
        <p>Success</p>
      </SmAlert>,
    );

    const srSpan = container.querySelector('span[aria-live="polite"]');
    expect(srSpan).to.exist;
    // useFocusSettle defers content — should be empty before focus settles
    expect(srSpan.textContent).to.equal('');
  });

  it('sr-only span populates with srMessage after focus settles', async () => {
    const { container } = render(
      <SmAlert status="success" srMessage="Folder was renamed">
        <p>Folder was renamed</p>
      </SmAlert>,
    );

    // Per instruction: use real timers with waitFor and extended timeout
    await waitFor(
      () => {
        const srSpan = container.querySelector('span[aria-live="polite"]');
        expect(srSpan.textContent).to.equal('Folder was renamed');
      },
      { timeout: 4000 },
    );
  });

  it('sr-only span stays empty when srMessage is empty string', async () => {
    const { container } = render(
      <SmAlert status="info" srMessage="">
        <p>No announcement needed</p>
      </SmAlert>,
    );

    const srSpan = container.querySelector('span[aria-live="polite"]');
    expect(srSpan).to.exist;
    expect(srSpan.textContent).to.equal('');

    // Confirm it stays empty even after waiting
    await new Promise(resolve => setTimeout(resolve, 1500));
    expect(srSpan.textContent).to.equal('');
  });

  it('sr-only span stays empty when srMessage is not provided', async () => {
    const { container } = render(
      <SmAlert status="warning">
        <p>Static warning</p>
      </SmAlert>,
    );

    const srSpan = container.querySelector('span[aria-live="polite"]');
    expect(srSpan).to.exist;
    expect(srSpan.textContent).to.equal('');

    await new Promise(resolve => setTimeout(resolve, 1500));
    expect(srSpan.textContent).to.equal('');
  });

  it('forwards ref to the underlying va-alert', () => {
    const ref = createRef();
    render(
      <SmAlert ref={ref} status="info">
        <p>With ref</p>
      </SmAlert>,
    );

    expect(ref.current).to.exist;
    expect(ref.current.tagName.toLowerCase()).to.equal('va-alert');
  });

  it('has correct displayName', () => {
    expect(SmAlert.displayName).to.equal('SmAlert');
  });
});
