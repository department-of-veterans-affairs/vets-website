/**
 * @typedef ContestableIssues
 * @type {Array<Object>}
 * @property {ContestableIssueItem|LegacyAppealItem}
 */
/**
 * @typedef ContestableIssueItem
 * @type {Object}
 * @property {String} type - always set to "contestableIssue"
 * @property {ContestableIssueAttributes} attributes - essential properties
 * @property {Boolean} 'view:selected' (defined by SELECTED constant) - internal
 *  boolean indicating that the issue has been selected by the user
 */
/**
 * @typedef ContestableIssueAttributes
 * @type {Object}
 * @property {String} ratingIssueSubjectText - title of issue
 * @property {String} description - issue description
 * @property {Number} ratingIssuePercentNumber - disability rating percentage
 * @property {String} approxDecisionDate - decision date (YYYY-MM-DD)
 * @property {Number} decisionIssueId - decision id
 * @property {String} ratingIssueReferenceId - issue reference number
 * @property {String} ratingDecisionReferenceId - decision reference id
 */

/**
 * @typedef LegacyAppealItem
 * @type {Object}
 * @property {String} type - always set to "legacyAppeals"
 * @property {LegacyAppealAttributes} attributes - essential properties
 * @property {Boolean} 'view:selected' (defined by SELECTED constant) - internal
 *  boolean indicating that the issue has been selected by the user
 */
/**
 * @typedef LegacyAppealAttributes
 * @type {Object}
 * @property {String} decisionDate - decision date (ISO)
 * @property {String} latestSocSsocDate - SOC/SSOC date (ISO)
 * @property {String} veteranFullName - First & Last name
 * @property {LegacyAppealIssue} issues - list of legacy issues
 */
/**
 * @typedef LegacyAppealIssue
 * @param {String} summary - issue summary
 */

/**
 * @typedef AdditionalIssues
 * @type {Array<Object>}
 * @property {AdditionalIssueItem}
 */
/**
 * @typedef AdditionalIssueItem
 * @type {Object}
 * @property {String} issue - title of issue
 * @property {String} decisionDate - decision date (YYYY-MM-DD)
 * @property {Boolean} 'view:selected' (defined by SELECTED constant) - internal
 *  boolean indicating that the issue has been selected by the user
 * @example
 *  {
      "issue": "right shoulder",
      "decisionDate": "2010-01-06",
      "view:selected": true
    }
 */

/**
 * @typedef AreaOfDisagreement
 * @type {Array<Object>}
 * @property {String} type="contestableIssue"
 * @property {AreaOfDisagreementAttributes} attributes
 * @property {AreaOfDisagreementOptions} disagreementOptions
 * @property {String} otherEntry - typed in disagreement option
 */
/**
 * @typedef AreaOfDisagreementAttributes
 * @type {Object}
 * @property {ContestableIssueAttributes}
 */
/**
 * @typedef AreaOfDisagreementOptions
 * @type {Object}
 * @property {String} serviceConnection
 * @property {String} effectiveDate
 * @property {String} evaluation
 */

/**
 * @typedef Evidence
 * @type {Object}
 * @property {String} name - file name
 * @property {String} confirmationCode - UUID returned from backend after
 *  uploading to S3 bucket
 * @property {Boolean} isEncrypted - flag indicating that the original uploaded
 *  file was encrypted, but a password was included and is now decrypted
 */

/**
 * @typedef ContestableIssuesSubmittable
 * @type {Array<Object>}
 * @property {ContestableIssuesSubmittableItem}
 */
/**
 * @typedef ContestableIssuesSubmittableItem
 * @type {Object}
 * @property {String} issue - title of issue returned by createIssueName function
 * @property {String} decisionDate - decision date string (YYYY-MM-DD)
 * @property {Number=} decisionIssueId - decision id
 * @property {String=} ratingIssueReferenceId - issue reference number
 * @property {String=} ratingDecisionReferenceId - decision reference id
 * @property {String} socDate - legacy appeal date (995 only)
 * @example
 * [{
    "type": "contestableIssue",
    "attributes": {
      // required
      "issue": "tinnitus - 10% - some longer description",
      "decisionDate": "1900-01-01",
      // optional
      "decisionIssueId": 1,
      "ratingIssueReferenceId": "2",
      "ratingDecisionReferenceId": "3"
    }
  }]
 */
/**
 * @typedef ContestableIssuesSubmittableWithDisagreement
 * @type {Array<Object>}
 * @property {ContestableIssuesSubmittableItemWithDisagreement}
 */
/**
 * @typedef ContestableIssuesSubmittableItemWithDisagreement
 * @type {Object}
 * @property {String} issue - title of issue returned by createIssueName function
 * @property {String} decisionDate - decision date string (YYYY-MM-DD)
 * @property {String} disagreementArea - area of disagreement
 * @property {Number=} decisionIssueId - decision id
 * @property {String=} ratingIssueReferenceId - issue reference number
 * @property {String=} ratingDecisionReferenceId - decision reference id
 * @example
 * [{
    "type": "contestableIssue",
    "attributes": {
      // required
      "issue": "tinnitus - 10% - some longer description",
      "decisionDate": "1900-01-01",
      "disagreementArea": "service connection,effective date,disability evaluation,this is tinnitus entry"
      // optional
      "decisionIssueId": 1,
      "ratingIssueReferenceId": "2",
      "ratingDecisionReferenceId": "3"
    }
  }]
 */

/**
 * @typedef Veteran
 * @type {Object}
 * @property {String} ssnLastFour - Last four of SSN from prefill
 * @property {String} vaFileLastFour - Last four of VA file number from prefill
 * @property {Object<String>} address - Veteran's home address from profile
 * @property {Object<String>} phone - Veteran's home phone from profile
 * @property {Object<String>} email - Veteran's email from profile
 */
/**
 * @typedef PhoneObject
 * @type {Object}
 * @property {String} countryCode - country code (1 digit, usually)
 * @property {String} areaCode - area code (3 digits)
 * @property {String} phoneNumber - phone number (7 digits)
 * @property {String} phoneNumberExt - extension
 * @returns
 */

/**
 * @typedef VeteranSubmittable
 * @type {Object}
 * @property {AddressSubmittable} address
 * @property {PhoneSubmittable} phone
 * @property {String} emailAddressText
 */
/**
 * @typedef VeteranSubmittableV2
 * @type {Object}
 * @property {AddressSubmittable} address
 * @property {PhoneSubmittable} phone
 * @property {String} email (v1)
 * @property {Boolean} homeless
 */
/**
 * @typedef AddressSubmittable
 * @type {Object}
 * @property {String} addressLine1
 * @property {String} addressLine2
 * @property {String} addressLine3
 * @property {String} city
 * @property {String} stateCode
 * @property {String} zipCode5
 * @property {String} countryName
 * @property {String} internationalPostalCode
 */
/**
 * @typedef AddressSubmittableV2
 * @type {Object}
 * @property {String} addressLine1
 * @property {String} addressLine2
 * @property {String} addressLine3
 * @property {String} city
 * @property {String} stateCode
 * @property {String} zipCode5
 * @property {String} countryCodeISO2
 * @property {String} internationalPostalCode
 */
/**
 * @typedef PhoneSubmittable
 * @type {Object}
 * @property {String} countryCode
 * @property {String} areaCode
 * @property {String} phoneNumber
 * @property {String} phoneNumberExt
 */
