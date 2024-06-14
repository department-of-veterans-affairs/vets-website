import '../shared/definitions';

/**
 * @typedef FormData
 * @type {Object<Object>}
 * @property {Veteran} veteran - data from prefill & profile
 * @property {ContestableIssues} contestableIssues - issues loaded from API
 * @property {AdditionaIssues} additionalIssues - issues entered by Veteran
 * @property {AreaOfDisagreement} areaOfDisagreement - area of disagreements
 * @property {Evidence} evidence - Evidence uploaded by Veteran
 * @property {Boolean} homeless - homeless choice
 * @property {String} boardReviewOption - Veteran selected review option - enum
 *   to "direct_review", "evidence_submission" or "hearing"
 * @property {String} hearingTypePreference - Vetera selected hearing type -
 *   enum to "virtual_hearing", "video_conference" or "central_office"
 * @property {Boolean} socOptIn - check box indicating the Veteran has opted in
 *   to the new appeal process (always false)
 * @property {Boolean} requestingExtension - yes/no indicating the Veteran is
 *   requesting an extension
 * @property {String} extensionReason - Text of why the Veteran is requesting an
 *   extension
 * @property {Boolean} appealingVhaDenial - yes/no indicating the Veteran is
 *   appealing a VHA denial
 * @property {Boolean} view:additionalEvidence - Veteran choice to upload more
 *   evidence
 */
