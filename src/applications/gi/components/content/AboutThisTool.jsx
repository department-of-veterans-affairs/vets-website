import React from 'react';

function AboutThisTool() {
  return (
    <div className="row">
      <div className="center columns about-this-tool">
        <a
          href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
          target="_blank"
          rel="noopener noreferrer"
          id="about-this-tool"
        >
          About this tool
        </a>

        <a
          className="about-this-tool-mobile"
          href="https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx"
          id="download-all-data"
        >
          Download data on all schools (XLS)
        </a>
      </div>
    </div>
  );
}

export default AboutThisTool;
