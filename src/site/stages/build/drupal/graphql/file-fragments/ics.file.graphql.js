/**
 * Queries to get all .ics files
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `
  icsFiles: fileQuery(filter: {
      conditions: [
        { field: "filemime", value: "text/calendar"}
        { field: "status", value: "1"}
      ]} limit: 500) {
    entities {
      ... on File {
        fid
        filename
        filemime
        filesize
        url
      }
    }
  }
`;
