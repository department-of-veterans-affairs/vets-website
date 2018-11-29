import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';
const prefix = 'DOCUMENT_UPLOADER_';

export const SET_COMMENTS = `${prefix}SET_COMMENTS`;
export const SET_VETERAN = `${prefix}SET_VETERAN`;
export const SET_FILES = `${prefix}SET_FILES`;
export const SET_STATUS = `${prefix}SET_STATUS`;
export const FETCHING_LOCATION = `${prefix}FETCHING_LOCATION`;
export const SUBMITTING_FILES = `${prefix}SUBMITTING_FILES`;
export const API_ERROR = `${prefix}API_ERROR`

const status = {
  fetching: 'fetching location',
  pending: 'pending reciept of documents',
  uploaded: 'document uploaded',
  recieved: 'recieved by central mail',
  processing: 'processing by downstream system',
  success: 'document has been recieved by DHMS',
  error: 'error in the api'
}


export function setVeteran(veteran) {
  return {
    type: SET_VETERAN,
    veteran
  }
}

export function setComments(comments) {
  return {
    type: SET_COMMENTS,
    comments
  }
}

export function setFiles(files) {
  return {
    type: SET_FILES,
    files
  }
}

export function setStatus(status) {
  return {
    type: SET_STATUS,
    status
  }
}

function veteranToMetadata(veteran){
  let metadata = {
    verteranFirstName: veteran.firstName,
    veteranLastName: veteran.lastName,
    fileNumber: veteran.fileNumber,
    source: 'va-gov-document-uploader',
    docType: veteran.regarding
  }
  return new Blob([JSON.stringify(metadata)], {
    type: 'application/json'
  })
}


function uploadFilesToLocation(veteran, files, comments, location) {
  let data = new FormData();
  data.append('metadata', veteranToMetadata(veteran))
  files.forEach((file, i) => {
    let name = i == 0 ? 'content' : `attachment${i}`
    data.append(name, file)
  })
  return fetch(location, {
    method: 'PUT',
    body: data
  }).then( response => { console.log(response) })
}

function updateUploadStatus(dispatch, endpoint, interval) {
  return apiRequest(
    endpoint,
    { method: 'GET' },
    (resp) => {
      let status = resp.data.attributes.status;
      dispatch(setStatus(status[status]))

      if(status === 'success' || status === 'error'){
        clearInterval(interval)
      }
    }
  )
}


export function submitFiles(veteran, files, comments) {
  let uploadsEndpoint = `${environment.API_URL}/services/vba_documents/v0/uploads`;
  return async dispatch => {
    dispatch(setStatus(status.fetching))
    apiRequest(
      uploadsEndpoint,
      { method: 'POST' },
      (resp) => {
        let upload = resp.data.attributes;
        dispatch(setStatus(status.pending))
        uploadFilesToLocation(
          veteran,
          files,
          comments,
          upload.location
        ).then( () => {
          let endpoint = `${uploadsEndpoint}/${upload.guid}`
          let poll = setInterval(() => {updateUploadStatus(dispatch, endpoint, poll)}, 3000)
        }).catch( 
          (error) => {
            debugger
            dispatch(setStatus(status.error))
          }
        )
      },
      (error) => { 
        debugger
        dispatch(setStatus(status.error)) 
      }
    )
  }
}
