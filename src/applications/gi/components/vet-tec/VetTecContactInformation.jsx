import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

const RankSchoolCertifyingOfficials = scos => {
  let rankedList = [];
  rankedList = scos
    .sort((a, b) => {
      // Sort SCOs first by priority (PRIMARY or SECONDARY)
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      // Then sort SCOs alphabetically by last name
      if (a.lastName > b.lastName) return 1;
      if (a.lastName < b.lastName) return -1;
      return 0;
    })
    .slice(0, 2);
  return rankedList;
};

export const VetTecContactInformation = ({ institution }) => (
  <div>
    <div className="additional-information row vads-u-margin-y--1">
      <div className="usa-width-one-half medium-6 columns">
        <div className="physical-address usa-width-one-whole">
          <h3>Physical address</h3>
          <div>
            {institution.physicalAddress1 && (
              <div>{institution.physicalAddress1}</div>
            )}
            {institution.physicalAddress2 && (
              <div>{institution.physicalAddress2}</div>
            )}
            {institution.physicalAddress3 && (
              <div>{institution.physicalAddress3}</div>
            )}
            <div>
              {institution.physicalCity}, {institution.physicalState}{' '}
              {institution.physicalZip}
            </div>
          </div>
        </div>
      </div>
      <div className="usa-width-one-half medium-6 columns">
        <div className="mailing-address usa-width-one-whole">
          <h3>Mailing address</h3>
          <div>
            {institution.address1 && <div>{institution.address1}</div>}
            {institution.address2 && <div>{institution.address2}</div>}
            {institution.address3 && <div>{institution.address3}</div>}
            <div>
              {institution.city}, {institution.state} {institution.zip}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Production flag for 19534 */}
    {!environment.isProduction() &&
      institution.schoolCertifyingOfficials.length > 0 && (
        <div className="additional-information row vads-u-margin-y--4">
          <div className="usa-width-one-half medium-6 columns">
            <div className="physical-address usa-width-one-whole">
              <h3>School certifying officials</h3>
              <div>
                <div>
                  {
                    RankSchoolCertifyingOfficials(
                      institution.schoolCertifyingOfficials,
                    )[0].firstName
                  }{' '}
                  {
                    RankSchoolCertifyingOfficials(
                      institution.schoolCertifyingOfficials,
                    )[0].lastName
                  }
                </div>
                <div>
                  {
                    RankSchoolCertifyingOfficials(
                      institution.schoolCertifyingOfficials,
                    )[0].title
                  }
                </div>
                <div>
                  <a
                    href={`mailto:${
                      RankSchoolCertifyingOfficials(
                        institution.schoolCertifyingOfficials,
                      )[0].email
                    }`}
                  >
                    {
                      RankSchoolCertifyingOfficials(
                        institution.schoolCertifyingOfficials,
                      )[0].email
                    }
                  </a>
                </div>
                <div>
                  <a
                    href={`tel:+1${RankSchoolCertifyingOfficials(
                      institution.schoolCertifyingOfficials,
                    )[0].phoneAreaCode +
                      RankSchoolCertifyingOfficials(
                        institution.schoolCertifyingOfficials,
                      )[0].phoneNumber}`}
                  >
                    {
                      RankSchoolCertifyingOfficials(
                        institution.schoolCertifyingOfficials,
                      )[0].phoneAreaCode
                    }
                    {'-'}
                    {
                      RankSchoolCertifyingOfficials(
                        institution.schoolCertifyingOfficials,
                      )[0].phoneNumber
                    }
                  </a>
                </div>
              </div>
            </div>
          </div>
          {institution.schoolCertifyingOfficials.length > 1 && (
            <div className="usa-width-one-half medium-6 columns">
              <div className="mailing-address usa-width-one-whole">
                <h3>&nbsp;</h3>
                <div>
                  {
                    <div>
                      {
                        RankSchoolCertifyingOfficials(
                          institution.schoolCertifyingOfficials,
                        )[1].firstName
                      }{' '}
                      {
                        RankSchoolCertifyingOfficials(
                          institution.schoolCertifyingOfficials,
                        )[1].lastName
                      }
                    </div>
                  }
                  {
                    <div>
                      {
                        RankSchoolCertifyingOfficials(
                          institution.schoolCertifyingOfficials,
                        )[1].title
                      }
                    </div>
                  }
                  {
                    <div>
                      <a
                        href={`mailto:${
                          RankSchoolCertifyingOfficials(
                            institution.schoolCertifyingOfficials,
                          )[1].email
                        }`}
                      >
                        {
                          RankSchoolCertifyingOfficials(
                            institution.schoolCertifyingOfficials,
                          )[1].email
                        }
                      </a>
                    </div>
                  }
                  {
                    <div>
                      <a
                        href={`tel:+1${RankSchoolCertifyingOfficials(
                          institution.schoolCertifyingOfficials,
                        )[1].phoneAreaCode +
                          RankSchoolCertifyingOfficials(
                            institution.schoolCertifyingOfficials,
                          )[1].phoneNumber}`}
                      >
                        {
                          RankSchoolCertifyingOfficials(
                            institution.schoolCertifyingOfficials,
                          )[1].phoneAreaCode
                        }
                        {'-'}
                        {
                          RankSchoolCertifyingOfficials(
                            institution.schoolCertifyingOfficials,
                          )[1].phoneNumber
                        }
                      </a>
                    </div>
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      )}
  </div>
);

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
