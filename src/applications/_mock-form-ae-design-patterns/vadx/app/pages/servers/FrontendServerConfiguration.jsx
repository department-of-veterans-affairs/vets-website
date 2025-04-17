import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaCheckbox,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { FRONTEND_PROCESS_NAME } from '../../../constants';
import { useProcessManager } from '../../../context/processManager';
import { formatDate } from '../../../utils/dates';

const ManifestOption = ({ manifest, selected, onToggle }) => {
  return (
    <div className="vads-u-margin-y--1">
      <VaCheckbox
        checkbox-description={`${
          manifest?.rootUrl ? manifest.rootUrl : 'No URL'
        }`}
        label={`${manifest.appName} (${manifest.entryName})`}
        checked={selected}
        onVaChange={e => onToggle(manifest, e.target.checked)}
        tile
      />
    </div>
  );
};

const scrollableCheckboxStyles = {
  maxHeight: '60vh',
  overflowY: 'auto',
  padding: '0 .5rem',
  border: '1px solid #e1e1e1',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
};

export const FrontendServerConfiguration = ({
  onClose,
  onStart,
  visible,
  starting,
}) => {
  const { manifests, activeApps, setOutput, output } = useProcessManager();
  const [selectedManifests, setSelectedManifests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startError, setStartError] = useState(null);
  const filteredManifests = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return manifests
      .filter(
        manifest =>
          manifest.appName.toLowerCase().includes(searchLower) ||
          manifest.entryName.toLowerCase().includes(searchLower) ||
          (manifest.rootUrl &&
            manifest.rootUrl.toLowerCase().includes(searchLower)),
      )
      .sort((a, b) => {
        const aSelected = selectedManifests.some(
          m => m.entryName === a.entryName,
        );
        const bSelected = selectedManifests.some(
          m => m.entryName === b.entryName,
        );
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return a.appName.localeCompare(b.appName);
      });
  }, [manifests, searchQuery, selectedManifests]);

  const handleManifestToggle = (manifest, isSelected) => {
    setSelectedManifests(prev => {
      if (isSelected) {
        return [...prev, manifest];
      }
      return prev.filter(m => m.entryName !== manifest.entryName);
    });
  };

  const handleStartServer = async () => {
    if (selectedManifests.length === 0) {
      setStartError('Please select at least one application');
      return;
    }
    try {
      setOutput({
        ...output,
        [FRONTEND_PROCESS_NAME]: [
          {
            type: 'stdout',
            data: `Starting frontend dev server for apps ${selectedManifests
              .map(m => m.appName)
              .join(', ')} 🚀`,
            friendlyDate: formatDate(new Date().toISOString()),
          },
        ],
      });
      await onStart(selectedManifests);
    } catch (error) {
      setStartError(error.message);
    }
  };

  useEffect(() => {
    if (visible && activeApps.length > 0) {
      setSelectedManifests(activeApps);
    }
  }, [visible, activeApps]);

  return visible ? (
    <div>
      <VaModal
        visible={visible}
        onCloseEvent={onClose}
        primaryButtonText="Start Server"
        secondaryButtonText="Cancel"
        onPrimaryButtonClick={handleStartServer}
        onSecondaryButtonClick={onClose}
        large
      >
        <div className="vads-u-padding--0" style={{ minHeight: '70vh' }}>
          {starting && (
            <va-loading-indicator message="Starting frontend dev server 🚀" />
          )}
          {manifests.length > 0 && !starting && (
            <>
              <h2 className="vads-u-font-size--md vads-u-margin-top--neg2">
                Select the applications you want dev server to watch
              </h2>

              <div className="vads-u-margin-y--0">
                <VaSearchInput
                  label="Search applications by name or entry"
                  value={searchQuery}
                  onInput={e => setSearchQuery(e.target.value)}
                  buttonText="Search"
                  name="manifest-search"
                  small
                  disableAnalytics
                />
              </div>

              <div className="vads-u-margin--0 vads-u-margin-bottom--0p5">
                <va-additional-info
                  trigger={`Selected ${selectedManifests.length} of ${manifests.length} applications`}
                >
                  <ul className="vads-u-margin-top--1">
                    {selectedManifests.length > 0 ? (
                      selectedManifests.map(manifest => (
                        <li key={manifest.entryName}>
                          {manifest.appName} ({manifest.entryName})
                          {manifest.rootUrl && ` - ${manifest.rootUrl}`}
                        </li>
                      ))
                    ) : (
                      <li>No applications selected</li>
                    )}
                  </ul>
                </va-additional-info>
              </div>

              <div>
                <div style={scrollableCheckboxStyles}>
                  {filteredManifests.map(manifest => (
                    <ManifestOption
                      key={manifest.entryName}
                      manifest={manifest}
                      selected={selectedManifests.some(
                        m => m.entryName === manifest.entryName,
                      )}
                      onToggle={handleManifestToggle}
                    />
                  ))}
                </div>
              </div>

              {startError && (
                <va-alert
                  status="error"
                  slim
                  class="vads-u-margin-top--0p5 vads-u-margin-bottom--neg2"
                >
                  {`Error Starting Server: ${startError}`}
                </va-alert>
              )}
            </>
          )}
        </div>
      </VaModal>
    </div>
  ) : null;
};

FrontendServerConfiguration.propTypes = {
  starting: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};

ManifestOption.propTypes = {
  manifest: PropTypes.shape({
    appName: PropTypes.string.isRequired,
    entryName: PropTypes.string.isRequired,
    rootUrl: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
