import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedApps as setApps } from '../../../slice';

export const ApplicationSelector = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // a stand-in for the actual process config for now
  const processConfig = {
    validEntryNames: ['auth', 'profile', 'mock-form-ae-design-patterns'],
  };

  const dispatch = useDispatch();
  const setSelectedApps = payload => dispatch(setApps(payload));

  const selectedApps = useSelector(state => state.vadx.selectedApps);

  const filteredApps = useMemo(
    () => {
      return processConfig.validEntryNames.filter(app =>
        app.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    },
    [searchTerm],
  );

  const handleAppSelect = e => {
    const selectedApp = e.target.value;
    if (selectedApp && !selectedApps.includes(selectedApp)) {
      setSelectedApps([...selectedApps, selectedApp]);
    }
    e.target.value = ''; // Reset select after choosing
  };

  const handleRemoveApp = app => {
    setSelectedApps(selectedApps.filter(a => a !== app));
  };

  return (
    <div>
      <div className="vads-form-content">
        <label htmlFor="app-search" className="vads-label">
          Search Applications
        </label>
        <input
          id="app-search"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="vads-input"
        />
      </div>

      <div className="vads-form-content">
        <label htmlFor="app-select" className="vads-label">
          Select Applications
        </label>
        <select
          id="app-select"
          onChange={handleAppSelect}
          className="vads-select"
        >
          <option value="">Select an application</option>
          {filteredApps.map(app => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>
      </div>

      <div className="vads-form-content">
        <h3 className="vads-heading-3">Selected Applications:</h3>
        <ul className="vads-list--unstyled">
          {selectedApps.map(app => (
            <li key={app} className="vads-margin-bottom--1">
              <button
                onClick={() => handleRemoveApp(app)}
                className="vads-button vads-button--secondary"
              >
                {app}{' '}
                <span className="vads-u-visibility--screen-reader">Remove</span>{' '}
                x
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="vads-button vads-button--primary"
        onClick={() => setSelectedApps(selectedApps)}
      >
        Test
      </button>
    </div>
  );
};
