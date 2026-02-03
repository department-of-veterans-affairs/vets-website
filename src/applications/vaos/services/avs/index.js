import { apiRequestWithUrl, parseApiList } from '../utils';

/**
 * @typedef {import('../../utils/avs').AvsObj} AvsObj
 * @typedef {import('../../utils/avs').AvsFetchedData} AvsFetchedData
 */

/**
 * Merges fetched AVS PDF binaries with existing AVS PDF metadata (ids and codes and NO binaries).
 * @param {AvsObj[]} avsPdfArray AVS data from appointment list
 * @returns {function(AvsFetchedData[]): AvsObj[]}
 */
function mergeAvsPdfData(avsPdfArray) {
  /**
   * Merge fetched AVS PDF binaries with existing AVS PDF metadata.
   * @param {AvsFetchedData[]} fetchedAvsPdfs Fetched AVS PDFs
   * @returns {AvsObj[]} Merged AVS PDFs with binaries and errors if they exist
   */
  return function withData(fetchedAvsPdfs) {
    return avsPdfArray.map(avsPdfObj => {
      const fetchedPdf = fetchedAvsPdfs.find(
        fetched => fetched.docId === avsPdfObj.id,
      );
      return {
        ...avsPdfObj,
        binary: fetchedPdf.binary ?? null,
        error: fetchedPdf.error ?? null,
      };
    });
  };
}

/**
 * Fetch AVS PDF binaries for a given appointment and merge with existing AVS PDF metadata.
 * @param {string} appointmentId
 * @param {AvsObj[]} avsPdfArray
 * @returns {Promise<AvsObj[]>} Merged AVS PDFs with binaries and errors if they exist
 */
export async function fetchAvsPdfBinaries(appointmentId, avsPdfArray) {
  const ids = avsPdfArray.map(avsPdfObj => avsPdfObj.id).join(',');
  return apiRequestWithUrl(
    `/vaos/v2/appointments/avs_binary/${appointmentId}?doc_ids=${ids}`,
    {
      method: 'GET',
    },
  )
    .then(parseApiList)
    .then(mergeAvsPdfData(avsPdfArray));
}
