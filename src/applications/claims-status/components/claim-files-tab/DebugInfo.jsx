import React from 'react';
import PropTypes from 'prop-types';

const DebugInfo = ({ files, encrypted, lastPayload }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        Debug: Current State
      </div>

      <div data-testid="debug-files">
        <strong>Files:</strong>{' '}
        {files.map(f => f.file?.name).join(', ') || 'None'}
      </div>

      <div data-testid="debug-passwords">
        <strong>Passwords:</strong>{' '}
        {encrypted
          .map(
            (isEncrypted, i) =>
              isEncrypted
                ? `File ${i}: ${files[i]?.password || 'Not Set'}`
                : `File ${i}: N/A`,
          )
          .join(', ') || 'None'}
      </div>

      <div data-testid="debug-doc-types">
        <strong>Document Types:</strong>{' '}
        {lastPayload
          ? lastPayload
              .map((item, i) => `File ${i}: ${item.docType || 'Not Selected'}`)
              .join(', ')
          : 'Not yet submitted'}
      </div>

      <div data-testid="debug-encrypted">
        <strong>Encrypted Status:</strong>{' '}
        {encrypted
          .map((isEnc, i) => `File ${i}: ${isEnc ? 'Encrypted' : 'Regular'}`)
          .join(', ') || 'None'}
      </div>

      {lastPayload && (
        <div data-testid="debug-payload" style={{ marginTop: '10px' }}>
          <strong>Last Submit Payload:</strong>
          <div style={{ fontSize: '11px', color: '#666', margin: '3px 0' }}>
            Note: File objects show as empty {'{}'}, but fileMetadata contains
            the actual file details.
          </div>
          <pre
            style={{
              backgroundColor: '#e8e8e8',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
              margin: '5px 0',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(lastPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

DebugInfo.propTypes = {
  encrypted: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  lastPayload: PropTypes.array,
};

export default DebugInfo;
