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
  <div className="usa-grid">
    <div className="medications-refills-page" data-skeleton="true">
      <h1>Refill prescriptions</h1>
      <p className="vads-u-margin-top--2">
        Bring your medications list to each appointment. And tell your provider
        about any new allergies or reactions. If you use Meds by Mail, you can
        also call your servicing center and ask them to update your records.
      </p>

      {/* Prescription list skeleton */}
      <div data-testid="prescription-list" className="vads-u-margin-top--3">
        {[1, 2, 3].map(index => (
          <div
            key={index}
            className="rx-card-container vads-u-background-color--white vads-u-margin-y--2 vads-u-border--1px vads-u-border-color--base-dark"
          >
            <div className="rx-card-details vads-u-padding--2">
              {/* Prescription name */}
              <div
                className="skeleton-shimmer"
                style={{
                  width: '280px',
                  height: '21px',
                  marginBottom: '0.5rem',
                }}
                aria-hidden="true"
              />

              {/* Prescription number */}
              <div
                className="skeleton-shimmer"
                style={{
                  width: '220px',
                  height: '16px',
                  marginBottom: '1.5rem',
                }}
                aria-hidden="true"
              />

              {/* Status */}
              <div
                className="skeleton-shimmer"
                style={{
                  width: '140px',
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
  </div>
);

export default MedicationsRefillPageSkeleton;
