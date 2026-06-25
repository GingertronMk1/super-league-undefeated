import type { PlayerURL, TeamName, Season } from '@/types.ts';

/**
 * Bits of information that don't need to be JSON files, better for type safety and it's data that
 * won't be changing any time soon
 */
export default function useAncillaryData() {
  const dreamTeams: Record<
    Season,
    Record<PlayerURL, {
      url: PlayerURL
      mos: boolean
    }>>
    = {
      1996: {
        '/players/2048': {
          // Gary CONNOLLY
          url: '/players/2048',
          mos: false,
        },
        '/players/2049': {
          // Jason ROBINSON
          url: '/players/2049',
          mos: false,
        },
        'No URL exists for Va\'aiga Tuigamala': {
          // Va'aiga Tuigamala
          url: '#',
          mos: false,
        },
        '/players/2006': {
          // Paul NEWLOVE
          url: '/players/2006',
          mos: false,
        },
        '/players/2007': {
          // Anthony SULLIVAN
          url: '/players/2007',
          mos: false,
        },
        '/players/2050': {
          // Henry PAUL
          url: '/players/2050',
          mos: false,
        },
        '/players/7414': {
          // Bobbie GOULDING
          url: '/players/7414',
          mos: false,
        },
        '/players/2152': {
          // Apollo PERELINI
          url: '/players/2152',
          mos: false,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/2056': {
          // Terry O'CONNOR
          url: '/players/2056',
          mos: false,
        },
        '/players/454': {
          // Peter GILL
          url: '/players/454',
          mos: false,
        },
        '/players/2011': {
          // Paul SCULTHORPE
          url: '/players/2011',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: true,
        },
      },
      1997: {
        '/players/1936': {
          // Stuart SPRUCE
          url: '/players/1936',
          mos: false,
        },
        '/players/2049': {
          // Jason ROBINSON
          url: '/players/2049',
          mos: false,
        },
        '/players/442': {
          // Danny PEACOCK
          url: '/players/442',
          mos: false,
        },
        '/players/2032': {
          // Alan HUNTE
          url: '/players/2032',
          mos: false,
        },
        '/players/2007': {
          // Anthony SULLIVAN
          url: '/players/2007',
          mos: false,
        },
        '/players/526': {
          // Graeme BRADLEY
          url: '/players/526',
          mos: false,
        },
        '/players/3468': {
          // Tony SMITH
          url: '/players/3468',
          mos: false,
        },
        '/players/2022': {
          // Paul BROADBENT
          url: '/players/2022',
          mos: false,
        },
        '/players/2144': {
          // James LOWES
          url: '/players/2144',
          mos: true,
        },
        '/players/503': {
          // Tony MESTROV
          url: '/players/503',
          mos: false,
        },
        '/players/454': {
          // Peter GILL
          url: '/players/454',
          mos: false,
        },
        '/players/1943': {
          // Mike FORSHAW
          url: '/players/1943',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: false,
        },
      },
      1998: {
        '/players/2046': {
          // Kris RADLINSKI
          url: '/players/2046',
          mos: false,
        },
        '/players/2049': {
          // Jason ROBINSON
          url: '/players/2049',
          mos: false,
        },
        '/players/2048': {
          // Gary CONNOLLY
          url: '/players/2048',
          mos: false,
        },
        '/players/389': {
          // Brad GODDEN
          url: '/players/389',
          mos: false,
        },
        '/players/2007': {
          // Anthony SULLIVAN
          url: '/players/2007',
          mos: false,
        },
        '/players/1949': {
          // Iestyn HARRIS
          url: '/players/1949',
          mos: true,
        },
        '/players/1892': {
          // Gavin CLINCH
          url: '/players/1892',
          mos: false,
        },
        '/players/2024': {
          // Dale LAUGHTON
          url: '/players/2024',
          mos: false,
        },
        '/players/395': {
          // Robbie McCORMACK
          url: '/players/395',
          mos: false,
        },
        '/players/503': {
          // Tony MESTROV
          url: '/players/503',
          mos: false,
        },
        '/players/1861': {
          // Steele RETCHLESS
          url: '/players/1861',
          mos: false,
        },
        '/players/843': {
          // Adrian MORLEY
          url: '/players/843',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: false,
        },
      },
      1999: {
        '/players/2046': {
          // Kris RADLINSKI
          url: '/players/2046',
          mos: false,
        },
        '/players/2049': {
          // Jason ROBINSON
          url: '/players/2049',
          mos: false,
        },
        '/players/2048': {
          // Gary CONNOLLY
          url: '/players/2048',
          mos: false,
        },
        '/players/2006': {
          // Paul NEWLOVE
          url: '/players/2006',
          mos: false,
        },
        '/players/2774': {
          // Matthew DAYLIGHT
          url: '/players/2774',
          mos: false,
        },
        '/players/1949': {
          // Iestyn HARRIS
          url: '/players/1949',
          mos: false,
        },
        '/players/2308': {
          // Willie PETERS
          url: '/players/2308',
          mos: false,
        },
        '/players/1835': {
          // Dean SAMPSON
          url: '/players/1835',
          mos: false,
        },
        '/players/2144': {
          // James LOWES
          url: '/players/2144',
          mos: false,
        },
        '/players/2117': {
          // Barrie McDERMOTT
          url: '/players/2117',
          mos: false,
        },
        '/players/1837': {
          // Chris JOYNT
          url: '/players/1837',
          mos: false,
        },
        '/players/843': {
          // Adrian MORLEY
          url: '/players/843',
          mos: false,
        },
        '/players/80': {
          // Adrian VOWLES
          url: '/players/80',
          mos: true,
        },
      },
      2000: {
        '/players/2046': {
          // Kris RADLINSKI
          url: '/players/2046',
          mos: false,
        },
        '/players/2049': {
          // Jason ROBINSON
          url: '/players/2049',
          mos: false,
        },
        '/players/643': {
          // Steve RENOUF
          url: '/players/643',
          mos: false,
        },
        '/players/1779': {
          // Michael EAGAR
          url: '/players/1779',
          mos: false,
        },
        '/players/174': {
          // Graham MACKAY
          url: '/players/174',
          mos: false,
        },
        '/players/2008': {
          // Tommy MARTYN
          url: '/players/2008',
          mos: false,
        },
        '/players/2013': {
          // Sean LONG
          url: '/players/2013',
          mos: true,
        },
        '/players/2093': {
          // Stuart FIELDEN
          url: '/players/2093',
          mos: false,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/2056': {
          // Terry O'CONNOR
          url: '/players/2056',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/1827': {
          // Denis BETTS
          url: '/players/1827',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: false,
        },
      },
      2001: {
        '/players/2046': {
          // Kris RADLINSKI
          url: '/players/2046',
          mos: false,
        },
        '/players/1937': {
          // Tevita VAIKONA
          url: '/players/1937',
          mos: false,
        },
        '/players/118': {
          // Tonie CARROLL
          url: '/players/118',
          mos: false,
        },
        '/players/643': {
          // Steve RENOUF
          url: '/players/643',
          mos: false,
        },
        '/players/90': {
          // Brett DALLAS
          url: '/players/90',
          mos: false,
        },
        '/players/2011': {
          // Paul SCULTHORPE
          url: '/players/2011',
          mos: true,
        },
        '/players/179': {
          // Adrian LAM
          url: '/players/179',
          mos: false,
        },
        '/players/248': {
          // David FAIRLEIGH
          url: '/players/248',
          mos: false,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/2056': {
          // Terry O'CONNOR
          url: '/players/2056',
          mos: false,
        },
        '/players/215': {
          // David FURNER
          url: '/players/215',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: false,
        },
      },
      2002: {
        '/players/2046': {
          // Kris RADLINSKI
          url: '/players/2046',
          mos: false,
        },
        '/players/1937': {
          // Tevita VAIKONA
          url: '/players/1937',
          mos: false,
        },
        '/players/2126': {
          // Martin GLEESON
          url: '/players/2126',
          mos: false,
        },
        '/players/2109': {
          // Keith SENIOR
          url: '/players/2109',
          mos: false,
        },
        '/players/1458': {
          // Darren ALBERT
          url: '/players/1458',
          mos: false,
        },
        '/players/2067': {
          // Danny ORR
          url: '/players/2067',
          mos: false,
        },
        '/players/179': {
          // Adrian LAM
          url: '/players/179',
          mos: false,
        },
        '/players/2056': {
          // Terry O'CONNOR
          url: '/players/2056',
          mos: false,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/2093': {
          // Stuart FIELDEN
          url: '/players/2093',
          mos: false,
        },
        '/players/2069': {
          // Michael SMITH
          url: '/players/2069',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/2011': {
          // Paul SCULTHORPE
          url: '/players/2011',
          mos: true,
        },
      },
      2003: {
        '/players/2048': {
          // Gary CONNOLLY
          url: '/players/2048',
          mos: false,
        },
        '/players/1268': {
          // Lesley VAINIKOLO
          url: '/players/1268',
          mos: false,
        },
        '/players/2115': {
          // Gareth ELLIS
          url: '/players/2115',
          mos: false,
        },
        '/players/2109': {
          // Keith SENIOR
          url: '/players/2109',
          mos: false,
        },
        '/players/2125': {
          // Brian CARNEY
          url: '/players/2125',
          mos: false,
        },
        '/players/218': {
          // Graham APPO
          url: '/players/218',
          mos: false,
        },
        '/players/179': {
          // Adrian LAM
          url: '/players/179',
          mos: false,
        },
        '/players/283': {
          // Craig SMITH
          url: '/players/283',
          mos: false,
        },
        '/players/1953': {
          // Terry NEWTON
          url: '/players/1953',
          mos: false,
        },
        '/players/2342': {
          // Andy LYNCH
          url: '/players/2342',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: true,
        },
        '/players/458': {
          // Matt ADAMSON
          url: '/players/458',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: false,
        },
      },
      2004: {
        '/players/2385': {
          // Shaun BRISCOE
          url: '/players/2385',
          mos: false,
        },
        '/players/1268': {
          // Lesley VAINIKOLO
          url: '/players/1268',
          mos: false,
        },
        '/players/2109': {
          // Keith SENIOR
          url: '/players/2109',
          mos: false,
        },
        '/players/1468': {
          // Sid DOMIC
          url: '/players/1468',
          mos: false,
        },
        '/players/1254': {
          // Marcus BAI
          url: '/players/1254',
          mos: false,
        },
        '/players/2111': {
          // Danny McGUIRE
          url: '/players/2111',
          mos: false,
        },
        '/players/2098': {
          // Richard HORNE
          url: '/players/2098',
          mos: false,
        },
        '/players/2053': {
          // Andy FARRELL
          url: '/players/2053',
          mos: true,
        },
        '/players/2131': {
          // Matt DISKIN
          url: '/players/2131',
          mos: false,
        },
        '/players/2431': {
          // Paul KING
          url: '/players/2431',
          mos: false,
        },
        '/players/1474': {
          // Ali LAUITI'ITI
          url: '/players/1474',
          mos: false,
        },
        '/players/1701': {
          // David SOLOMONA
          url: '/players/1701',
          mos: false,
        },
        '/players/2011': {
          // Paul SCULTHORPE
          url: '/players/2011',
          mos: false,
        },
      },
      2005: {
        '/players/2124': {
          // Paul WELLENS
          url: '/players/2124',
          mos: false,
        },
        '/players/2107': {
          // Mark CALDERWOOD
          url: '/players/2107',
          mos: false,
        },
        '/players/1635': {
          // Jamie LYON
          url: '/players/1635',
          mos: true,
        },
        '/players/2126': {
          // Martin GLEESON
          url: '/players/2126',
          mos: false,
        },
        '/players/1458': {
          // Darren ALBERT
          url: '/players/1458',
          mos: false,
        },
        '/players/2101': {
          // Paul COOKE
          url: '/players/2101',
          mos: false,
        },
        '/players/2116': {
          // Rob BURROW
          url: '/players/2116',
          mos: false,
        },
        '/players/2103': {
          // Jamie THACKRAY
          url: '/players/2103',
          mos: false,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/2016': {
          // Paul ANDERSON
          url: '/players/2016',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/1474': {
          // Ali LAUITI'ITI
          url: '/players/1474',
          mos: false,
        },
        '/players/2110': {
          // Kevin SINFIELD
          url: '/players/2110',
          mos: false,
        },
      },
      2006: {
        '/players/2124': {
          // Paul WELLENS
          url: '/players/2124',
          mos: true,
        },
        '/players/2306': {
          // Justin MURPHY
          url: '/players/2306',
          mos: false,
        },
        '/players/1635': {
          // Jamie LYON
          url: '/players/1635',
          mos: false,
        },
        '/players/2095': {
          // Kirk YEAMAN
          url: '/players/2095',
          mos: false,
        },
        '/players/2320': {
          // David HODGSON
          url: '/players/2320',
          mos: false,
        },
        '/players/2111': {
          // Danny McGUIRE
          url: '/players/2111',
          mos: false,
        },
        '/players/2013': {
          // Sean LONG
          url: '/players/2013',
          mos: false,
        },
        '/players/2093': {
          // Stuart FIELDEN
          url: '/players/2093',
          mos: false,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/296': {
          // Danny NUTLEY
          url: '/players/296',
          mos: false,
        },
        '/players/2115': {
          // Gareth ELLIS
          url: '/players/2115',
          mos: false,
        },
        '/players/2396': {
          // Jon WILKIN
          url: '/players/2396',
          mos: false,
        },
        '/players/2110': {
          // Kevin SINFIELD
          url: '/players/2110',
          mos: false,
        },
      },
      2007: {
        '/players/2124': {
          // Paul WELLENS
          url: '/players/2124',
          mos: false,
        },
        '/players/5485': {
          // Kevin PENNY
          url: '/players/5485',
          mos: false,
        },
        '/players/1398': {
          // Adam MOGG
          url: '/players/1398',
          mos: false,
        },
        '/players/2346': {
          // Jason DEMETRIOU
          url: '/players/2346',
          mos: false,
        },
        '/players/19': {
          // Scott DONALD
          url: '/players/19',
          mos: false,
        },
        '/players/806': {
          // Trent BARRETT
          url: '/players/806',
          mos: false,
        },
        '/players/2116': {
          // Rob BURROW
          url: '/players/2116',
          mos: false,
        },
        '/players/1930': {
          // Nick FOZZARD
          url: '/players/1930',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: true,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/2115': {
          // Gareth ELLIS
          url: '/players/2115',
          mos: false,
        },
        '/players/768': {
          // Glenn MORRISON
          url: '/players/768',
          mos: false,
        },
        '/players/2128': {
          // Stephen WILD
          url: '/players/2128',
          mos: false,
        },
      },
      2008: {
        '/players/1617': {
          // Clint GREENSHIELDS
          url: '/players/1617',
          mos: false,
        },
        '/players/19': {
          // Scott DONALD
          url: '/players/19',
          mos: false,
        },
        '/players/272': {
          // Matthew GIDLEY
          url: '/players/272',
          mos: false,
        },
        '/players/273': {
          // George CARMONT
          url: '/players/273',
          mos: false,
        },
        '/players/2391': {
          // Ade GARDNER
          url: '/players/2391',
          mos: false,
        },
        '/players/2091': {
          // Leon PRYCE
          url: '/players/2091',
          mos: false,
        },
        '/players/2116': {
          // Rob BURROW
          url: '/players/2116',
          mos: false,
        },
        '/players/2397': {
          // James GRAHAM
          url: '/players/2397',
          mos: true,
        },
        '/players/2164': {
          // Keiron CUNNINGHAM
          url: '/players/2164',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/2115': {
          // Gareth ELLIS
          url: '/players/2115',
          mos: false,
        },
        '/players/2402': {
          // Ben WESTWOOD
          url: '/players/2402',
          mos: false,
        },
        '/players/2110': {
          // Kevin SINFIELD
          url: '/players/2110',
          mos: false,
        },
      },
      2009: {
        '/players/307': {
          // Brett HODGSON
          url: '/players/307',
          mos: true,
        },
        '/players/5534': {
          // Peter FOX
          url: '/players/5534',
          mos: false,
        },
        '/players/272': {
          // Matthew GIDLEY
          url: '/players/272',
          mos: false,
        },
        '/players/2109': {
          // Keith SENIOR
          url: '/players/2109',
          mos: false,
        },
        '/players/5703': {
          // Ryan HALL
          url: '/players/5703',
          mos: false,
        },
        '/players/13564': {
          // Sam TOMKINS
          url: '/players/13564',
          mos: false,
        },
        '/players/3509': {
          // Michael DOBSON
          url: '/players/3509',
          mos: false,
        },
        '/players/843': {
          // Adrian MORLEY
          url: '/players/843',
          mos: false,
        },
        '/players/2399': {
          // Scott MOORE
          url: '/players/2399',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/314': {
          // Ben GALEA
          url: '/players/314',
          mos: false,
        },
        '/players/1616': {
          // Clint NEWTON
          url: '/players/1616',
          mos: false,
        },
        '/players/2110': {
          // Kevin SINFIELD
          url: '/players/2110',
          mos: false,
        },
      },
      2010: {
        '/players/2124': {
          // Paul WELLENS
          url: '/players/2124',
          mos: false,
        },
        '/players/311': {
          // Pat RICHARDS
          url: '/players/311',
          mos: true,
        },
        '/players/738': {
          // Matt KING
          url: '/players/738',
          mos: false,
        },
        '/players/2109': {
          // Keith SENIOR
          url: '/players/2109',
          mos: false,
        },
        '/players/5703': {
          // Ryan HALL
          url: '/players/5703',
          mos: false,
        },
        '/players/13564': {
          // Sam TOMKINS
          url: '/players/13564',
          mos: false,
        },
        '/players/3509': {
          // Michael DOBSON
          url: '/players/3509',
          mos: false,
        },
        '/players/843': {
          // Adrian MORLEY
          url: '/players/843',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: false,
        },
        '/players/2397': {
          // James GRAHAM
          url: '/players/2397',
          mos: false,
        },
        '/players/2402': {
          // Ben WESTWOOD
          url: '/players/2402',
          mos: false,
        },
        '/players/2445': {
          // Joel TOMKINS
          url: '/players/2445',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2011: {
        '/players/13564': {
          // Sam TOMKINS
          url: '/players/13564',
          mos: false,
        },
        '/players/7423': {
          // Tom BRISCOE
          url: '/players/7423',
          mos: false,
        },
        '/players/2095': {
          // Kirk YEAMAN
          url: '/players/2095',
          mos: false,
        },
        '/players/273': {
          // George CARMONT
          url: '/players/273',
          mos: false,
        },
        '/players/838': {
          // Joel MONAGHAN
          url: '/players/838',
          mos: false,
        },
        '/players/3760': {
          // Rangi CHASE
          url: '/players/3760',
          mos: true,
        },
        '/players/7431': {
          // Scott DUREAU
          url: '/players/7431',
          mos: false,
        },
        '/players/2397': {
          // James GRAHAM
          url: '/players/2397',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: false,
        },
        '/players/3119': {
          // Garreth CARVELL
          url: '/players/3119',
          mos: false,
        },
        '/players/2402': {
          // Ben WESTWOOD
          url: '/players/2402',
          mos: false,
        },
        '/players/263': {
          // Steve MENZIES
          url: '/players/263',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2012: {
        '/players/13564': {
          // Sam TOMKINS
          url: '/players/13564',
          mos: true,
        },
        '/players/15492': {
          // Josh CHARNLEY
          url: '/players/15492',
          mos: false,
        },
        '/players/273': {
          // George CARMONT
          url: '/players/273',
          mos: false,
        },
        '/players/3476': {
          // Ryan ATKINS
          url: '/players/3476',
          mos: false,
        },
        '/players/5703': {
          // Ryan HALL
          url: '/players/5703',
          mos: false,
        },
        '/players/1389': {
          // Brett FINCH
          url: '/players/1389',
          mos: false,
        },
        '/players/7431': {
          // Scott DUREAU
          url: '/players/7431',
          mos: false,
        },
        '/players/3184': {
          // Chris HILL
          url: '/players/3184',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: false,
        },
        '/players/3505': {
          // Rémi CASTY
          url: '/players/3505',
          mos: false,
        },
        '/players/2402': {
          // Ben WESTWOOD
          url: '/players/2402',
          mos: false,
        },
        '/players/2360': {
          // Gareth HOCK
          url: '/players/2360',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2013: {
        '/players/13564': {
          // Sam TOMKINS
          url: '/players/13564',
          mos: false,
        },
        '/players/15492': {
          // Josh CHARNLEY
          url: '/players/15492',
          mos: false,
        },
        '/players/7570': {
          // Leroy CUDJOE
          url: '/players/7570',
          mos: false,
        },
        '/players/19779': {
          // Ben CROOKS
          url: '/players/19779',
          mos: false,
        },
        '/players/18936': {
          // Tom LINEHAM
          url: '/players/18936',
          mos: false,
        },
        '/players/2433': {
          // Danny BROUGH
          url: '/players/2433',
          mos: true,
        },
        '/players/3492': {
          // Matty SMITH
          url: '/players/3492',
          mos: false,
        },
        '/players/2414': {
          // Eorl CRABTREE
          url: '/players/2414',
          mos: false,
        },
        '/players/13559': {
          // Shaun LUNT
          url: '/players/13559',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/2384': {
          // Brett FERRES
          url: '/players/2384',
          mos: false,
        },
        '/players/7710': {
          // Danny KIRMOND
          url: '/players/7710',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2014: {
        '/players/16593': {
          // Zak HARDAKER
          url: '/players/16593',
          mos: false,
        },
        '/players/16463': {
          // Thomas MAKINSON
          url: '/players/16463',
          mos: false,
        },
        '/players/7712': {
          // Kallum WATKINS
          url: '/players/7712',
          mos: false,
        },
        '/players/3316': {
          // Michael SHENTON
          url: '/players/3316',
          mos: false,
        },
        '/players/5703': {
          // Ryan HALL
          url: '/players/5703',
          mos: false,
        },
        '/players/2362': {
          // Kevin BROWN
          url: '/players/2362',
          mos: false,
        },
        '/players/3492': {
          // Matty SMITH
          url: '/players/3492',
          mos: false,
        },
        '/players/3184': {
          // Chris HILL
          url: '/players/3184',
          mos: false,
        },
        '/players/16464': {
          // Daryl CLARK
          url: '/players/16464',
          mos: true,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/13950': {
          // Elliott WHITEHEAD
          url: '/players/13950',
          mos: false,
        },
        '/players/3132': {
          // Carl ABLETT
          url: '/players/3132',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2015: {
        '/players/16593': {
          // Zak HARDAKER
          url: '/players/16593',
          mos: true,
        },
        '/players/15372': {
          // Jermaine McGILLVARY
          url: '/players/15372',
          mos: false,
        },
        '/players/7712': {
          // Kallum WATKINS
          url: '/players/7712',
          mos: false,
        },
        '/players/3316': {
          // Michael SHENTON
          url: '/players/3316',
          mos: false,
        },
        '/players/20212': {
          // Joe BURGESS
          url: '/players/20212',
          mos: false,
        },
        '/players/2433': {
          // Danny BROUGH
          url: '/players/2433',
          mos: false,
        },
        '/players/13563': {
          // Luke GALE
          url: '/players/13563',
          mos: false,
        },
        '/players/19879': {
          // Alex WALMSLEY
          url: '/players/19879',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: false,
        },
        '/players/2127': {
          // Jamie PEACOCK
          url: '/players/2127',
          mos: false,
        },
        '/players/3536': {
          // Zeb TAIA
          url: '/players/3536',
          mos: false,
        },
        '/players/14519': {
          // Liam FARRELL
          url: '/players/14519',
          mos: false,
        },
        '/players/3528': {
          // Adam CUTHBERTSON
          url: '/players/3528',
          mos: false,
        },
      },
      2016: {
        '/players/20184': {
          // Jamie SHAUL
          url: '/players/20184',
          mos: false,
        },
        '/players/20263': {
          // Denny SOLOMONA
          url: '/players/20263',
          mos: false,
        },
        '/players/3476': {
          // Ryan ATKINS
          url: '/players/3476',
          mos: false,
        },
        '/players/19979': {
          // Mahe FONUA
          url: '/players/19979',
          mos: false,
        },
        '/players/20605': {
          // Dominic MANFREDI
          url: '/players/20605',
          mos: false,
        },
        '/players/275': {
          // Kurt GIDLEY
          url: '/players/275',
          mos: false,
        },
        '/players/13563': {
          // Luke GALE
          url: '/players/13563',
          mos: false,
        },
        '/players/3184': {
          // Chris HILL
          url: '/players/3184',
          mos: false,
        },
        '/players/5712': {
          // Danny HOUGHTON
          url: '/players/5712',
          mos: true,
        },
        '/players/14070': {
          // Scott TAYLOR
          url: '/players/14070',
          mos: false,
        },
        '/players/19644': {
          // Ben CURRIE
          url: '/players/19644',
          mos: false,
        },
        '/players/1375': {
          // Mark MINICHIELLO
          url: '/players/1375',
          mos: false,
        },
        '/players/2115': {
          // Gareth ELLIS
          url: '/players/2115',
          mos: false,
        },
      },
      2017: {
        '/players/16593': {
          // Zak HARDAKER
          url: '/players/16593',
          mos: false,
        },
        '/players/17218': {
          // Greg EDEN
          url: '/players/17218',
          mos: false,
        },
        '/players/3316': {
          // Michael SHENTON
          url: '/players/3316',
          mos: false,
        },
        '/players/20203': {
          // Mark PERCIVAL
          url: '/players/20203',
          mos: false,
        },
        '/players/19979': {
          // Mahe FONUA
          url: '/players/19979',
          mos: false,
        },
        '/players/14507': {
          // Albert KELLY
          url: '/players/14507',
          mos: false,
        },
        '/players/13563': {
          // Luke GALE
          url: '/players/13563',
          mos: true,
        },
        '/players/7731': {
          // Grant MILLINGTON
          url: '/players/7731',
          mos: false,
        },
        '/players/21637': {
          // Matt PARCELL
          url: '/players/21637',
          mos: false,
        },
        '/players/19975': {
          // Sebastine IKAHIHIFO
          url: '/players/19975',
          mos: false,
        },
        '/players/15041': {
          // Ben MURDOCH-MASILA
          url: '/players/15041',
          mos: false,
        },
        '/players/20006': {
          // Mike McMEEKEN
          url: '/players/20006',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2018: {
        '/players/7854': {
          // Ben BARBA
          url: '/players/7854',
          mos: true,
        },
        '/players/16463': {
          // Thomas MAKINSON
          url: '/players/16463',
          mos: false,
        },
        '/players/20203': {
          // Mark PERCIVAL
          url: '/players/20203',
          mos: false,
        },
        '/players/14518': {
          // Bill TUPOU
          url: '/players/14518',
          mos: false,
        },
        '/players/21481': {
          // Tom JOHNSTONE
          url: '/players/21481',
          mos: false,
        },
        '/players/13588': {
          // Jonny LOMAX
          url: '/players/13588',
          mos: false,
        },
        '/players/23410': {
          // Daniel RICHARDSON
          url: '/players/23410',
          mos: false,
        },
        '/players/20561': {
          // Luke THOMPSON
          url: '/players/20561',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: false,
        },
        '/players/3505': {
          // Rémi CASTY
          url: '/players/3505',
          mos: false,
        },
        '/players/17077': {
          // John BATEMAN
          url: '/players/17077',
          mos: false,
        },
        '/players/13571': {
          // Mat ASHURST
          url: '/players/13571',
          mos: false,
        },
        '/players/2130': {
          // Sean O'LOUGHLIN
          url: '/players/2130',
          mos: false,
        },
      },
      2019: {
        '/players/7838': {
          // Lachlan COOTE
          url: '/players/7838',
          mos: false,
        },
        '/players/16463': {
          // Thomas MAKINSON
          url: '/players/16463',
          mos: false,
        },
        '/players/15038': {
          // Kevin NAIQAMA
          url: '/players/15038',
          mos: false,
        },
        '/players/19473': {
          // Konrad HURRELL
          url: '/players/19473',
          mos: false,
        },
        '/players/21380': {
          // Ash HANDLEY
          url: '/players/21380',
          mos: false,
        },
        '/players/17317': {
          // Blake AUSTIN
          url: '/players/17317',
          mos: false,
        },
        '/players/20926': {
          // Jackson HASTINGS
          url: '/players/20926',
          mos: true,
        },
        '/players/8036': {
          // Liam WATTS
          url: '/players/8036',
          mos: false,
        },
        '/players/16464': {
          // Daryl CLARK
          url: '/players/16464',
          mos: false,
        },
        '/players/20561': {
          // Luke THOMPSON
          url: '/players/20561',
          mos: false,
        },
        '/players/19643': {
          // Josh JONES
          url: '/players/19643',
          mos: false,
        },
        '/players/14519': {
          // Liam FARRELL
          url: '/players/14519',
          mos: false,
        },
        '/players/22035': {
          // Morgan KNOWLES
          url: '/players/22035',
          mos: false,
        },
      },
      2020: {
        '/players/22774': {
          // Bevan FRENCH
          url: '/players/22774',
          mos: false,
        },
        '/players/5572': {
          // Krisnan INU
          url: '/players/5572',
          mos: false,
        },
        '/players/21495': {
          // Toby KING
          url: '/players/21495',
          mos: false,
        },
        '/players/19473': {
          // Konrad HURRELL
          url: '/players/19473',
          mos: false,
        },
        '/players/21380': {
          // Ash HANDLEY
          url: '/players/21380',
          mos: false,
        },
        '/players/13588': {
          // Jonny LOMAX
          url: '/players/13588',
          mos: false,
        },
        '/players/19687': {
          // Aidan SEZER
          url: '/players/19687',
          mos: false,
        },
        '/players/3754': {
          // Mike COOPER
          url: '/players/3754',
          mos: false,
        },
        '/players/13550': {
          // Paul McSHANE
          url: '/players/13550',
          mos: true,
        },
        '/players/19879': {
          // Alex WALMSLEY
          url: '/players/19879',
          mos: false,
        },
        '/players/20290': {
          // Kelepi TANGINOA
          url: '/players/20290',
          mos: false,
        },
        '/players/14519': {
          // Liam FARRELL
          url: '/players/14519',
          mos: false,
        },
        '/players/22035': {
          // Morgan KNOWLES
          url: '/players/22035',
          mos: false,
        },
      },
      2021: {
        '/players/13564': {
          // Sam TOMKINS
          url: '/players/13564',
          mos: true,
        },
        '/players/17375': {
          // Ken SIO
          url: '/players/17375',
          mos: false,
        },
        '/players/27186': {
          // Jack WELSBY
          url: '/players/27186',
          mos: false,
        },
        '/players/20203': {
          // Mark PERCIVAL
          url: '/players/20203',
          mos: false,
        },
        '/players/23444': {
          // Tom DAVIES
          url: '/players/23444',
          mos: false,
        },
        '/players/13588': {
          // Jonny LOMAX
          url: '/players/13588',
          mos: false,
        },
        '/players/13818': {
          // James MALONEY
          url: '/players/13818',
          mos: false,
        },
        '/players/16587': {
          // Sam KASIANO
          url: '/players/16587',
          mos: false,
        },
        '/players/20562': {
          // Kruise LEEMING
          url: '/players/20562',
          mos: false,
        },
        '/players/19879': {
          // Alex WALMSLEY
          url: '/players/19879',
          mos: false,
        },
        '/players/15022': {
          // Kane LINNETT
          url: '/players/15022',
          mos: false,
        },
        '/players/14519': {
          // Liam FARRELL
          url: '/players/14519',
          mos: false,
        },
        '/players/22035': {
          // Morgan KNOWLES
          url: '/players/22035',
          mos: false,
        },
      },
      2022: {
        '/players/23401': {
          // Jai FIELD
          url: '/players/23401',
          mos: false,
        },
        '/players/22774': {
          // Bevan FRENCH
          url: '/players/22774',
          mos: false,
        },
        '/players/5552': {
          // Shaun KENNY-DOWALL
          url: '/players/5552',
          mos: false,
        },
        '/players/16594': {
          // Tim LAFAI
          url: '/players/16594',
          mos: false,
        },
        '/players/17375': {
          // Ken SIO
          url: '/players/17375',
          mos: false,
        },
        '/players/27186': {
          // Jack WELSBY
          url: '/players/27186',
          mos: false,
        },
        '/players/22778': {
          // Brodie CROFT
          url: '/players/22778',
          mos: true,
        },
        '/players/19879': {
          // Alex WALMSLEY
          url: '/players/19879',
          mos: false,
        },
        '/players/2393': {
          // James ROBY
          url: '/players/2393',
          mos: false,
        },
        '/players/23514': {
          // Mikolaj OLEDZKI
          url: '/players/23514',
          mos: false,
        },
        '/players/13960': {
          // Chris McQUEEN
          url: '/players/13960',
          mos: false,
        },
        '/players/14519': {
          // Liam FARRELL
          url: '/players/14519',
          mos: false,
        },
        '/players/22035': {
          // Morgan KNOWLES
          url: '/players/22035',
          mos: false,
        },
      },
      2023: {
        '/players/27186': {
          // Jack WELSBY
          url: '/players/27186',
          mos: false,
        },
        '/players/15492': {
          // Josh CHARNLEY
          url: '/players/15492',
          mos: false,
        },
        '/players/5552': {
          // Shaun KENNY-DOWALL
          url: '/players/5552',
          mos: false,
        },
        '/players/22766': {
          // Jacob WARDLE
          url: '/players/22766',
          mos: false,
        },
        '/players/21481': {
          // Tom JOHNSTONE
          url: '/players/21481',
          mos: false,
        },
        '/players/22774': {
          // Bevan FRENCH
          url: '/players/22774',
          mos: true,
        },
        '/players/24113': {
          // Lachlan LAM
          url: '/players/24113',
          mos: false,
        },
        '/players/20287': {
          // Paul VAUGHAN
          url: '/players/20287',
          mos: false,
        },
        '/players/28669': {
          // Edwin IPAPE
          url: '/players/28669',
          mos: false,
        },
        '/players/28634': {
          // Tom AMONE
          url: '/players/28634',
          mos: false,
        },
        '/players/7712': {
          // Kallum WATKINS
          url: '/players/7712',
          mos: false,
        },
        '/players/14519': {
          // Liam FARRELL
          url: '/players/14519',
          mos: false,
        },
        '/players/20830': {
          // John ASIATA
          url: '/players/20830',
          mos: false,
        },
      },
      2024: {
        '/players/23900': {
          // Matt DUFTY
          url: '/players/23900',
          mos: false,
        },
        '/players/23484': {
          // Matthew ASHTON
          url: '/players/23484',
          mos: false,
        },
        '/players/20645': {
          // Nene MACDONALD
          url: '/players/20645',
          mos: false,
        },
        '/players/22766': {
          // Jacob WARDLE
          url: '/players/22766',
          mos: false,
        },
        '/players/23414': {
          // Liam MARSHALL
          url: '/players/23414',
          mos: false,
        },
        '/players/28625': {
          // Mikey LEWIS
          url: '/players/28625',
          mos: true,
        },
        '/players/15370': {
          // Marc SNEYD
          url: '/players/15370',
          mos: false,
        },
        '/players/24086': {
          // Matty LEES
          url: '/players/24086',
          mos: false,
        },
        '/players/23470': {
          // Danny WALKER
          url: '/players/23470',
          mos: false,
        },
        '/players/20561': {
          // Luke THOMPSON
          url: '/players/20561',
          mos: false,
        },
        '/players/34015': {
          // Junior NSEMBA
          url: '/players/34015',
          mos: false,
        },
        '/players/21524': {
          // Rhyse MARTIN
          url: '/players/21524',
          mos: false,
        },
        '/players/20591': {
          // Elliot MINCHELLA
          url: '/players/20591',
          mos: false,
        },
      },
      2025: {
        '/players/23401': {
          // Jai FIELD
          url: '/players/23401',
          mos: false,
        },
        '/players/35706': {
          // Lewis MARTIN
          url: '/players/35706',
          mos: false,
        },
        '/players/20352': {
          // Peta HIKU
          url: '/players/20352',
          mos: false,
        },
        '/players/30243': {
          // Umyla HANLEY
          url: '/players/30243',
          mos: false,
        },
        '/players/23414': {
          // Liam MARSHALL
          url: '/players/23414',
          mos: false,
        },
        '/players/28625': {
          // Mikey LEWIS
          url: '/players/28625',
          mos: false,
        },
        '/players/20181': {
          // Jake CONNOR
          url: '/players/20181',
          mos: false,
        },
        '/players/20006': {
          // Mike McMEEKEN
          url: '/players/20006',
          mos: false,
        },
        '/players/23471': {
          // Jez LITTEN
          url: '/players/23471',
          mos: false,
        },
        '/players/21503': {
          // Herman ESE'ESE
          url: '/players/21503',
          mos: false,
        },
        '/players/20185': {
          // Dean HADLEY
          url: '/players/20185',
          mos: false,
        },
        '/players/30245': {
          // James McDONNELL
          url: '/players/30245',
          mos: false,
        },
        '/players/22035': {
          // Morgan KNOWLES
          url: '/players/22035',
          mos: false,
        },
      },
    };

  const challengeCups: Record<Season, {
    team: TeamName
    lance_todd: PlayerURL | PlayerURL[]
  }>
    = {
      1998: {
        team: 'Sheffield',
        lance_todd: '/players/2021',
      },
      1999: {
        team: 'Leeds',
        lance_todd: '/players/2072',
      },
      2000: {
        team: 'Bradford',
        lance_todd: '/players/2050',
      },
      2001: {
        team: 'St Helens',
        lance_todd: '/players/2013',
      },
      2002: {
        team: 'Wigan',
        lance_todd: '/players/2046',
      },
      2003: {
        team: 'Bradford',
        lance_todd: '/players/2048',
      },
      2004: {
        team: 'St Helens',
        lance_todd: '/players/2013',
      },
      2005: {
        team: 'Hull FC',
        lance_todd: '/players/2110',
      },
      2006: {
        team: 'St Helens',
        lance_todd: '/players/2013',
      },
      2007: {
        team: 'St Helens',
        lance_todd: [
          '/players/2124',
          '/players/2091',
        ],
      },
      2008: {
        team: 'St Helens',
        lance_todd: '/players/2124',
      },
      2009: {
        team: 'Warrington',
        lance_todd: '/players/824',
      },
      2010: {
        team: 'Warrington',
        lance_todd: '/players/1964',
      },
      2011: {
        team: 'Wigan',
        lance_todd: '/players/3440',
      },
      2012: {
        team: 'Warrington',
        lance_todd: '/players/307',
      },
      2013: {
        team: 'Wigan',
        lance_todd: '/players/3492',
      },
      2014: {
        team: 'Leeds',
        lance_todd: '/players/5703',
      },
      2015: {
        team: 'Leeds',
        lance_todd: '/players/7423',
      },
      2016: {
        team: 'Hull FC',
        lance_todd: '/players/15370',
      },
      2017: {
        team: 'Hull FC',
        lance_todd: '/players/15370',
      },
      2018: {
        team: 'Catalans',
        lance_todd: '/players/14496',
      },
      2019: {
        team: 'Warrington',
        lance_todd: '/players/16464',
      },
      2020: {
        team: 'Leeds',
        lance_todd: '/players/13560',
      },
      2021: {
        team: 'St Helens',
        lance_todd: '/players/20195',
      },
      2022: {
        team: 'Wigan',
        lance_todd: '/players/13960',
      },
      2023: {
        team: 'Leigh',
        lance_todd: '/players/24113',
      },
      2024: {
        team: 'Wigan',
        lance_todd: '/players/22774',
      },
      2025: {
        team: 'Hull KR',
        lance_todd: '/players/15370',
      },
    };

  const youngPlayersOfTheYear: Record<Season, PlayerURL> = {
    2025: '/players/51765', // Harry Robertson
    2024: '/players/34015', // Junior Nsemba
    2023: '/players/28621', // Josh Thewlis
    2022: '/players/27186', // Jack Welsby
    2021: '/players/27186', // Jack Welsby
    2020: '/players/23908', // Harry Newman
    2019: '/players/24086', // Matty Lees
    2018: '/players/23736', // Jake Trueman
    2017: '/players/21511', // Oliver Gildart
    2016: '/players/21481', // Tom Johnstone
    2015: '/players/20210', // George Williams
    2014: '/players/16464', // Daryl Clark
    2013: '/players/19779', // Ben Crooks
    2012: '/players/16593', // Zak Hardaker
    2011: '/players/13588', // Jonny Lomax
    2010: '/players/13564', // Sam Tomkins
    2009: '/players/13564', // Sam Tomkins
    2008: '/players/7424', // Joe Westerman
    2007: '/players/3482', // Sam Burgess
    2006: '/players/2397', // James Graham
    2005: '/players/2430', // Richard Whiting
    2004: '/players/2385', // Shaun Briscoe
    2003: '/players/2360', // Gareth Hock
    2002: '/players/2098', // Richard Horne
    2001: '/players/2116', // Rob Burrow
    2000: '/players/2093', // Stuart Fielden
    1999: '/players/2091', // Leon Pryce
    1998: '/players/2047', // Lee Gilmour
  };

  return {
    dreamTeams,
    challengeCups,
    youngPlayersOfTheYear,
  };
}
