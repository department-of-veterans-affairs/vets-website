import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from 'web-components/react-bindings';
import TextArea from '@department-of-veterans-affairs/component-library/TextArea';
import Select from '@department-of-veterans-affairs/component-library/Select';

import environment from 'platform/utilities/environment';
import { getActivePages } from 'platform/forms-system/src/js/helpers';
import localStorage from 'platform/utilities/storage/localStorage';

const docsPage =
  'https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/save-in-progress-menu';

const checkHash = () => {
  const hash = (window?.location?.hash || '').toLowerCase();
  if (hash.includes('#dev-')) {
    localStorage.setItem('DEV_MODE', hash.includes('#dev-on'));
  }
};

const getAvailablePaths = (pageList, data) =>
  getActivePages(pageList, data).map(page => page.path);

const SipsDevModal = props => {
  const { pageList, form, locationPathname } = props || {};
  const { formId, version, data, submission } = form || {};

  const [isModalVisible, toggleModal] = useState(false);
  const [sipsData, setSipsData] = useState(data);
  const [availablePaths, setAvailablePaths] = useState(null);
  const [sipsUrl, setSipsUrl] = useState(null);
  const [errorMessage, setError] = useState('');

  useEffect(
    () => {
      setAvailablePaths(getAvailablePaths(pageList, sipsData));
    },
    [pageList, sipsData],
  );

  // Only show SipsDevModal when url hash includes "#dev-(on|off)"
  checkHash();
  const showLink = localStorage.getItem('DEV_MODE');
  if (showLink !== 'true') {
    return null;
  }

  const openSipsModal = () => {
    setSipsUrl(locationPathname);
    toggleModal(true);
  };

  const getData = unprocessedData => {
    // maximal-data.json is wrapped in `{ "data": {...} }
    // lets extract that out to make it easier for users
    const keys = Object.keys(unprocessedData);
    return keys.length === 1 && keys[0] === 'data'
      ? unprocessedData.data
      : unprocessedData;
  };

  const saveData = (event, type) => {
    event.preventDefault();
    const newData = type === 'merge' ? { ...data, ...sipsData } : sipsData;
    setError('');
    props.saveAndRedirectToReturnUrl(
      formId,
      newData,
      version,
      sipsUrl,
      submission,
    );
    toggleModal(false);
  };

  const handleChange = value => {
    try {
      const newData = JSON.parse(value);
      setSipsData(getData(newData));
      setError('');
    } catch (err) {
      setError(err?.message || err?.name);
    }
  };

  return (
    <>
      {isModalVisible ? (
        <VaModal
          modal-title="Save in progress data"
          id="sip-menu"
          visible={isModalVisible}
          onCloseEvent={() => toggleModal(false)}
          onPrimaryButtonClick={e => saveData(e, 'replace')}
          onSecondaryButtonClick={e => saveData(e, 'merge')}
          primaryButtonText="Replace"
          secondaryButtonText="Merge"
          disable-analytics
        >
          <>
            <TextArea
              errorMessage={errorMessage}
              label="Form data"
              name="sips_data"
              additionalClass="resize-y"
              field={{ value: JSON.stringify(sipsData, null, 2) }}
              onValueChange={field => handleChange(field.value)}
            />
            <Select
              label="Return url"
              name="sips_url"
              options={availablePaths}
              value={{ value: sipsUrl }}
              includeBlankOption={false}
              onValueChange={value => setSipsUrl(value.value)}
              additionalClass="additional-class"
            />
            <p />
            <a href={docsPage}>
              <i aria-hidden="true" className="fas fa-info-circle" role="img" />{' '}
              How to use this menu
            </a>
            <p />
          </>
        </VaModal>
      ) : null}{' '}
      <button
        key={showLink}
        type="button"
        className="va-button-link"
        onClick={() => openSipsModal()}
      >
        <i aria-hidden="true" className="fas fa-cog" role="img" /> Open
        save-in-progress menu
      </button>
    </>
  );
};

SipsDevModal.propTypes = {
  locationPathname: PropTypes.string.isRequired,
  saveAndRedirectToReturnUrl: PropTypes.func.isRequired,
  form: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
};

export default (environment.isProduction() ? () => null : SipsDevModal);
