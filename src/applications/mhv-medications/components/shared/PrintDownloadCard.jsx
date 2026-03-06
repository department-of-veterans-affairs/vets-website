import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  VaSelect,
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { DOWNLOAD_FORMAT, PRINT_FORMAT } from '../../util/constants';

const PrintDownloadCard = ({ onDownload, onPrint, isSuccess, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState('print');
  const [isError, setIsError] = useState(false);
  const successAlert = useRef(null);
  const errorAlert = useRef(null);

  useEffect(
    () => {
      if (isError) {
        focusElement(errorAlert.current);
        return;
      }
      if (isSuccess) {
        focusElement(successAlert.current);
      }
    },
    [isSuccess, isError],
  );

  const handleSelectChange = event => {
    setSelectedOption(event.target.value);
  };

  const handleDownload = async format => {
    if (!navigator.onLine) {
      setIsError(true);
      return;
    }
    try {
      setIsError(false);
      await onDownload(format);
    } catch {
      setIsError(true);
    }
  };

  const handlePrint = async () => {
    if (onPrint) {
      onPrint();
    } else {
      await onDownload(PRINT_FORMAT.PRINT);
    }
  };

  const handleSubmit = () => {
    switch (selectedOption) {
      case 'print':
        handlePrint();
        break;
      case 'pdf':
        handleDownload(DOWNLOAD_FORMAT.PDF);
        break;
      case 'txt':
        handleDownload(DOWNLOAD_FORMAT.TXT);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <va-card class="vads-u-border--1px vads-u-border-color--black vads-u-padding-top--1">
        <div className="vads-u-padding-x--1">
          <h2
            className="vads-u-border-bottom--2px vads-u-border-color--primary vads-u-line-height--5 vads-u-font-size--h3 vads-u-margin-top--0"
            id="print-download-heading"
          >
            Print or download your medications list
          </h2>
          <p>
            Print or save a copy of this filtered and sorted medications list.
          </p>

          {isLoading && (
            <va-loading-indicator
              message="Loading..."
              data-testid="print-download-card-loading"
            />
          )}

          {isSuccess &&
            !isError && (
              <VaAlert
                status="success"
                ref={successAlert}
                background-only
                class="vads-u-margin-bottom--2"
              >
                <h2 slot="headline">Download started</h2>
                <p className="vads-u-margin--0">
                  Your file should download automatically. If it doesn’t, try
                  again.
                </p>
              </VaAlert>
            )}

          {isError && (
            <VaAlert
              status="error"
              ref={errorAlert}
              class="vads-u-margin-bottom--2"
            >
              <h2 slot="headline">We can’t download your records right now</h2>
              <p className="vads-u-margin--0">
                We’re sorry. There’s a problem with our system. Try again later.
              </p>
            </VaAlert>
          )}

          <VaAlert status="warning" slim>
            <p className="vads-u-margin-y--0">
              <strong>If you’re on a public or shared computer,</strong>{' '}
              remember that downloading saves a copy of your records to the
              computer you’re using.
            </p>
          </VaAlert>

          <VaSelect
            hint="Choose an option and select Submit"
            label="Print or download options"
            name="print-download-select"
            value={selectedOption}
            onVaSelect={handleSelectChange}
            class="vads-u-margin-top--1"
          >
            <option value="print">Print</option>
            <option value="pdf">Download as PDF</option>
            <option value="txt">Download as TXT</option>
          </VaSelect>
          <VaButton
            text="Submit"
            onClick={handleSubmit}
            class="vads-u-margin-top--2 vads-u-margin-bottom--1"
          />
        </div>
      </va-card>
    </>
  );
};

PrintDownloadCard.propTypes = {
  isLoading: PropTypes.bool,
  isSuccess: PropTypes.bool,
  onDownload: PropTypes.func,
  onPrint: PropTypes.func,
};

export default PrintDownloadCard;
