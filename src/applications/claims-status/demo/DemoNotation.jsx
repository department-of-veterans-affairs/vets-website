import React from 'react';
import PropTypes from 'prop-types';
import { useDemoMode } from './DemoModeContext';
import NotationBox, { themes } from './NotationBox';

/**
 * Demo notation component for annotating UI changes.
 * Only renders when demo mode is active.
 *
 * @param {string} title - The title/name of the change
 * @param {string} theme - Visual theme: 'info', 'change', 'new', 'removed', 'api'
 * @param {string} before - Description of the previous state
 * @param {string} after - Description of the new state
 * @param {string} description - General description (used when before/after not applicable)
 */
const DemoNotation = ({
  title,
  theme = 'info',
  before,
  after,
  description,
}) => {
  const { isActive } = useDemoMode();

  if (!isActive) {
    return null;
  }

  const themeConfig = themes[theme] || themes.info;

  return (
    <NotationBox theme={theme}>
      <div style={{ marginBottom: '4px' }}>
        <div style={{ fontStyle: 'italic' }}>{themeConfig.label}</div>
        {title && (
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{title}</div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {before && (
          <div style={{ fontWeight: 'normal', fontStyle: 'italic' }}>
            Before: {before}
          </div>
        )}
        {after && (
          <div>
            <strong>After: {after}</strong>
          </div>
        )}
        {description && (
          <div style={{ fontWeight: 'normal' }}>Note: {description}</div>
        )}
      </div>
    </NotationBox>
  );
};

DemoNotation.propTypes = {
  after: PropTypes.string,
  before: PropTypes.string,
  description: PropTypes.string,
  theme: PropTypes.oneOf(['info', 'change', 'new', 'removed', 'api']),
  title: PropTypes.string,
};

export default DemoNotation;
