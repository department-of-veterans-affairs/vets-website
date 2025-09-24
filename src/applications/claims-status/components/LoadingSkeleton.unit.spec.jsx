import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<LoadingSkeleton id="test" />);
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton).to.exist;
    expect(skeleton.classList.contains('loading-skeleton--loading')).to.be.true;

    const srContent = getByTestId('test-loading-skeleton-sr-text');
    expect(srContent.textContent).to.equal('Loading…');
  });

  it('should render children when loading', () => {
    const { getByTestId } = render(
      <LoadingSkeleton id="test">
        <LoadingSkeleton.Row />
        <LoadingSkeleton.Row />
      </LoadingSkeleton>,
    );
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton.querySelectorAll('.loading-skeleton--row').length).to.equal(
      2,
    );
  });

  it('should not render children when not loading', () => {
    const { getByTestId } = render(
      <LoadingSkeleton id="test" isLoading={false}>
        <LoadingSkeleton.Row />
      </LoadingSkeleton>,
    );
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton.querySelectorAll('.loading-skeleton--row').length).to.equal(
      0,
    );
  });

  it('should render rows based on rowCount', () => {
    const { getByTestId } = render(<LoadingSkeleton id="test" rowCount={3} />);
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton.querySelectorAll('.loading-skeleton--row').length).to.equal(
      3,
    );
  });

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <LoadingSkeleton id="test" className="custom-class" />,
    );
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton.classList.contains('custom-class')).to.be.true;
  });

  it('should set aria-busy to true when loading', () => {
    const { getByTestId } = render(<LoadingSkeleton id="test" />);
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton.getAttribute('aria-busy')).to.equal('true');
  });

  it('should set aria-busy to false when not loading', () => {
    const { getByTestId } = render(
      <LoadingSkeleton id="test" isLoading={false} />,
    );
    const skeleton = getByTestId('test-loading-skeleton');
    expect(skeleton.getAttribute('aria-busy')).to.equal('false');
  });

  it('should use custom screen reader label when loading', () => {
    const { getByTestId } = render(
      <LoadingSkeleton
        id="custom"
        srLabel="Custom loading message"
        srLoadedLabel="Custom loaded message"
      />,
    );
    const srContent = getByTestId('custom-loading-skeleton-sr-text');
    expect(srContent.textContent).to.equal('Custom loading message');
  });

  it('should use custom screen reader label when loaded', () => {
    const { getByTestId } = render(
      <LoadingSkeleton
        id="custom"
        isLoading={false}
        srLabel="Custom loading message"
        srLoadedLabel="Custom loaded message"
      />,
    );
    const srContent = getByTestId('custom-loading-skeleton-sr-text');
    expect(srContent.textContent).to.equal('Custom loaded message');
  });

  describe('LoadingSkeleton.Row', () => {
    it('should apply custom styles', () => {
      const { container } = render(
        <LoadingSkeleton.Row height="2rem" width="50%" marginBottom="1rem" />,
      );
      const row = container.querySelector('.loading-skeleton--row');
      expect(row.style.height).to.equal('2rem');
      expect(row.style.width).to.equal('50%');
      expect(row.style.marginBottom).to.equal('1rem');
    });

    it('should apply custom className to row', () => {
      const { container } = render(
        <LoadingSkeleton.Row className="custom-row" />,
      );
      const row = container.querySelector('.loading-skeleton--row');
      expect(row.classList.contains('custom-row')).to.be.true;
    });
  });
});
