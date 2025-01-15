import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaRadioOption,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { MOCK_SERVER_PROCESS_NAME } from '../../../constants';
import { useProcessManager } from '../../../context/processManager';
import { formatDate } from '../../../utils/dates';
import constants from '../../../server/constants/mockServerPaths';
import { MockServerPathsProcessor } from '../../../utils/MockServerPathsProcessor';

const MockServerResponsesRadio = ({ path, name, description }) => {
  return (
    <div className="vads-u-margin-y--1">
      <VaRadioOption
        label={`${name} - ${description}`}
        value={path}
        description={path}
        name="mock-api-server-path"
        tile
      />
    </div>
  );
};

const scrollableRadioGroupStyles = {
  maxHeight: '60vh',
  overflowY: 'auto',
  padding: '0 .5rem',
  border: '1px solid #e1e1e1',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
};

const useMockServerProcessor = (manifests, mockServerPaths) => {
  const [processedData, setProcessedData] = useState([]);
  const [summary, setSummary] = useState(null);

  const processor = useMemo(
    () => {
      return new MockServerPathsProcessor(manifests, mockServerPaths);
    },
    [manifests, mockServerPaths],
  );

  useEffect(
    () => {
      setProcessedData(processor.getMockPathsWithManifestInfo());
      setSummary(processor.getPathsSummary());
    },
    [processor],
  );

  return { mockPaths: processedData, summary };
};

export const MockServerConfigurator = ({
  onClose,
  onStart,
  visible,
  starting,
}) => {
  const {
    manifests: allManifests,
    activeApps,
    setOutput,
    output,
  } = useProcessManager();

  const [selectedManifest, setSelectedManifest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startError, setStartError] = useState(null);

  const { mockPaths, summary } = useMockServerProcessor(
    allManifests,
    constants.MOCK_SERVER_PATHS,
  );

  const filteredResults = useMemo(
    () => {
      const searchLower = searchQuery.toLowerCase();
      return mockPaths.filter(
        path =>
          path.appName.toLowerCase().includes(searchLower) ||
          path.entryName.toLowerCase().includes(searchLower) ||
          (path.rootUrl && path.rootUrl.toLowerCase().includes(searchLower)),
      );
    },
    [mockPaths, searchQuery],
  );

  // const handleManifestToggle = (manifest, isSelected) => {
  //   setSelectedManifest(prev => {
  //     if (isSelected) {
  //       return [...prev, manifest];
  //     }
  //     return prev.filter(m => m.entryName !== manifest.entryName);
  //   });
  // };

  const handleStartServer = async () => {
    if (selectedManifest.length === 0) {
      setStartError('Please select an option to start the mock server');
      return;
    }
    try {
      setOutput({
        ...output,
        [MOCK_SERVER_PROCESS_NAME]: [
          {
            type: 'stdout',
            data: `Starting mock server at path ${selectedManifest.path} 🚀`,
            friendlyDate: formatDate(new Date().toISOString()),
          },
        ],
      });
      await onStart(selectedManifest);
    } catch (error) {
      setStartError(error.message);
    }
  };

  useEffect(
    () => {
      if (visible && activeApps.length > 0) {
        setSelectedManifest(activeApps);
      }
    },
    [visible, activeApps],
  );

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
            <va-loading-indicator message="Starting mock api server 🚀" />
          )}
          {mockPaths.length > 0 &&
            !starting && (
              <>
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

                <div>
                  <div style={scrollableRadioGroupStyles}>
                    <VaRadio
                      label="Select a path to start your mock api server from"
                      hint={`${
                        summary.withManifest
                      } applications with mock api responses`}
                    >
                      {filteredResults.map((path, index) => (
                        <MockServerResponsesRadio
                          key={`${index}-${path.entryName}`}
                          path={path.mockPath || ''}
                          name={path.appName || ''}
                          description={
                            path?.description
                              ? `${path.description} - ${path.entryName}`
                              : path.entryName
                          }
                        />
                      ))}
                    </VaRadio>
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

MockServerConfigurator.propTypes = {
  starting: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};

MockServerResponsesRadio.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};
