import React from 'react';

const sidebarItems = [
  'Personal information',
  'Contact information',
  'Personal health care contacts',
  'Military information',
  'Direct deposit information',
  'Notification settings',
  'Account security',
  'Connected apps',
];

const ListItem = ({ children }) => {
  return (
    <p
      style={{
        boxSizing: 'border-box',
        color: 'rgb(27, 27, 27)',
        cursor: 'auto',
        display: 'list-item',
        fontFamily:
          '"Source Sans Pro Web", "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '16.96px',
        fontStyle: 'normal',
        fontWeight: '400',
        height: '41.42px',
        lineHeight: '25.44px',
        listStyleType: 'none',
        marginBottom: '0',
        textAlign: 'left',
        textSizeAdjust: '100%',
        unicodeBidi: 'isolate',
        visibility: 'visible',
      }}
    >
      {children}
    </p>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sidebarItems.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
