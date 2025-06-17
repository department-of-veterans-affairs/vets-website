import React from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible skeleton component.
 * Can either use children or rowCount for loader content.
 *
 * @param {string}   [label]      Screen‑reader text (defaults to “Loading…”)
 * @param {string}   [className]  Class names for custom container styling
 * @param {ReactNode} [children]  Rows or any other markup to render
 * @param {string}   [id]         Passed to the data-testid attribute
 * @param {number}   [rowCount]   Number of rows to render
 * @example
 * <Skeleton
 *   label="Loading your claims..."
 *   className="claims-loading-skeleton"
 *   id="claims-loading-skeleton"
 *   rowCount={3}
 * />
 */
export default function LoadingSkeleton({
  label = 'Loading…',
  className = '',
  children,
  id,
  rowCount,
}) {
  const classes = className
    ? `loading-skeleton ${className}`
    : 'loading-skeleton';

  return (
    <div role="status" aria-busy="true" className={classes} data-testid={id}>
      <span className="sr-only">{label}</span>
      {children}
      {rowCount > 0 &&
        Array.from({ length: rowCount }).map((_, index) => <Row key={index} />)}
    </div>
  );
}

LoadingSkeleton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  rowCount: PropTypes.number,
};

/**
 * Loading skeleton row component.
 *
 * @param {string}   [className]  Class names for custom row styling
 * @param {string}   [height]     Height of the row
 * @param {string}   [width]      Width of the row
 * @param {string}   [marginBottom] Margin bottom of the row
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
    ? `loading-skeleton__row ${className}`
    : 'loading-skeleton__row';

  return (
    <div
      aria-hidden="true"
      className={classes}
      style={{ height, width, marginBottom }}
    />
  );
}

Row.propTypes = {
  className: PropTypes.string,
  height: PropTypes.string,
  marginBottom: PropTypes.string,
  width: PropTypes.string,
};

LoadingSkeleton.Row = Row;
