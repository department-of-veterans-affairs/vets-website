import React from 'react';

/**
 * Skeleton screen for medications refill page
 * This will be rendered to static HTML at build time
 * and injected into the initial page load for instant visual feedback
 *
 * IMPORTANT: This component must be server-renderable (no browser APIs)
 * and should visually match the structure of MedicationsRefillPage
 */
const MedicationsRefillPageSkeleton = () => (
  <div className="medications-refills-page" data-skeleton="true">
    <h1>Refill prescriptions</h1>

    {/* Prescription list skeleton */}
    <div data-testid="prescription-list" className="vads-u-margin-top--3">
      {[1, 2, 3].map(index => (
        <div
          key={index}
          className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
        >
          {/* Prescription name */}
          <div
            className="skeleton-shimmer"
            style={{
              width: '220px',
              height: '24px',
              marginBottom: '1rem',
            }}
            aria-hidden="true"
          />

          {/* Prescription number */}
          <div
            className="skeleton-shimmer"
            style={{
              width: '200px',
              height: '16px',
              marginBottom: '0.5rem',
            }}
            aria-hidden="true"
          />

          {/* Refills remaining */}
          <div
            className="skeleton-shimmer"
            style={{
              width: '180px',
              height: '16px',
            }}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>

    {/* Button skeleton */}
    <div
      className="skeleton-shimmer"
      style={{
        width: '160px',
        height: '44px',
        marginTop: '2rem',
      }}
      aria-hidden="true"
    />

    {/* Screen reader announcement */}
    <div className="sr-only">Loading prescription refills...</div>
  </div>
);

export default MedicationsRefillPageSkeleton;
