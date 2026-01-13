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
    if (announcementRef.current) {
      announcementRef.current.textContent = '';
    }

    try {
      const textToCopy = value;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setError(null);

      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = `Copied ${label ||
            value} to clipboard`;
        }
      }, 10);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset after default of 2 seconds
      timeoutRef.current = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
        setCopied(false);
      }, timeout);

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
        announcementRef.current.textContent = 'Failed to copy';
      }

      timeoutRef.current = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
        setError(null);
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
        <button
          className="copy-button"
          aria-label={`Copy ${label || value} to clipboard`}
          aria-describedby="copy-status"
          onClick={handleCopy}
        >
          <va-icon icon="content_copy" size="1" srtext="Copy" />
          <span className="button-text">{copied ? 'Copied!' : buttonText}</span>
        </button>
      ) : (
        <div className="copy-error" role="alert" aria-live="assertive">
          <va-icon icon="error" size="1" srtext="Copy error" />
          <span className="vads-u-margin-left--0p5">{error}</span>
        </div>
      )}

      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="copy-status"
      />
    </div>
  );
};

CopyButton.propTypes = {
  buttonText: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  timeout: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CopyButton;
