/**
 * Creates cards for asset library.
 */
export function libraryCard(jsonData) {
  let output = '';
  let url;

  function fileType(data) {
    const split = data.split('.');
    return split.slice(-1).pop();
  }

  jsonData.forEach((json, index) => {
    if (json.fieldMedia) {
      const type = json.fieldMedia.entity.entityBundle;
      let assetText;
      let format;
      switch (type) {
        case 'document':
          url = json.fieldMedia.entity.fieldDocument.entity.url;
          format = fileType(url);
          assetText = `<a class="file-download-with-icon" target="_blank" href="${url}" download="${url}"><i class="fas fa-download vads-u-padding-right--1"></i>Download ${format.toUpperCase()}</a>`;
          break;

        case 'video':
          url = json.fieldMedia.entity.fieldMediaVideoEmbedField;
          assetText = `<a class="video-link" target="_blank" href="${url}"><i class="fab fa-youtube vads-u-padding-right--1"></i>Go to video</a>`;
          break;

        case 'image':
          url = json.fieldMedia.entity.image.url;
          format = fileType(url);
          assetText = `<a class="file-download-with-icon" target="_blank" href="${url}" download="${url}"><i class="fas fa-download vads-u-padding-right--1"></i>Download ${format.toUpperCase()}</a>`;
          break;

        default:
          url = json.fieldMedia.entity.image.url;
          format = fileType(url);
          assetText = `<a class="file-download-with-icon" target="_blank" href="${url}" download="${url}"><i class="fas fa-download vads-u-padding-right--1"></i>Download ${format.toUpperCase()}</a>`;
          break;
      }

      if (index % 2 === 0) {
        output += `<div class="vads-l-row">`;
      }

      output += `<div class="vads-l-col--6 vads-u-padding-right--4 vads-u-padding-bottom--4 asset-card">`;
      output += `<div class="asset-head-wrap ${type}-asset-wrap">`;
      if (type === 'image') {
        output += `<img src="${url}" onerror="this.onerror=null;this.src='https://via.placeholder.com/318x212';"/>`;
      }
      output += `</div>`;
      output += `<div class="asset-body-wrap">`;

      if (json.title) {
        const sizeTitle =
          json.title.length > 25
            ? `${json.title.substring(0, 35)}
             ...`
            : json.title;

        output += `<h3 class="asset-body-header">${sizeTitle}</h3>`;
      }

      if (json.fieldDescription) {
        const sizeBody =
          json.fieldDescription.length > 25
            ? `${json.fieldDescription.substring(0, 35)}
          ...`
            : json.fieldDescription;

        output += `<div class="asset-body-text">${sizeBody}</div>`;
      }

      let benefits;
      if (json.fieldBenefits.length) {
        benefits = json.fieldBenefits.map(
          a => a.charAt(0).toUpperCase() + a.substr(1),
        );
        output += `<div class="asset-category-text"><strong>Category: </strong>${benefits.join(
          ', ',
        )}</div>`;
      }

      output += `<div class="asset-filetype-text"><strong>File type: </strong><span class="capitalize-first">${type}</span></div>`;

      output += `<div class="asset-download-trigger">${assetText}</div>`;

      output += `</div > `;
      output += `</div > `;
      if (index % 2 !== 0 || index === jsonData.length - 1) {
        output += `</div > `;
      }
    }
  });
  document.getElementById('search-entry').innerHTML = output;
}
