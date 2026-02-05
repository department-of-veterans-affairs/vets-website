import React from 'react';
import PropTypes from 'prop-types';
import { useDemoMode } from './DemoModeContext';
import NotationBox, { themes } from './NotationBox';

/**
 * Generic demo notation component for annotating UI changes.
 * Only renders when demo mode is active.
 *
 * @param {string} title - The title/name of the change
 * @param {string} description - Description of what changed
 * @param {string} theme - Visual theme: 'info', 'change', 'new', 'removed', 'api'
 * @param {string[]} details - Optional list of additional details
 */
const DemoNotation = ({ title, description, theme = 'info', details }) => {
  const { isActive } = useDemoMode();

  if (!isActive) {
    return null;
  }

  const themeConfig = themes[theme] || themes.info;

  return (
    <NotationBox theme={theme}>
      <div style={{ marginBottom: '4px' }}>
        <span style={{ fontWeight: 'bold' }}>{themeConfig.label}</span>
        {title && (
          <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{title}</span>
        )}
      </div>
      {description && <div>{description}</div>}
      {details &&
        details.length > 0 && (
          <ul
            style={{
              margin: '8px 0 0 0',
              paddingLeft: '20px',
            }}
          >
            {details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
    </NotationBox>
  );
};

DemoNotation.propTypes = {
  description: PropTypes.string,
  details: PropTypes.arrayOf(PropTypes.string),
  theme: PropTypes.oneOf(['info', 'change', 'new', 'removed', 'api']),
  title: PropTypes.string,
};

export default DemoNotation;
