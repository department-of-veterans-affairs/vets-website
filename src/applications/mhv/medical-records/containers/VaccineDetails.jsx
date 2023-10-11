import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { processList, sendErrorToSentry } from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import { getVaccineDetails, clearVaccineDetails } from '../actions/vaccines';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { EMPTY_FIELD, pageTitles } from '../util/constants';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../shared/util/helpers';

const VaccineDetails = () => {
  const record = useSelector(state => state.mr.vaccines.vaccineDetails);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { vaccineId } = useParams();
  const dispatch = useDispatch();
  const formattedDate = formatDateLong(record?.date);

  useEffect(
    () => {
      if (vaccineId) dispatch(getVaccineDetails(vaccineId));
    },
    [vaccineId, dispatch],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/vaccines',
            label: 'Vaccines',
          },
        ]),
      );
      return () => {
        dispatch(clearVaccineDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (record) {
        focusElement(document.querySelector('h1'));
        const titleDate = formattedDate ? `${formattedDate} - ` : '';
        updatePageTitle(
          `${titleDate}${record.name} - ${pageTitles.VACCINES_PAGE_TITLE}`,
        );
      }
    },
    [formattedDate, record],
  );

  const generateVaccinePdf = async () => {
    const title = `Vaccines: ${record.name} on ${record.date}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      items: [
        {
          title: 'Location',
          value: record.location || EMPTY_FIELD,
          inline: true,
        },
        {
          title: 'Reaction',
          value: processList(record.reactions),
          inline: !record.reactions.length,
        },
        {
          title: 'Provider notes',
          value: processList(record.notes),
          inline: !record.notes.length,
        },
      ],
    };

    try {
      await generatePdf(
        'medicalRecords',
        `VA-Vaccines-details-${user.userFullName.first}-${
          user.userFullName.last
        }-${moment()
          .format('M-D-YYYY_hhmmssa')
          .replace(/\./g, '')}`,
        scaffold,
      );
    } catch (error) {
      sendErrorToSentry(error, 'Vaccine details');
    }
  };

  const content = () => {
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0p5"
            aria-describedby="vaccine-date"
            data-dd-privacy="mask"
          >
            {record.name}
          </h1>
          <div className="time-header">
            <h2
              className="vads-u-font-size--base vads-u-font-family--sans"
              id="vaccine-date"
            >
              Date:{' '}
              <span
                className="vads-u-font-weight--normal"
                data-dd-privacy="mask"
              >
                {formattedDate}
              </span>
            </h2>
          </div>
          <PrintDownload
            download={generateVaccinePdf}
            allowTxtDownloads={allowTxtDownloads}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          <div className="detail-block max-80">
            <h2>Location</h2>
            <p data-dd-privacy="mask">{record.location}</p>
            <h2 className="vads-u-margin-bottom--0">
              Reactions recorded by provider
            </h2>
            <ItemList list={record.reactions} />
            <h2 className="vads-u-margin-bottom--0">Provider notes</h2>
            <ItemList list={record.notes} />
          </div>
        </>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
    );
  };

  return (
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      id="vaccine-details"
    >
      {content()}
    </div>
  );
};

export default VaccineDetails;

VaccineDetails.propTypes = {
  print: PropTypes.func,
};
