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
  <div className="medications-refills-skeleton" data-skeleton="true">
    <div className="vads-l-grid-container vads-u-padding-x--0 large-screen:vads-u-padding-x--2">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          {/* Page title skeleton */}
          <div
            className="skeleton-shimmer"
            style={{
              width: '280px',
              height: '36px',
              marginTop: '2rem',
              marginBottom: '1rem',
            }}
            aria-hidden="true"
          />

          {/* Description text skeleton */}
          <div
            className="skeleton-shimmer"
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '20px',
              marginBottom: '2rem',
            }}
            aria-hidden="true"
          />

          {/* Prescription card skeletons */}
          {[1, 2, 3].map(index => (
            <div
              key={index}
              className="skeleton-card"
              style={{
                marginBottom: '1rem',
                padding: '1.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
              }}
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
      </div>
    </div>
  </div>
);

export default MedicationsRefillPageSkeleton;
