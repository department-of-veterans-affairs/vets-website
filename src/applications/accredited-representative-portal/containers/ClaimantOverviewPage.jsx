import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import api from '../utilities/api';
import ClaimantDetailRow from '../components/ClaimantDetailRow';
import ClaimantDetailsWrapper from '../components/ClaimantDetailsWrapper';
import { claimantOverviewBC } from '../utilities/poaRequests';

const formatAddress = address => {
  if (!address) return '—';

  // ✅ Fix: camelcase lint. Alias postal_code -> postalCode
  const {
    street,
    line1,
    line2,
    city,
    state,
    zip,
    postal_code: postalCode,
  } = address;

  const streetPart = [street || line1, line2].filter(Boolean).join(' ');
  const cityStateZip = [city, state, zip || postalCode]
    .filter(Boolean)
    .join(', ');
  const full = [streetPart, cityStateZip].filter(Boolean).join(', ');
  return full || '—';
};

// Display labels to match the target UI screenshot
const ITF_SECTION_TITLES = {
  compensation: 'Disability compensation',
  pension: 'Pension',
  survivor: 'Survivor',
};

const ITF_BENEFIT_LABELS = {
  compensation: 'Disability compensation (VA Form 21-526EZ)',
  pension: 'Pension (VA Form 21P-527EZ)',
  survivor: 'Survivor benefits',
};

// Normalize backend ITF array (controller now returns payload[:data][:itf] as an array)
const normalizeItfArray = rawItf => {
  if (!Array.isArray(rawItf)) return [];

  return rawItf
    .map(entry => {
      const attrs = entry?.data?.attributes || entry?.attributes || entry;

      const benefitType =
        attrs?.type || entry?.benefitType || entry?.benefit_type;
      if (!benefitType) return null;

      const itfDate = attrs?.creationDate || attrs?.itfDate || attrs?.itf_date;
      const expirationDate =
        attrs?.expirationDate || attrs?.expiration_date || null;

      return {
        benefitType,
        benefit: ITF_BENEFIT_LABELS[benefitType] || benefitType,
        itfDate: itfDate || null,
        expirationDate,
        status: attrs?.status || null,
      };
    })
    .filter(Boolean);
};

const mapClaimantOverview = raw => ({
  firstName: raw?.first_name,
  lastName: raw?.last_name,
  dateOfBirth: raw?.birth_date,
  veteranSsn: raw?.ssn,

  // survivor/dependent fields (ONLY if your API provides them)
  claimantSsn: raw?.claimant_ssn,
  claimantDateOfBirth: raw?.claimant_birth_date,
  claimantFullName:
    raw?.claimant_first_name || raw?.claimant_last_name
      ? { first: raw?.claimant_first_name, last: raw?.claimant_last_name }
      : null,

  phone: raw?.phone,
  email: raw?.email,
  address: raw?.address || null,
  representativeName: raw?.representative_name || null,
  intentToFile: normalizeItfArray(raw?.itf),
});

// ✅ No cross-app date util needed.
// Handles:
// - "yyyyMMdd" (e.g. "19900101")
// - ISO strings (e.g. "2025-01-01T00:00:00Z")
// - "yyyy-MM-dd"
const formatItfDate = value => {
  if (!value) return '—';

  const raw = typeof value === 'string' ? value : String(value);
  const dateOnly = raw.includes('T') ? raw.split('T')[0] : raw;

  let d;

  if (/^\d{8}$/.test(dateOnly)) {
    // yyyyMMdd
    const y = Number(dateOnly.slice(0, 4));
    const m = Number(dateOnly.slice(4, 6)) - 1;
    const day = Number(dateOnly.slice(6, 8));
    d = new Date(y, m, day);
  } else {
    // ISO / yyyy-MM-dd / other Date-parsable strings
    d = new Date(dateOnly);
  }

  if (Number.isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Computes "Expires in N days" from an ISO timestamp
const daysUntil = isoDate => {
  if (!isoDate) return null;
  const end = new Date(isoDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const formatExpiresText = expirationDate => {
  const d = daysUntil(expirationDate);
  if (d == null) return '';
  if (d < 0) return '(Expired)';
  return `(Expires in ${d} days)`;
};

const showExpiryWarning = expirationDate => {
  const d = daysUntil(expirationDate);
  return d != null && d >= 0 && d <= 60;
};

const ClaimantOverviewPage = () => {
  const { authorized = true, claimant = null, notRepresented = false } =
    useLoaderData() || {};
  const unauthorized = authorized === false;

  // ✅ Keep ClaimantDetailsWrapper, but prevent required-prop crash on unauthorized
  const wrapperFirstName = claimant?.firstName || '—';
  const wrapperLastName = claimant?.lastName || '—';

  // ✅ ADDITIVE FIX: When rep does NOT represent claimant, do NOT render ClaimantDetailsWrapper.
  // This removes the claimant header + left rail and matches the target "Claimant not found" layout.
  if (unauthorized && notRepresented) {
    return (
      <section className="vads-u-width--full">
        <VaBreadcrumbs
          breadcrumbList={claimantOverviewBC}
          label="claimant overview breadcrumb"
          homeVeteransAffairs={false}
        />

        <h1>Claimant not found</h1>

        <div className="vads-u-margin-y--2">
          <va-alert status="info">
            <h2 slot="headline">You don’t represent this claimant</h2>
            <p>
              This claimant may be in our system, but you can’t access their
              information or act on their behalf until you establish
              representation.
            </p>
            <a href="/representative/help">
              Learn about establishing representation
            </a>
          </va-alert>
        </div>

        <a
          className="vads-c-action-link--green vads-u-margin-top--2"
          href="/representative/find-claimant"
        >
          Find another claimant
        </a>
      </section>
    );
  }

  return (
    <section className="vads-u-width--full">
      <VaBreadcrumbs
        breadcrumbList={claimantOverviewBC}
        label="claimant overview breadcrumb"
        homeVeteransAffairs={false}
      />

      <ClaimantDetailsWrapper
        firstName={wrapperFirstName}
        lastName={wrapperLastName}
      >
        {unauthorized &&
          notRepresented && (
            <>
              <h2 className="vads-u-margin-top--0">Claimant not found</h2>

              <div className="vads-u-margin-y--2">
                <va-alert status="info">
                  <h3 slot="headline">You don’t represent this claimant</h3>
                  <p>
                    This claimant may be in our system, but you can’t access
                    their information or act on their behalf until you establish
                    representation.
                  </p>
                  <a href="/representative/help">
                    Learn about establishing representation
                  </a>
                </va-alert>
              </div>
            </>
          )}

        {unauthorized &&
          !notRepresented && (
            <>
              <h2 className="vads-u-margin-top--0">Claimant overview</h2>
              <div className="vads-u-margin-y--2">
                <va-alert status="warning">
                  <h3 slot="headline">
                    You’re not authorized to view this claimant
                  </h3>
                  <p>
                    You may not have access to this claimant yet, or your
                    current account isn’t set up with the required permissions.
                  </p>
                </va-alert>
              </div>
            </>
          )}

        {!unauthorized && (
          <>
            <h2 className="vads-u-margin-top--0">Claimant overview</h2>

            <section className="vads-u-margin-top--3">
              <h3 className="vads-u-margin-bottom--2">Claimant information</h3>

              <div className="vads-u-padding-left--3">
                <dl className="vads-u-margin--0">
                  <ClaimantDetailRow
                    label="Social Security number"
                    value={
                      claimant?.veteranSsn
                        ? `***-**-${String(claimant.veteranSsn).slice(-4)}`
                        : '—'
                    }
                  />
                  <ClaimantDetailRow
                    label="Date of birth"
                    value={formatItfDate(claimant?.dateOfBirth)}
                  />
                  <ClaimantDetailRow
                    label="Address"
                    value={formatAddress(claimant?.address)}
                  />
                  <ClaimantDetailRow
                    label="Phone"
                    value={claimant?.phone?.replace(/\)(\d)/, ') $1') || '—'}
                  />
                  <ClaimantDetailRow
                    label="Email"
                    value={
                      claimant?.email ? (
                        <a href={`mailto:${claimant.email}`}>
                          {claimant.email}
                        </a>
                      ) : (
                        '—'
                      )
                    }
                  />
                </dl>
              </div>
            </section>

            <section className="vads-u-margin-top--4">
              <h3 className="vads-u-margin-bottom--2">
                Representative information
              </h3>

              <div className="vads-u-padding-left--3">
                <dl className="vads-u-margin--0">
                  <ClaimantDetailRow
                    label="Representative"
                    value={claimant?.representativeName || '—'}
                  />
                </dl>
              </div>
            </section>

            <p className="vads-u-margin-top--3 vads-u-margin-bottom--1 vads-u-color--gray-medium vads-u-font-size--sm">
              The portal doesn’t check for limited representation
            </p>

            <section className="vads-u-margin-top--4">
              <h3 className="vads-u-margin-bottom--2">Intent to file status</h3>

              {claimant?.intentToFile?.length ? (
                <div className="vads-u-padding-left--3">
                  {claimant.intentToFile.map(itf => (
                    <div
                      key={`${itf.benefitType}-${itf.itfDate ||
                        'no-date'}-${itf.expirationDate || 'no-exp'}`}
                      className="vads-u-margin-top--3"
                    >
                      <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                        {ITF_SECTION_TITLES[itf.benefitType] || itf.benefitType}
                      </h4>

                      <div className="vads-u-padding-left--3">
                        <dl className="vads-u-margin--0">
                          <ClaimantDetailRow
                            label="Benefit"
                            value={itf.benefit || '—'}
                          />
                          <ClaimantDetailRow
                            label="ITF date"
                            value={
                              <>
                                {showExpiryWarning(itf.expirationDate) && (
                                  <va-icon
                                    icon="warning"
                                    size="3"
                                    style={{ color: '#fdb81e' }}
                                    className="vads-u-margin-right--1 vads-u-vertical-align--middle"
                                  />
                                )}
                                {formatItfDate(itf.itfDate)}{' '}
                                {itf.expirationDate && (
                                  <span className="vads-u-color--gray-medium">
                                    {formatExpiresText(itf.expirationDate)}
                                  </span>
                                )}
                              </>
                            }
                          />
                        </dl>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
                    This claimant doesn’t have an intent to file. To establish
                    an intent to file within minutes, submit online VA Form
                    21-0966.
                  </p>

                  <a
                    className="vads-c-action-link--blue"
                    href="https://www.va.gov/find-forms/about-form-21-0966/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Submit online VA Form 21-0966
                  </a>
                </>
              )}
            </section>
          </>
        )}
      </ClaimantDetailsWrapper>
    </section>
  );
};

ClaimantOverviewPage.loader = async ({ params }) => {
  const claimantId = params?.claimantId;
  if (!claimantId) throw new Response('Not Found', { status: 404 });

  try {
    const overviewRes = await api.getClaimantOverview(claimantId);

    if (overviewRes.status === 401) throw overviewRes; // probably never hit now
    if (!overviewRes.ok) throw overviewRes;

    const overviewJson = await overviewRes.json();
    const overviewRaw = overviewJson?.data || overviewJson;
    const claimant = mapClaimantOverview(overviewRaw);

    return { authorized: true, claimant, claimantId };
  } catch (err) {
    // ✅ Render "Claimant not found / You don’t represent this claimant" UX inside this page on 403
    if (err instanceof Response && err.status === 403) {
      return {
        authorized: false,
        claimant: null,
        claimantId,
        notRepresented: true,
      };
    }

    throw err;
  }
};

export default ClaimantOverviewPage;
