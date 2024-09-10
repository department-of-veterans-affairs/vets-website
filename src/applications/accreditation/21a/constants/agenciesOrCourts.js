export const agenciesOrCourts = [
  {
    name: 'Court of Appeals for the Federal Circuit',
    website:
      'https://cafc.uscourts.gov/home/information-for/attorney-information/',
  },
  {
    name: 'Court of Appeals for Veterans Claims',
    website: 'https://www.uscourts.cavc.gov/public_list.php',
  },
  {
    name: 'Executive Office for Immigration Review',
    website: 'https://www.justice.gov/eoir/find-legal-representation',
  },
  {
    name: 'Patent and Trademark Office',
    website: 'https://oedci.uspto.gov/OEDCI/practitionerSearchEntry',
  },
  {
    name: 'Social Security Administration',
    website: 'https://www.ssa.gov/representation/',
  },
  {
    name: 'Supreme Court',
    website: 'https://www.supremecourt.gov/filingandrules/supremecourtbar.aspx',
  },
  {
    name: 'Tax Court',
    website: 'https://www.ustaxcourt.gov/practitioners.html',
  },
  { name: 'Other', website: '' },
];

export const agenciesOrCourtsOptions = agenciesOrCourts.map(
  agencyOrCourt => agencyOrCourt.name,
);
