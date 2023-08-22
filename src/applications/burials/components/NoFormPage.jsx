import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatSSN } from 'platform/utilities/ui';

export const NoFormPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Example endpoint; update with the specific resource you want to fetch
    const resource = '/in_progress_forms/21P-530';

    // Making the API request
    apiRequest(resource)
      .then(responseData => {
        setData(responseData);
        setLoading(false);
        // console.log(responseData);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your application..."
      />
    );
  }

  if (error) {
    return (
      <ul>
        Errors:
        {error.errors.map((e, i) => (
          <li key={i}>{e.title}</li>
        ))}
      </ul>
    );
  }

  const { formData } = data;

  const convertDateFormat = date =>
    date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');

  return (
    <div className="row vads-u-margin-bottom--4">
      <h1>Review Burial Benefits Application</h1>
      <p>VA Form 21P-530</p>
      {data?.metadata?.inProgressFormId ? (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              This online form isn’t working right now
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You can still use the information here to fill out a paper form
                for VA burial benefits.
              </p>
            </div>
            <br />
            <va-link
              href="va.gov"
              text="Learn more about how to apply for VA burial benefits"
            />
          </va-alert>
          <h3>Send application by mail</h3>
          <p>Fill out an Application for Burial (VA Form 21P-530EZ).</p>
          <div>
            <button
              className="find-forms-max-content vads-u-text-decoration--none"
              data-testid="pdf-link-10654"
              id="pdf-link-10654"
              type="button"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <i
                aria-hidden="true"
                className="fas fa-download fa-lg vads-u-margin-right--1"
                role="presentation"
              />
              <span lang="en" className="vads-u-text-decoration--underline">
                Download VA Form 21P-530EZ (PDF)
              </span>
            </button>
            <VaModal
              modalTitle="Download this PDF and open it in Acrobat Reader"
              onCloseEvent={() => {
                setShowModal(false);
              }}
              onPrimaryButtonClick={function noRefCheck() {}}
              onSecondaryButtonClick={function noRefCheck() {}}
              status="info"
              visible={showModal}
            >
              <p>
                Download this PDF to your desktop computer or laptop. Then use
                Adobe Acrobat Reader to open and fill out the form. Don’t try to
                open the PDF on a mobile device or fill it out in your browser.
              </p>
              <p>
                If you want to fill out a paper copy, open the PDF in your
                browser and print it from there.
              </p>
              <a href="https://get.adobe.com/reader/" rel="noopener noreferrer">
                Get Acrobat Reader for free from Adobe
              </a>
              <p />
              <a
                href="https://www.vba.va.gov/pubs/forms/VBA-21P-530EZ-ARE.pdf"
                className="vads-u-margin-top--2"
                rel="noreferrer noopener"
                target="_blank"
              >
                <i
                  aria-hidden="true"
                  className="fas fa-download fa-lg vads-u-margin-right--1"
                  role="presentation"
                />
                <span className="vads-u-text-decoration--underline">
                  Download VA Form 21P-530EZ
                </span>
              </a>
            </VaModal>
            <p>
              Mail the completed form to the pension management center (PMC)
            </p>
            <p className="va-address-block">
              Department of Veterans Affairs <br />
              Pension Intake Center
              <br />
              PO Box 5365
              <br />
              Janesville, WI 53547-5365
              <br />
            </p>
            <article>
              <va-on-this-page />
              <h2 id="claimant-information">Claimant information</h2>
              <hr />
              <div>
                <p className="vads-u-color--gray">Claimant’s first name</p>
                <p>{formData.claimantFullName.first}</p>
                <br />
                <p className="vads-u-color--gray">Claimant’s middle name</p>
                <p>{formData.claimantFullName.middle}</p>
                <br />
                <p className="vads-u-color--gray">Claimant’s last name</p>
                <p>{formData.claimantFullName.last}</p>
                <br />
                <p className="vads-u-color--gray">Suffix</p>
                <p>{formData.claimantFullName.suffix}</p>
                <br />
                <p className="vads-u-color--gray">
                  Relationship to the deceased Veteran
                </p>
                <p>{formData.relationship.type}</p>
              </div>
              <h2 id="deceased-veteran-information">
                Deceased Veteran information
              </h2>
              <hr />
              <p className="vads-u-color--gray">Veteran’s first name</p>
              <p>{formData.veteranFullName.first}</p>
              <br />
              <p v>Veteran’s middle name</p>
              <p>{formData.veteranFullName.middle}</p>
              <br />
              <p className="vads-u-color--gray">Veteran’s last name</p>
              <p>{formData.veteranFullName.last}</p>
              <br />
              <p className="vads-u-color--gray">Suffix</p>
              <p>
                {formData.veteranFullName.suffix
                  ? formData.veteranFullName.suffix
                  : 'None'}
              </p>
              <br />
              <p className="vads-u-color--gray">Social Security number</p>
              <p>{formatSSN(formData.veteranSocialSecurityNumber)}</p>
              <br />
              <p className="vads-u-color--gray">VA file number</p>
              <p>{formData.vaFileNumber}</p>
              <br />
              <p className="vads-u-color--gray">Date of birth</p>
              <p>{convertDateFormat(formData.veteranDateOfBirth)}</p>
              <br />
              <p className="vads-u-color--gray">
                Place of birth (city and state or foreign country)
              </p>
              <p>{formData.placeOfBirth ? formData.placeOfBirth : 'None'}</p>
              <h3>Burial information</h3>
              <p className="vads-u-color--gray">Date of death</p>
              <p>{convertDateFormat(formData.deathDate)}</p>
              <br />
              <p className="vads-u-color--gray">
                Date of burial (includes cremation or interment)
              </p>
              <p>{convertDateFormat(formData.burialDate)}</p>
              <br />
              <p className="vads-u-color--gray">
                Where did the Veteran’s death occur?
              </p>
              <p>{formData.locationOfDeath.location}</p>
              <h2 id="military-history">Military history</h2>
              <hr />
              <h3>Previous names</h3>
              <p className="vads-u-color--gray">
                Did the Veteran serve under another name?
              </p>
              <p>
                {formData.previousNames.length > 0
                  ? formData.previousNames.map((name, index) => {
                      return (
                        <>
                          <va-card key={index}>
                            <p>
                              <strong>First: </strong>
                              {name.first}
                            </p>
                            <p>
                              <strong>Middle: </strong>
                              {name.middle ? name.middle : 'None'}
                            </p>
                            <p>
                              <strong>Last: </strong>
                              {name.last}
                            </p>
                            <p>
                              <strong>Suffix: </strong>
                              {name.suffix ? name.suffix : 'None'}
                            </p>
                          </va-card>
                          <br />
                        </>
                      );
                    })
                  : 'No'}
              </p>
              <h2 id="benefits-selection">Benefits selection</h2>
              <hr />
              <h3>General Selection</h3>
              <p className="vads-u-color--gray">Burial allowance</p>
              <p />
              <h2 id="additional-information">Additional information</h2>
              <hr />
            </article>
          </div>
        </>
      ) : (
        <div>Has no in progress form</div>
      )}
      {/* Render the fetched data if needed */}
    </div>
  );
};
