const militaryService = `NOTES:
1) This report may not show your complete DoD Military Service
        Information.
   Data prior to establishment of DEERS and full service reporting
        (c. 1980) 
   may not appear.
2) It is normal for the begin/end dates in
        DoD records, adjusted by the
   Personnel Center after separation, to vary
        slightly from the DD-214.
3) No peacetime deployments will be displayed.
        For Gulf War I, only one
   period will be displayed even if you deployed
        more than once.  No conflict
   prior to Gulf War I will be displayed.  Kosovo,
        Bosnia, and Southern Watch
   data is incomplete and may not display.
4) For Guard/Reserve, periods of active duty may not display.  No periods of
        Active duty service less than 30 days will display.
   
   -- Regular Active Service
Service      Begin Date  End Date    Character of Service   Rank
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Army         01/04/1990  02/15/1995  Honorable              SSG
             
-- Reserve/Guard Association Periods
Service      Begin Date  End Date    Character of Service   Rank
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Army Reserve 02/16/1995  06/21/2016  Unknown                MSG              
             
-- Reserve/Guard Activation Periods
Service      Begin Date  End Date    Activated Under (Title 10, 32, etc.)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Army Reserve 08/19/1997  05/15/1998  Unknown (for use with Project Code A99 o
Army Reserve 10/01/2001  09/30/2002  Section 12302 of 10 U.S.C.              
Army Reserve 02/03/2003  01/17/2004  Section 12302 of 10 U.S.C.              
Army Reserve 11/30/2008  03/15/2010  Section 12302 of 10 U.S.C.              
Army Reserve 11/30/2008  01/03/2010  Section 12302 of 10 U.S.C.              
Army Reserve 01/04/2010  03/15/2010  Section 12301(h) of 10 U.S.C.           
Army Reserve 03/16/2010  12/04/2010  Section 12301(h) of 10 U.S.C.           
Army Reserve 03/16/2010  12/04/2010  Section 12301(d) of 10 U.S.C.           
Army Reserve 03/16/2010  12/04/2010  Section 12301(d) of 10 U.S.C.           
Army Reserve 12/05/2010  02/24/2012  Section 12301(h) of 10 U.S.C.           

-- Deployment Periods
Service      Begin Date  End Date    Conflict               Location
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Army Reserve 03/25/2003  12/04/2003  Post-9/11              Unknown     
Army Reserve 12/31/2008  01/06/2009  Post-9/11              Unknown     
Army Reserve 01/07/2009  04/15/2009  Post-9/11              Kuwait      
Army Reserve 04/16/2009  05/18/2009  Post-9/11              Iraq        
Army Reserve 05/19/2009  05/19/2009  Post-9/11              Kuwait      
Army Reserve 05/20/2009  07/20/2009  Post-9/11              Iraq        
Army Reserve 07/21/2009  11/17/2009  Post-9/11              Kuwait      
Army Reserve 11/18/2009  11/22/2009  Post-9/11              Unknown     
Army Reserve 11/23/2009  11/23/2009  Post-9/11              Unknown     

-- DoD MOS/Occupation Codes 
-- Note: Both Service and DoD Generic codes may not be present in all records
Service      Begin Date  Enl/Off   Type       Svc Occ Code       DoD Occ Code
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Army Reserve 02/16/1995  Enlisted  Primary    54B3OZZ            220500        
Army Reserve 02/16/1995  Enlisted  Duty       95B3OZZ            830        
Army Reserve 10/31/1999  Enlisted  Secondary  ZZZZZZZZ           null       
Army Reserve 11/30/1999  Enlisted  Primary    95B3OV5            830        
Army Reserve 10/31/2001  Enlisted  Duty       11B3O              010        
Army Reserve 01/31/2002  Enlisted  Duty       95B4O              830        
Army Reserve 04/30/2002  Enlisted  Primary    95B4O              830        
Army Reserve 05/31/2002  Enlisted  Duty       00D1O              920        

...

-- Retirement Type Code
A       Mandatory
B       Voluntary
C       Fleet Reserve
D       Temporary Disability Retirement List
E       Permanent Disability Retirement List
F       Title III
G       Special Act
H       Philippine Scouts
Z       Unknown

Retired Pay Termination Reason Code
C       Pay condition terminated
S       Pay terminated for the reason reported in the Stop Payment Reason Code
W       Not terminated
`;

module.exports = { militaryService };
