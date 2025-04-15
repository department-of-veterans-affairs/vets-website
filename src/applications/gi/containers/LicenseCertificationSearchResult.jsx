import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchLcResult } from '../actions';
import LicenseCertificationAdminInfo from '../components/LicenseCertificationAdminInfo';
import LicenseCertificationTestInfo from '../components/LicenseCertificationTestInfo';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';

export default function LicenseCertificationSearchResult() {
  const { id } = useParams();
  const { fetchingLcResult, lcResultInfo, error } = useSelector(
    state => state.licenseCertificationSearch,
  );
  const { lacNm, eduLacTypeNm, institution, tests } = lcResultInfo;

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);

    const controller = new AbortController();
    dispatch(fetchLcResult(id, controller.signal));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(
    () => {
      if (institution?.name) {
        document.title = `${
          institution.name
        }: GI Bill® Comparison Tool | Veterans Affairs`;
      }
    },
    [institution],
  );

  return (
    <>
      {error && <LicesnseCertificationServiceError />}
      {fetchingLcResult && <va-loading-indicator message="Loading..." />}
      {!fetchingLcResult &&
        institution &&
        tests && (
          <section className="lc-result-details vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
            <div className="row">
              <h1 className="mobile-lg:vads-u-text-align--left usa-width-two-thirds">
                {lacNm}
              </h1>
              <h2 className="vads-u-margin-top--0">{eduLacTypeNm}</h2>
            </div>
            <div className="row">
              <LicenseCertificationAdminInfo
                institution={institution}
                type={eduLacTypeNm}
              />
            </div>
            <div className="row">
              <LicenseCertificationTestInfo tests={tests} />
            </div>
          </section>
        )}
    </>
  );
}
