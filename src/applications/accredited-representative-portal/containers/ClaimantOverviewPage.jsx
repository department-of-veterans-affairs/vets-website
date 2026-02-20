import React from 'react';
import { useLoaderData } from 'react-router-dom';
import api from '../utilities/api';
import ClaimantDetailRow from '../components/ClaimantDetailRow';

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
  representativeInfo: raw?.representative_info || null,
  intentToFile: [],
});

const ITF_TYPES = ['compensation', 'pension', 'survivor'];

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

/**
 * Survivor ITF requires claimant identity fields (SSN, DOB, first, last).
 *
 * The Rails backend computes claimant_icn and runs authorization
 * BEFORE hitting the controller action. If these params are missing,
 * the request will fail (400/authorization error).
 *
 * We guard the call here to avoid sending an invalid survivor request.
 */
const hasSurvivorParams = claimant =>
  Boolean(
    claimant?.claimantSsn &&
      claimant?.claimantDateOfBirth &&
      claimant?.claimantFullName?.first &&
      claimant?.claimantFullName?.last,
  );

const loadIntentToFileByType = async (claimant, benefitType) => {
  // survivor requires claimant identity fields; if we don’t have them, skip the call
  if (benefitType === 'survivor' && !hasSurvivorParams(claimant)) return null;

  const basePayload = {
    benefitType,
    veteranSsn: claimant.veteranSsn,
    veteranDateOfBirth: claimant.dateOfBirth,
    veteranFullName: { first: claimant.firstName, last: claimant.lastName },
  };

  const payload =
    benefitType === 'survivor'
      ? {
          ...basePayload,
          claimantSsn: claimant.claimantSsn,
          claimantDateOfBirth: claimant.claimantDateOfBirth,
          claimantFullName: claimant.claimantFullName,
        }
      : basePayload;

  const res = await api.getIntentToFile(payload);

  if (res.status === 401) throw res;

  // Fail-soft for authorization failures / not found / any non-OK response
  if (!res.ok) return null;

  const json = await res.json();

  /**
   * Normalize ITF response shape.
   * Backend mock returns: { data: { attributes: { creationDate, expirationDate, type, status } } }
   */
  const attrs = json?.data?.attributes;
  if (attrs) {
    return {
      benefitType,
      benefit: ITF_BENEFIT_LABELS[benefitType] || attrs.type || benefitType,
      itfDate: attrs.creationDate || null,
      expirationDate: attrs.expirationDate || null,
      status: attrs.status || null,
    };
  }

  // Fallback to older/alternate shapes if they exist
  const raw = json?.data || json;
  return {
    benefitType,
    benefit: raw?.benefit || raw?.benefitType || benefitType,
    itfDate: raw?.itfDate || raw?.itf_date || null,
    expirationDate: raw?.expirationDate || raw?.expiration_date || null,
    status: raw?.status || null,
  };
};

const loadAllIntentToFile = async claimant => {
  // If required param is missing, just return empty list (no UI crash)
  if (!claimant?.veteranSsn || !claimant?.dateOfBirth) return [];

  const results = await Promise.allSettled(
    ITF_TYPES.map(benefitType => loadIntentToFileByType(claimant, benefitType)),
  );

  // Keep order stable, include only successful non-null responses
  return results
    .map(r => (r.status === 'fulfilled' ? r.value : null))
    .filter(Boolean);
};

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
  // ✅ Fix: claimantId was unused; remove from destructure
  const { authorized = true, claimant = null } = useLoaderData() || {};
  const unauthorized = authorized === false;

  return (
    <div>
      <h2 className="vads-u-margin-top--0">Claimant overview</h2>

      {unauthorized && (
        <div className="vads-u-margin-y--2">
          <va-alert status="warning">
            <h3 slot="headline">You’re not authorized to view this claimant</h3>
            <p>
              You may not have access to this claimant yet, or your current
              account isn’t set up with the required permissions.
            </p>
          </va-alert>
        </div>
      )}

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
            <ClaimantDetailRow label="Phone" value={claimant?.phone || '—'} />
            <ClaimantDetailRow
              label="Email"
              value={
                claimant?.email ? (
                  <a href={`mailto:${claimant.email}`}>{claimant.email}</a>
                ) : (
                  '—'
                )
              }
            />
          </dl>
        </div>
      </section>

      <section className="vads-u-margin-top--4">
        <h3 className="vads-u-margin-bottom--2">Representative information</h3>

        <div className="vads-u-padding-left--3">
          <dl className="vads-u-margin--0">
            <ClaimantDetailRow
              label="Representative"
              value={claimant?.representativeInfo?.representative || '—'}
            />
            <ClaimantDetailRow
              label="VBMS eFolder access"
              value={claimant?.representativeInfo?.vbmsEfolderAccess || '—'}
            />
            <ClaimantDetailRow
              label="Change of address authorization"
              value={
                claimant?.representativeInfo?.changeOfAddressAuthorization ||
                '—'
              }
            />
            <ClaimantDetailRow
              label="Type of representation"
              value={claimant?.representativeInfo?.typeOfRepresentation || '—'}
            />
          </dl>
        </div>
      </section>

      <p className="vads-u-margin-top--3 vads-u-margin-bottom--1 vads-u-color--gray-medium vads-u-font-size--sm">
        The portal doesn’t check for limited representation
      </p>

      <section className="vads-u-margin-top--4">
        <h3 className="vads-u-margin-bottom--2">Intent to file status</h3>

        <div className="vads-u-padding-left--3">
          {claimant?.intentToFile?.length ? (
            claimant.intentToFile.map(itf => (
              <div key={itf.benefitType} className="vads-u-margin-top--3">
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
            ))
          ) : (
            <dl className="vads-u-margin--0">
              <ClaimantDetailRow label="Benefit" value="—" />
              <ClaimantDetailRow label="ITF date" value="—" />
            </dl>
          )}
        </div>
      </section>
    </div>
  );
};

ClaimantOverviewPage.loader = async ({ params }) => {
  const claimantId = params?.claimantId;
  if (!claimantId) throw new Response('Not Found', { status: 404 });

  const overviewPromise = api.getClaimantOverview(claimantId);
  const overviewRes = await overviewPromise;

  if (overviewRes.status === 401) throw overviewRes;
  if (overviewRes.status === 403)
    return { authorized: false, claimant: null, claimantId };
  if (!overviewRes.ok) throw overviewRes;

  const overviewJson = await overviewRes.json();
  const overviewRaw = overviewJson?.data || overviewJson;
  const claimant = mapClaimantOverview(overviewRaw);

  const itfPromise = loadAllIntentToFile(claimant);
  const [itfSettled] = await Promise.allSettled([itfPromise]);

  claimant.intentToFile =
    itfSettled.status === 'fulfilled' ? itfSettled.value : [];

  return { authorized: true, claimant, claimantId };
};

export default ClaimantOverviewPage;
