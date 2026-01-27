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

  const DEFAULT_ANNOUNCEMENT_VALUE = '';

  const updateAnnouncement = (message = DEFAULT_ANNOUNCEMENT_VALUE) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const scheduleReset = resetFn => {
    clearExistingTimeout();
    timeoutRef.current = setTimeout(() => {
      updateAnnouncement();
      resetFn();
    }, timeout);
  };

  const handleCopy = async () => {
    updateAnnouncement();

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);
      setError(null);

      updateAnnouncement(`Copied ${label || value} to clipboard`);
      scheduleReset(() => setCopied(false));

      recordEvent({
        event: 'cta-button-click',
        'button-type': 'secondary',
        'button-click-type': 'copy',
        'button-click-label': label || buttonText,
      });
    } catch (err) {
      setError('Failed to copy');
      setCopied(false);

      updateAnnouncement('Failed to copy');
      scheduleReset(() => setError(null));
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearExistingTimeout();
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
          <va-icon icon="content_copy" size="2" srtext="Copy" />
          <span className="button-text">{copied ? 'Copied!' : buttonText}</span>
        </button>
      ) : (
        <div className="copy-error" role="alert" aria-live="assertive">
          <va-icon icon="error" size="2" srtext="Copy error" />
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
