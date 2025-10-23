import React from 'react';
import PropTypes from 'prop-types';

/**
 * @component
 * A loading skeleton component.
 * Skeleton content can be provided using children or rowCount.
 * Provides accessibility features including screen reader support and ARIA attributes.
 *
 * @param {React.ReactNode} [children]  Rows or any other markup to render
 * @param {string}   [className]  Class names for custom container styling
 * @param {string}   [id]         Passed to the data-testid attribute which appends "-loading-skeleton" to the id
 * @param {boolean}  [isLoading=true]  Indicates whether content is loading. When true, displays skeleton. When false, renders empty but announces srLoadedLabel to screen readers for accessibility.
 * @param {number}   [rowCount]   Number of rows to render
 * @param {string}   [srLabel="Loading…"]      Screen‑reader text when loading
 * @param {string}   [srLoadedLabel="Content has loaded"] Screen‑reader text when loaded
 * @example
 * <Skeleton
 *   className="claims-loading-skeleton"
 *   id="claims"
 *   isLoading={isLoading}
 *   srLabel="Loading your claims..."
 *   srLoadedLabel="Claims have loaded"
 * >
 *   <Skeleton.Row height="1.5rem" width="7rem" marginBottom="1rem" />
 *   <Skeleton.Row height="1.5rem" width="16rem" />
 * </Skeleton>
 */
export default function LoadingSkeleton({
  children,
  className = '',
  id,
  isLoading = true,
  rowCount,
  srLabel = 'Loading…',
  srLoadedLabel = 'Content has loaded',
}) {
  const baseClass = 'loading-skeleton';
  const loadingClass = isLoading ? 'loading-skeleton--loading' : '';
  const classes = `${baseClass} ${loadingClass} ${className || ''}`.trim();

  return (
    <div
      aria-busy={isLoading}
      className={classes}
      data-testid={`${id}-loading-skeleton`}
    >
      <span
        aria-live="polite"
        className="sr-only"
        data-testid={`${id}-loading-skeleton-sr-text`}
      >
        {isLoading ? srLabel : srLoadedLabel}
      </span>
      {isLoading && (
        <>
          {children}
          {rowCount > 0 &&
            Array.from({ length: rowCount }).map((_, index) => (
              <Row key={index} />
            ))}
        </>
      )}
    </div>
  );
}

LoadingSkeleton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  rowCount: PropTypes.number,
  srLabel: PropTypes.string,
  srLoadedLabel: PropTypes.string,
};

/**
 * @component
 * Loading skeleton row component.
 *
 * @param {string}   [className]  Class names for custom row styling
 * @param {string}   [height="1rem"]     Height of the row
 * @param {string}   [width="100%"]      Width of the row
 * @param {string}   [marginBottom=".5rem"] Margin bottom of the row
 * @example
 * <Skeleton>
 *   <Skeleton.Row height="2rem" width="10rem" marginBottom="1rem" />
 * </Skeleton>
 */
function Row({
  className = '',
  height = '1rem',
  width = '100%',
  marginBottom = '.5rem',
}) {
  const classes = className
    ? `loading-skeleton--row ${className}`
    : 'loading-skeleton--row';

  return <div className={classes} style={{ height, width, marginBottom }} />;
}

Row.propTypes = {
  className: PropTypes.string,
  height: PropTypes.string,
  marginBottom: PropTypes.string,
  width: PropTypes.string,
};

LoadingSkeleton.Row = Row;
