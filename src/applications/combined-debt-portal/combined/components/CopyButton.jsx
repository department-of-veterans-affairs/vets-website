import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const CopyButton = ({
  value,
  label,
  className = '',
  buttonText = 'Copy',
  timeout = 2000,
}) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const announcementRef = useRef(null);

  const handleCopy = async () => {
    try {
      // throw new Error("Simulated error");
      const textToCopy = value;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setError(null);

      // Announce to screen readers
      if (announcementRef.current) {
        announcementRef.current.textContent = `Copied ${textToCopy} to clipboard`;
      }

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset after default of 2 seconds
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, timeout);

      // Record analytics event
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'secondary',
        'button-click-type': 'copy',
        'button-click-label': label || buttonText,
      });
    } catch (err) {
      setError('Failed to copy');
      setCopied(false);

      if (announcementRef.current) {
        announcementRef.current.textContent = 'Failed to copy to clipboard';
      }

      timeoutRef.current = setTimeout(() => {
        setError(null);
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, timeout);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`copy-button-container ${className}`}>
      {!error ? (
        <>
          <va-icon icon="content_copy" size="1" srtext="Copy" />
          <va-button
            onClick={handleCopy}
            text={copied ? 'Copied!' : buttonText}
            secondary
            aria-describedby="copy-status"
            class="vads-u-border--0 vads-u-padding--0"
          />
        </>
      ) : (
        <div className="copy-error" role="alert">
          <va-icon icon="error" size="1" srtext="Copy error" />
          <span className="vads-u-margin-left--0p5">{error}</span>
        </div>
      )}

      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        className="sr-only"
        id="copy-status"
      />
    </div>
  );
};

CopyButton.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  buttonText: PropTypes.string,
  timeout: PropTypes.number,
};

export default CopyButton;
