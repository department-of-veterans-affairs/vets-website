import React, { useEffect, useState } from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns';
import { FETCH_CLAIM_STATUS } from '../actions';
import Layout from '../components/Layout';

const InboxPage = () => {
  const [claimantId, setClaimantId] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [receivedDate, setReceivedDate] = useState(null);

  useEffect(
    () => {
      const checkIfClaimantHasLetters = async () =>
        apiRequest(FETCH_CLAIM_STATUS)
          .then(response => {
            setClaimantId(response?.data?.attributes?.claimantId);
            setReceivedDate(
              format(
                new Date(response?.data?.attributes?.receivedDate),
                'MMMM d, yyyy',
              ),
            );
            setLoading(false);
            return response?.data?.attributes?.claimantId;
          })
          .catch(err => {
            window.location.href = '/education/education-inbox/';
            return err;
          });

      checkIfClaimantHasLetters().then(r => r);
    },
    [claimantId],
  );

  const HasLetters = (
    <>
      <va-on-this-page />
      <h2 id="your-edu-benf-letter">Your education benefit letters</h2>
      <div className="edu-certi-eligibility">
        <span className="usa-label">New</span>
        <h3 style={{ marginTop: '1rem' }}>
          Education Certificate of Eligibility
        </h3>
        <p>
          This letter is proof of your eligibility for VA education benefits. It
          includes details of our decision, including benefit program, amount,
          and level.
        </p>
        <div className="vads-u-display--flex vads-u-align-items--center">
          <a
            className="vads-u-flex--1"
            download
            href="http://localhost:3000/meb_api/v0/claim_letter"
          >
            <i className="fa fa-download vads-u-display--inline-block vads-u-margin-right--1" />
            Post-9/11 GI Bill Certificate of Eligibility (PDF)
          </a>
          <p className="vads-u-flex--auto">
            You applied for this on {receivedDate}
          </p>
        </div>
      </div>
      <h2 id="how-do-i-download-letter">How do I download a letter?</h2>
      <p>
        To download a letter, you’ll need to have Adobe Acrobat Reader installed
        on your computer. You can then download or save the letter to your
        device. Open Acrobat Reader, and from the file menu, choose Open. Select
        the PDF.
      </p>{' '}
      <p>
        If you‘re still having trouble opening the letter, you may have an older
        version of Adobe Acrobat Reader. You’ll need to{' '}
        <a href="/">download the latest version</a>. It’s free.
      </p>
      <h2 id="letter-isnt-listed">What if I my letter isn’t listed here?</h2>
      <p>
        At this time, we’re only able to show Post-9/11 GI Bill decision letters
        that you received after <b>Month Day, 2022</b>.
      </p>{' '}
      <p>
        If you have questions about your education benefits, call our Education
        Call Center at{' '}
        <a href="tel:+18884424551;ext=711">1-888-442-4551 (711)</a>. We’re here
        Monday through Friday, 8:00 a.m. to 7:00 p.m. ET. If you’re outside the
        U.S., call us at <a href="tel:001-918-781-5678">001-918-781-5678</a>.
      </p>
    </>
  );

  const renderInbox = () => {
    if (!isLoading) {
      if (claimantId) {
        return HasLetters;
      }
      return (
        <va-alert full-width status="info">
          <h3 slot="headline">
            We don’t have any letters on file for you at this time
          </h3>
          <div>
            <p>
              At this time, we’re only able to show decision letters that you
              received after <b>Month Day, 2022</b>.
            </p>
            If you’re looking for an older decision letter,
            <a href="https://nam04.safelinks.protection.outlook.com/?url=https%3A%2F%2Fask.va.gov%2F&data=04%7C01%7Cherbert.anagho%40accenturefederal.com%7C5b0be35e33a2487d4a0c08d9ecb991bc%7C0ee6c63b4eab4748b74ad1dc22fc1a24%7C0%7C0%7C637801104030719343%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&sdata=QuGxWs9osAHjaGwInFjQO5cwEQ%2BK84u9J3XH2QcwZNk%3D&reserved=0">
              contact us using Ask VA
            </a>
            .
          </div>
        </va-alert>
      );
    }
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
  };

  return (
    <Layout clsName="inbox-page">
      <FormTitle title="VA education inbox" />
      <p className="va-introtext">
        Download important documents about your education benefits here,
        including your decision letter.
      </p>
      <article>{renderInbox()}</article>
    </Layout>
  );
};

export default InboxPage;
