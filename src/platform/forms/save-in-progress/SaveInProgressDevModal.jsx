import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
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

const SipsDevModal = props => {
  const [isModalVisible, toggleModal] = useState(false);
  const [sipsData, setSipsData] = useState(null);
  const [sipsUrl, setSipsUrl] = useState(null);
  const [errorMessage, setError] = useState('');

  // Only show SipsDevModal when url hash includes "#dev-(on|off)"
  checkHash();
  const showLink = localStorage.getItem('DEV_MODE');
  if (showLink !== 'true') {
    return null;
  }

  const availablePaths = getActivePages(
    props?.pageList || [],
    props.form.data,
  ).map(page => page.path);

  const openSipsModal = () => {
    setSipsData(JSON.stringify(props.form.data, null, 2));
    setSipsUrl(props.locationPathname);
    toggleModal(true);
  };

  const saveData = (event, type) => {
    event.preventDefault();
    const { formId, version, data, submission } = props.form;
    const parsedData = JSON.parse(sipsData);

    // maximal-data.json is wrapped in `{ "data": {...} }
    // lets extract that out to make it easier for users
    const keys = Object.keys(parsedData);
    const resultingData =
      keys.length === 1 && keys[0] === 'data' ? parsedData.data : parsedData;

    const newData =
      type === 'merge' ? Object.assign({}, data, resultingData) : resultingData;
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
      JSON.parse(value);
      setError('');
    } catch (err) {
      setError(err?.message || err?.name);
    }
    setSipsData(value);
  };

  return (
    <>
      <Modal
        title="Save in progress data"
        id="sip-menu"
        cssClass=""
        visible={isModalVisible}
        onClose={() => toggleModal(false)}
      >
        <>
          <TextArea
            errorMessage={errorMessage}
            label="Form data"
            name="sips_data"
            additionalClass="resize-y"
            field={{ value: sipsData }}
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
          <div className="row">
            <div className="small-6 columns">
              <button
                disabled={!!errorMessage}
                className="usa-button-primary"
                title="Replace all save-in-progress data"
                onClick={e => saveData(e, 'replace')}
              >
                Replace
              </button>
            </div>
            <div className="small-6 columns end">
              <button
                disabled={!!errorMessage}
                className="usa-button-secondary"
                title="Merge new data into existing save-in-progress data"
                onClick={e => saveData(e, 'merge')}
              >
                Merge
              </button>
            </div>
          </div>
        </>
      </Modal>{' '}
      <button
        key={showLink}
        type="button"
        className="va-button-link"
        onClick={openSipsModal}
      >
        <i aria-hidden="true" className="fas fa-cog" role="img" /> Open
        save-in-progress menu
      </button>
    </>
  );
};

SipsDevModal.propTypes = {
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
  locationPathname: PropTypes.string.isRequired,
  saveAndRedirectToReturnUrl: PropTypes.func.isRequired,
};

export default (environment.isProduction() ? () => null : SipsDevModal);
