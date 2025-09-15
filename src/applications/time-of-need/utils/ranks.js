// Rank options per branch. Values use the label text for simplicity.
// If submission requires specific codes later, map labels to codes here instead.
//
// NOTE: Army National Guard shares Army ranks; Air National Guard shares Air Force ranks.
const BASE_PLACEHOLDER = [{ value: '', label: 'Select rank' }];

const ARMY_RANKS = [
  'Private (E-1)',
  'Private (E-2)',
  'Private First Class (E-3)',
  'Specialist (E-4)',
  'Corporal (E-4)',
  'Sergeant (E-5)',
  'Staff Sergeant (E-6)',
  'Sergeant First Class (E-7)',
  'Master Sergeant (E-8)',
  'First Sergeant (E-8)',
  'Sergeant Major (E-9)',
  'Command Sergeant Major (E-9)',
  'Sergeant Major of the Army (E-9S)',
  'Warrant Officer 1 (WO1)',
  'Chief Warrant Officer 2 (CW2)',
  'Chief Warrant Officer 3 (CW3)',
  'Chief Warrant Officer 4 (CW4)',
  'Chief Warrant Officer 5 (CW5)',
  'Second Lieutenant (O-1)',
  'First Lieutenant (O-2)',
  'Captain (O-3)',
  'Major (O-4)',
  'Lieutenant Colonel (O-5)',
  'Colonel (O-6)',
  'Brigadier General (O-7)',
  'Major General (O-8)',
  'Lieutenant General (O-9)',
  'General (O-10)',
  'General of the Army (Special)',
];

const MARINE_RANKS = [
  'Private (E-1)',
  'Private First Class (E-2)',
  'Lance Corporal (E-3)',
  'Corporal (E-4)',
  'Sergeant (E-5)',
  'Staff Sergeant (E-6)',
  'Gunnery Sergeant (E-7)',
  'Master Sergeant (E-8)',
  'First Sergeant (E-8)',
  'Master Gunnery Sergeant (E-9)',
  'Sergeant Major (E-9)',
  'Sergeant Major of the Marine Corps (E-9S)',
  'Warrant Officer 1 (WO1)',
  'Chief Warrant Officer 2 (CWO2)',
  'Chief Warrant Officer 3 (CWO3)',
  'Chief Warrant Officer 4 (CWO4)',
  'Chief Warrant Officer 5 (CWO5)',
  'Second Lieutenant (O-1)',
  'First Lieutenant (O-2)',
  'Captain (O-3)',
  'Major (O-4)',
  'Lieutenant Colonel (O-5)',
  'Colonel (O-6)',
  'Brigadier General (O-7)',
  'Major General (O-8)',
  'Lieutenant General (O-9)',
  'General (O-10)',
];

const NAVY_RANKS = [
  'Seaman Recruit (E-1)',
  'Seaman Apprentice (E-2)',
  'Seaman (E-3)',
  'Petty Officer Third Class (E-4)',
  'Petty Officer Second Class (E-5)',
  'Petty Officer First Class (E-6)',
  'Chief Petty Officer (E-7)',
  'Senior Chief Petty Officer (E-8)',
  'Master Chief Petty Officer (E-9)',
  'Command Master Chief Petty Officer (E-9)',
  'Fleet / Force Master Chief Petty Officer (E-9)',
  'Master Chief Petty Officer of the Navy (E-9S)',
  'Warrant Officer 1 (WO1)',
  'Chief Warrant Officer 2 (CWO2)',
  'Chief Warrant Officer 3 (CWO3)',
  'Chief Warrant Officer 4 (CWO4)',
  'Chief Warrant Officer 5 (CWO5)',
  'Ensign (O-1)',
  'Lieutenant Junior Grade (O-2)',
  'Lieutenant (O-3)',
  'Lieutenant Commander (O-4)',
  'Commander (O-5)',
  'Captain (O-6)',
  'Rear Admiral Lower Half (O-7)',
  'Rear Admiral Upper Half (O-8)',
  'Vice Admiral (O-9)',
  'Admiral (O-10)',
  'Fleet Admiral (Special)',
];

const COAST_GUARD_RANKS = [
  'Seaman Recruit (E-1)',
  'Seaman Apprentice (E-2)',
  'Seaman (E-3)',
  'Petty Officer Third Class (E-4)',
  'Petty Officer Second Class (E-5)',
  'Petty Officer First Class (E-6)',
  'Chief Petty Officer (E-7)',
  'Senior Chief Petty Officer (E-8)',
  'Master Chief Petty Officer (E-9)',
  'Command Master Chief (E-9)',
  'Area / Rating Force Master Chief (E-9)',
  'Master Chief Petty Officer of the Coast Guard (E-9S)',
  'Chief Warrant Officer 2 (CWO2)',
  'Chief Warrant Officer 3 (CWO3)',
  'Chief Warrant Officer 4 (CWO4)',
  'Ensign (O-1)',
  'Lieutenant Junior Grade (O-2)',
  'Lieutenant (O-3)',
  'Lieutenant Commander (O-4)',
  'Commander (O-5)',
  'Captain (O-6)',
  'Rear Admiral Lower Half (O-7)',
  'Rear Admiral Upper Half (O-8)',
  'Vice Admiral (O-9)',
  'Admiral (O-10)',
];

const AIR_FORCE_RANKS = [
  'Airman Basic (E-1)',
  'Airman (E-2)',
  'Airman First Class (E-3)',
  'Senior Airman (E-4)',
  'Staff Sergeant (E-5)',
  'Technical Sergeant (E-6)',
  'Master Sergeant (E-7)',
  'Senior Master Sergeant (E-8)',
  'Chief Master Sergeant (E-9)',
  'Command Chief Master Sergeant (E-9)',
  'Chief Master Sergeant of the Air Force (E-9S)',
  'Second Lieutenant (O-1)',
  'First Lieutenant (O-2)',
  'Captain (O-3)',
  'Major (O-4)',
  'Lieutenant Colonel (O-5)',
  'Colonel (O-6)',
  'Brigadier General (O-7)',
  'Major General (O-8)',
  'Lieutenant General (O-9)',
  'General (O-10)',
  'General of the Air Force (Special)',
];

const SPACE_FORCE_RANKS = [
  'Specialist 1 (E-1)',
  'Specialist 2 (E-2)',
  'Specialist 3 (E-3)',
  'Specialist 4 (E-4)',
  'Sergeant (E-5)',
  'Technical Sergeant (E-6)',
  'Master Sergeant (E-7)',
  'Senior Master Sergeant (E-8)',
  'Chief Master Sergeant (E-9)',
  'Command Chief Master Sergeant (E-9)',
  'Chief Master Sergeant of the Space Force (E-9S)',
  'Second Lieutenant (O-1)',
  'First Lieutenant (O-2)',
  'Captain (O-3)',
  'Major (O-4)',
  'Lieutenant Colonel (O-5)',
  'Colonel (O-6)',
  'Brigadier General (O-7)',
  'Major General (O-8)',
  'Lieutenant General (O-9)',
  'General (O-10)',
];

const USPHS_RANKS = [
  'Ensign (O-1)',
  'Lieutenant Junior Grade (O-2)',
  'Lieutenant (O-3)',
  'Lieutenant Commander (O-4)',
  'Commander (O-5)',
  'Captain (O-6)',
  'Rear Admiral Lower Half (O-7)',
  'Rear Admiral Upper Half (O-8)',
  'Vice Admiral (O-9)',
  'Admiral (O-10)',
];

const NOAA_RANKS = [
  'Ensign (O-1)',
  'Lieutenant Junior Grade (O-2)',
  'Lieutenant (O-3)',
  'Lieutenant Commander (O-4)',
  'Commander (O-5)',
  'Captain (O-6)',
  'Rear Admiral Lower Half (O-7)',
  'Rear Admiral Upper Half (O-8)',
  'Vice Admiral (O-9)',
  'Admiral (O-10)',
];

// Map normalized branch key -> rank list
const RANK_MAP = {
  army: ARMY_RANKS,
  'army national guard': ARMY_RANKS,
  'marine corps': MARINE_RANKS,
  navy: NAVY_RANKS,
  'coast guard': COAST_GUARD_RANKS,
  'air force': AIR_FORCE_RANKS,
  'air national guard': AIR_FORCE_RANKS,
  'space force': SPACE_FORCE_RANKS,
  'u.s. public health service': USPHS_RANKS,
  'us public health service': USPHS_RANKS,
  'public health service': USPHS_RANKS,
  'national oceanic and atmospheric administration (noaa) corps': NOAA_RANKS,
  'noaa corps': NOAA_RANKS,
};

function normalizeBranch(branch = '') {
  return branch.trim().toLowerCase();
}

export function getRankOptionsForBranch(branch) {
  const list = RANK_MAP[normalizeBranch(branch)] || [];
  return BASE_PLACEHOLDER.concat(list.map(label => ({ value: label, label })));
}

export function getAllRankOptions() {
  const seen = new Set();
  const all = [];
  Object.values(RANK_MAP).forEach(arr =>
    arr.forEach(label => {
      if (!seen.has(label)) {
        seen.add(label);
        all.push({ value: label, label });
      }
    }),
  );
  return BASE_PLACEHOLDER.concat(all);
}
