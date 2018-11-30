import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';

const prefix = 'DOCUMENT_UPLOADER_';

export const SET_COMMENTS = `${prefix}SET_COMMENTS`;
export const SET_VETERAN = `${prefix}SET_VETERAN`;
export const SET_FILES = `${prefix}SET_FILES`;
export const SET_STATUS = `${prefix}SET_STATUS`;
export const FETCHING_LOCATION = `${prefix}FETCHING_LOCATION`;
export const SUBMITTING_FILES = `${prefix}SUBMITTING_FILES`;
export const API_ERROR = `${prefix}API_ERROR`;

const status = {
  fetching: 'fetching location',
  pending: 'pending reciept of documents',
  uploaded: 'document uploaded',
  recieved: 'recieved by central mail',
  processing: 'processing by downstream system',
  success: 'document has been recieved by DHMS',
  error: 'error in the api',
};

export function setVeteran(veteran) {
  return {
    type: SET_VETERAN,
    veteran,
  };
}

export function setComments(comments) {
  return {
    type: SET_COMMENTS,
    comments,
  };
}

export function setFiles(files) {
  return {
    type: SET_FILES,
    files,
  };
}

export function setStatus(incomingStatus) {
  return {
    type: SET_STATUS,
    status: incomingStatus,
  };
}

function veteranToMetadata(veteran) {
  const metadata = {
    verteranFirstName: veteran.firstName,
    veteranLastName: veteran.lastName,
    fileNumber: veteran.fileNumber,
    source: 'va-gov-document-uploader',
    docType: veteran.regarding,
  };
  return new Blob([JSON.stringify(metadata)], {
    type: 'application/json',
  });
}

function uploadFilesToLocation(veteran, files, comments, location) {
  const data = new FormData();
  data.append('metadata', veteranToMetadata(veteran));
  files.forEach((file, i) => {
    const name = i === 0 ? 'content' : `attachment${i}`;
    data.append(name, file);
  });
  return fetch(location, {
    method: 'PUT',
    body: data,
  });
}

function updateUploadStatus(dispatch, endpoint, interval) {
  return apiRequest(endpoint, { method: 'GET' }, resp => {
    const responseStatus = resp.data.attributes.status;
    dispatch(setStatus(status[responseStatus]));

    if (status === 'success' || status === 'error') {
      clearInterval(interval);
    }
  });
}

export function submitFiles(veteran, files, comments) {
  const uploadsEndpoint = `${
    environment.API_URL
  }/services/vba_documents/v0/uploads`;
  return async dispatch => {
    dispatch(setStatus(status.fetching));
    apiRequest(
      uploadsEndpoint,
      { method: 'POST' },
      resp => {
        const upload = resp.data.attributes;
        dispatch(setStatus(status.pending));
        uploadFilesToLocation(veteran, files, comments, upload.location)
          .then(() => {
            const endpoint = `${uploadsEndpoint}/${upload.guid}`;
            const poll = setInterval(() => {
              updateUploadStatus(dispatch, endpoint, poll);
            }, 3000);
          })
          .catch(() => {
            dispatch(setStatus(status.error));
          });
      },
      () => {
        dispatch(setStatus(status.error));
      },
    );
  };
}
