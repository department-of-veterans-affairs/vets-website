import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDateTimeForAnnouncements } from '../config/helpers';
import { URL, envUrl, mockTestingFlagForAPI } from '../constants';
import { mockAnnouncementsResponse } from '../utils/mockData';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState({});

  const now = useMemo(() => new Date(), []);

  const getApiData = useCallback(
    url => {
      const processAnnouncements = rawAnnouncements => {
        const filtered = rawAnnouncements
          .filter(item => {
            const { startDate, endDate, text } = item.attributes;
            if (!startDate || !endDate || !text) return false;

            const end = new Date(Date.parse(endDate));
            return now <= end;
          })
          .sort((a, b) => {
            const aDate = new Date(Date.parse(a.attributes.startDate));
            const bDate = new Date(Date.parse(b.attributes.startDate));
            return bDate - aDate;
          });

        setAnnouncements(filtered);

        const visibilityMap = {};
        filtered.forEach((_, index) => {
          visibilityMap[index] = true;
        });
        setVisibleAlerts(visibilityMap);
      };

      if (mockTestingFlagForAPI) {
        const raw = mockAnnouncementsResponse?.data || [];
        processAnnouncements(raw);
        return;
      }

      apiRequest(url).then(res => {
        const raw = res?.data || [];
        processAnnouncements(raw);
      });
      // .catch(error => {
      //   console.log('Error fetching announcements', error);
      // });
    },
    [now],
  );

  useEffect(
    () => {
      getApiData(`${envUrl}${URL.ANNOUNCEMENTS}`);
    },
    [getApiData],
  );

  if (!announcements.length) {
    return null;
  }

  return (
    <div className="vads-u-margin-bottom--3">
      {announcements.map((announcement, index) => {
        if (!visibleAlerts[index]) return null;

        const { startDate, endDate, text } = announcement.attributes;
        const start = new Date(Date.parse(startDate));
        const end = new Date(Date.parse(endDate));

        let headline = 'Site Notice';
        let status = 'info';

        if (now < start) {
          headline = 'Upcoming Site Maintenance';
          status = 'info';
        } else if (now >= start && now <= end) {
          headline = 'Site Maintenance';
          status = 'warning';
        }

        return (
          <div key={index} className="vads-u-margin-bottom--4">
            <VaAlert
              closeBtnAriaLabel="Close notification"
              closeable
              onCloseEvent={() => {
                setVisibleAlerts(prev => {
                  return { ...prev, [index]: false };
                });
              }}
              status={status}
              visible={visibleAlerts[index]}
            >
              <h2 id={`announcement-${index}`} slot="headline">
                {headline}
              </h2>
              <p className="vads-u-margin-y--0">{text}</p>
              <p className="vads-u-margin-y--1">
                <strong>Start:</strong> {formatDateTimeForAnnouncements(start)}
              </p>
              <p className="vads-u-margin-y--1">
                <strong>End:</strong> {formatDateTimeForAnnouncements(end)}
              </p>
            </VaAlert>
          </div>
        );
      })}
    </div>
  );
};

export default Announcements;
