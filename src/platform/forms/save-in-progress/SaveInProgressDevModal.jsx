import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import ErrorableTextArea from '@department-of-veterans-affairs/formation-react/ErrorableTextArea';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';

import environment from 'platform/utilities/environment';

const SipsDevModal = props => {
  const [isModalVisible, toggleModal] = useState(false);
  const [sipsData, setSipsData] = useState(null);
  const [sipsUrl, setSipsUrl] = useState(null);
  const [errorMessage, setError] = useState('');

  const availablePaths = props?.route?.pageList.map(page => page.path) || [];

  const openSipsModal = () => {
    setSipsData(JSON.stringify(props.form.data, null, 2));
    setSipsUrl(props.locationPathname);
    toggleModal(true);
  };

  const saveData = (event, type) => {
    event.preventDefault();
    const { formId, version, data } = props.form;
    const parsedData = JSON.parse(sipsData);
    const newData =
      type === 'merge' ? Object.assign({}, data, parsedData) : sipsData;
    setError('');
    props.saveAndRedirectToReturnUrl(formId, newData, version, sipsUrl);
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

  return environment.isProduction() ? null : (
    <>
      <Modal
        title="Save in progress data"
        id="sip-menu"
        cssClass=""
        visible={isModalVisible}
        onClose={() => toggleModal(false)}
      >
        <>
          <ErrorableTextArea
            errorMessage={errorMessage}
            label="Form data"
            name="sips_data"
            additionalClass="resize-y"
            field={{ value: sipsData }}
            onValueChange={field => handleChange(field.value)}
          />
          <ErrorableSelect
            label="Return url"
            name="sips_url"
            options={availablePaths}
            value={{ value: sipsUrl }}
            includeBlankOption={false}
            onValueChange={value => setSipsUrl(value.value)}
            additionalClass="additional-class"
          />
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
        type="button"
        className="va-button-link vads-u-color--gray-medium"
        onClick={openSipsModal}
      >
        Open save-in-progress menu
      </button>
    </>
  );
};

SipsDevModal.propTypes = {
  form: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
  }),
  locationPathname: PropTypes.string.isRequired,
  saveAndRedirectToReturnUrl: PropTypes.func.isRequired,
};

export default SipsDevModal;
