import {
  VaAlert,
  VaCard,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ServerErrorAlert } from '../config/helpers';

const DashboardCards = () => {
  const [error, hasError] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const DASHBOARD_DATA = `${
    environment.API_URL
  }/ask_va_api/v0/inquiries?mock=true`;

  const getData = async () => {
    const response = await apiRequest(DASHBOARD_DATA)
      .then(res => {
        return res;
      })
      .catch(() => {
        hasError(true);
      });

    const data = [];
    if (response) {
      for (const inquiry of response.data) {
        data.push(inquiry.attributes);
      }
    }
    setInquiries(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return !error ? (
    <div className="vads-l-grid-container">
      <h2>Dashboard</h2>
      <div className="vads-l-row">
        {inquiries.map(card => (
          <VaCard
            key={card.inquiryNumber}
            className="vads-u-margin-y--1 medium-screen:vads-u-margin--1 dashboard-card vads-l-col--12 medium-screen:vads-l-col--5"
          >
            <p className="card-heading">Inquiry Number:</p>
            <p>
              <Link to={`/user/dashboard/${card.inquiryNumber}`}>
                {card.inquiryNumber}
              </Link>
            </p>
            <p className="card-heading"> Category: </p>
            <p>{card.topic} </p>
            <p className="card-heading">Question: </p>
            <p>{card.question} </p>
            <p className="card-heading">Status: </p>
            <p> {card.processingStatus} </p>
          </VaCard>
        ))}
      </div>
    </div>
  ) : (
    <VaAlert status="info" className="vads-u-margin-y--4">
      <ServerErrorAlert />
    </VaAlert>
  );
};

export default DashboardCards;
