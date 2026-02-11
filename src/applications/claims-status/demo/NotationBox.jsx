import React from 'react';
import PropTypes from 'prop-types';

/**
 * Theme configurations for notation boxes.
 * Each theme has a distinct color scheme for visual identification.
 */
const themes = {
  info: {
    background: '#e3f2fd',
    border: '2px dashed #1976d2',
    label: '📋 Info',
  },
  change: {
    background: '#fffde7',
    border: '2px dashed #f9a825',
    label: '✏️ Change',
  },
  new: {
    background: '#e8f5e9',
    border: '2px dashed #4caf50',
    label: '✨ New',
  },
  removed: {
    background: '#ffebee',
    border: '2px dashed #f44336',
    label: '🗑️ Removed',
  },
  api: {
    background: '#f3e5f5',
    border: '2px dashed #9c27b0',
    label: '🔌 API',
  },
};

/**
 * Reusable styled container for demo notation content.
 * Provides visual distinction for different types of annotations.
 */
const NotationBox = ({ theme = 'info', children, style = {} }) => {
  const themeStyles = themes[theme] || themes.info;

  const containerStyle = {
    background: themeStyles.background,
    border: themeStyles.border,
    borderRadius: '4px',
    padding: '10px 12px',
    marginTop: '12px',
    marginBottom: '12px',
    fontSize: '13px',
    fontFamily: 'monospace',
    lineHeight: '1.5',
    ...style,
  };

  return <div style={containerStyle}>{children}</div>;
};

NotationBox.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  theme: PropTypes.oneOf(['info', 'change', 'new', 'removed', 'api']),
};

export default NotationBox;
export { themes };
