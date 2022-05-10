const octokitResponses = {
  productDirectory: {
    status: 200,
    data:
      'UID,Product,Path,Parent,Team,Label,Tests,Root URL,Launch Date,Referral,Testrail Project ID,dependencies,cross_product_imports\n' +
      'b1ad72a5-aac8-4331-aa0b-8d0c2e9c1915,Health Care Application (10-10 EZ),src/applications/hca,Health Care Application (10-10 EZ),10-10,,,,,"QA Standards, Governance",,"append-query,react,prop-types,@department-of-veterans-affairs/react-components/AlertBox,classnames,react-redux,@department-of-veterans-affairs/component-library/Telephone,@department-of-veterans-affairs/react-components/Modal,@department-of-veterans-affairs/react-components/AdditionalInfo,moment,lodash/merge,vets-json-schema/dist/10-10EZ-schema.json,@department-of-veterans-affairs/react-components/LoadingIndicator,lodash/pick,lodash/mapValues,vets-json-schema/dist/vaMedicalFacilities.json,@sentry/browser","/src/applications/personalization/dashboard/components/DashboardAlert"\n' +
      '34926f2f-8434-43e1-905b-a6895039c640,Personalized Career Planning & Guidance Application (VAF 28-8832),src/applications/vre/28-8832,Personalized Career & Planning Guidanc,eBenefits Migration team,,,,"May 10, 2021","QA Standards, Governance",,"react,react-redux,@department-of-veterans-affairs/component-library/Telephone,moment,vets-json-schema/dist/28-1900-schema.json,react-router,@department-of-veterans-affairs/component-library/OMBInfo,@department-of-veterans-affairs/react-components/RadioButtons","/src/applications/vre/28-1900/components/PreSubmitInfo,/src/applications/vre/components/GetFormHelp,/src/applications/static-pages/wizard,/src/applications/vre/28-1900/wizard/pages,/src/applications/vre/28-1900/orientation/OrientationApp,/src/applications/vre/28-1900/constants"\n' +
      '2db0de9e-bb95-42de-8a07-ff6d9a3703c9,Veteran Readiness and Employment Application (VAF 28-1900),src/applications/vre/28-1900,Veteran Readiness & Employment,eBenefits Migration team,,,,"May 10, 2021","QA Standards, Governance",,"react,react-redux,moment,lodash/merge,@department-of-veterans-affairs/component-library/Telephone,vets-json-schema/dist/28-8832-schema.json,@department-of-veterans-affairs/component-library/OMBInfo,@department-of-veterans-affairs/react-components/RadioButtons","/src/applications/static-pages/wizard"',
  },
  outdatedProductDirectory: {
    status: 200,
    data:
      'UID,Product,Path,Parent,Team,Label,Tests,Root URL,Launch Date,Referral,Testrail Project ID,dependencies,cross_product_imports\n' +
      'b1ad72a5-aac8-4331-aa0b-8d0c2e9c1915,Health Care Application (10-10 EZ),src/applications/hca,Health Care Application (10-10 EZ),10-10,,,,,"QA Standards, Governance",,"append-query,react,prop-types,@department-of-veterans-affairs/react-components/AlertBox,classnames,react-redux,@department-of-veterans-affairs/component-library/Telephone,@department-of-veterans-affairs/react-components/Modal,@department-of-veterans-affairs/react-components/AdditionalInfo,moment,lodash/merge,vets-json-schema/dist/10-10EZ-schema.json,@department-of-veterans-affairs/react-components/LoadingIndicator,lodash/pick,lodash/mapValues,vets-json-schema/dist/vaMedicalFacilities.json,chai,sinon,skin-deep,enzyme,react-dom,react-dom/test-utils,fs,path,jsonschema,@sentry/browser","src/applications/personalization/dashboard/components/DashboardAlert,src/applications/facility-locator/manifest.json"\n' +
      '34926f2f-8434-43e1-905b-a6895039c640,Personalized Career Planning & Guidance Application (VAF 28-8832),src/applications/vre/28-8832,Personalized Career & Planning Guidanc,eBenefits Migration team,,,,"May 10, 2021","QA Standards, Governance",,"react,react-redux,moment,lodash/merge,@department-of-veterans-affairs/component-library/Telephone,vets-json-schema/dist/28-8832-schema.json,@department-of-veterans-affairs/component-library/OMBInfo,chai,enzyme,sinon,path,@department-of-veterans-affairs/react-components/RadioButtons","src/applications/static-pages/wizard"\n' +
      '2db0de9e-bb95-42de-8a07-ff6d9a3703c9,Veteran Readiness and Employment Application (VAF 28-1900),src/applications/vre/28-1900,Veteran Readiness & Employment,eBenefits Migration team,,,,"May 10, 2021","QA Standards, Governance",,"react,react-redux,@department-of-veterans-affairs/component-library/Telephone,moment,vets-json-schema/dist/28-1900-schema.json,react-router,@department-of-veterans-affairs/component-library/OMBInfo,chai,sinon,enzyme,path,@department-of-veterans-affairs/react-components/RadioButtons","src/applications/static-pages/wizard,src/applications/personalization/profile/tests/fixtures/users/user-loa1.json"',
  },
  productDirectoryForbidden: {
    status: 403,
  },
  productDirectoryResourceNotFound: {
    status: 404,
  },
  createPull: {
    status: 201,
  },
};

module.exports = octokitResponses;
