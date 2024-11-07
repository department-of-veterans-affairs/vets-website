export const BLUE_STAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggc3Ryb2tlPSIjMDAzZTczIiBkPSJtMi44NjE5OCwxNC43MDc1bDExLjYzMTgxLDBsMy41OTQzMiwtMTEuMzU1NzVsMy41OTQzMiwxMS4zNTU3NWwxMS42MzE4MSwwbC05LjQxMDMyLDcuMDE4MTZsMy41OTQ1MSwxMS4zNTU3NWwtOS40MTAzMiwtNy4wMTgzNWwtOS40MTAzMiw3LjAxODM1bDMuNTk0NTEsLTExLjM1NTc1bC05LjQxMDMyLC03LjAxODE2eiIgaWQ9InN2Z18xIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiMwMDNlNzMiLz4KIDwvZz4KCjwvc3ZnPg==';

export default function processCSAT(data) {
  const surveys = document.querySelectorAll('#chatbot-csat-survey');
  const survey = surveys[surveys.length - 1];

  const stars = survey.querySelectorAll('img');
  const rating = Number(data.value.response);
  if (!Number.isNaN(rating)) {
    for (let i = 0; i < rating; i++) {
      stars[i].src = BLUE_STAR;
    }
  }

  // Make survey not clickable and appear disabled
  const columns = survey.querySelectorAll('#chatbot-csat-survey-columnset');
  columns[0].style.pointerEvents = 'none';
}
