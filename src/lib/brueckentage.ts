import rawHolidayDataset from '../data/dayweave-holidays-de.json';

export type BrueckentageLocale = 'de' | 'en';
export type SupportedYear = 2027 | 2028;

export const SUPPORTED_YEARS: readonly SupportedYear[] = [2027, 2028] as const;
export const DAYWEAVE_APP_STORE_ID = '6836203431';
export const DAYWEAVE_APP_STORE_URL: Record<BrueckentageLocale, string> = {
  de: `https://apps.apple.com/de/app/id${DAYWEAVE_APP_STORE_ID}`,
  en: `https://apps.apple.com/app/id${DAYWEAVE_APP_STORE_ID}`,
};

export type GermanStateCode =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV'
  | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

export interface GermanStateInfo {
  code: GermanStateCode;
  name: Record<BrueckentageLocale, string>;
  slug: Record<BrueckentageLocale, string>;
  regionalNote?: Record<BrueckentageLocale, string>;
}

export const GERMAN_STATES: readonly GermanStateInfo[] = [
  {
    code: 'BW',
    name: { de: 'Baden-Württemberg', en: 'Baden-Württemberg' },
    slug: { de: 'baden-wuerttemberg', en: 'baden-wuerttemberg' },
  },
  {
    code: 'BY',
    name: { de: 'Bayern', en: 'Bavaria' },
    slug: { de: 'bayern', en: 'bavaria' },
    regionalNote: {
      de: 'Örtliche Feiertage in Bayern (nicht landesweit): Mariä Himmelfahrt (15. Aug., in überwiegend katholischen Gemeinden) sowie das Augsburger Friedensfest (8. Aug., nur Stadtgebiet Augsburg).',
      en: 'Municipal holidays in Bavaria (not state-wide): Assumption Day (15 Aug, in predominantly Catholic municipalities) and Augsburg Peace Festival (8 Aug, city of Augsburg only).',
    },
  },
  {
    code: 'BE',
    name: { de: 'Berlin', en: 'Berlin' },
    slug: { de: 'berlin', en: 'berlin' },
  },
  {
    code: 'BB',
    name: { de: 'Brandenburg', en: 'Brandenburg' },
    slug: { de: 'brandenburg', en: 'brandenburg' },
  },
  {
    code: 'HB',
    name: { de: 'Bremen', en: 'Bremen' },
    slug: { de: 'bremen', en: 'bremen' },
  },
  {
    code: 'HH',
    name: { de: 'Hamburg', en: 'Hamburg' },
    slug: { de: 'hamburg', en: 'hamburg' },
  },
  {
    code: 'HE',
    name: { de: 'Hessen', en: 'Hesse' },
    slug: { de: 'hessen', en: 'hesse' },
  },
  {
    code: 'MV',
    name: { de: 'Mecklenburg-Vorpommern', en: 'Mecklenburg-Western Pomerania' },
    slug: { de: 'mecklenburg-vorpommern', en: 'mecklenburg-western-pomerania' },
  },
  {
    code: 'NI',
    name: { de: 'Niedersachsen', en: 'Lower Saxony' },
    slug: { de: 'niedersachsen', en: 'lower-saxony' },
  },
  {
    code: 'NW',
    name: { de: 'Nordrhein-Westfalen', en: 'North Rhine-Westphalia' },
    slug: { de: 'nordrhein-westfalen', en: 'north-rhine-westphalia' },
  },
  {
    code: 'RP',
    name: { de: 'Rheinland-Pfalz', en: 'Rhineland-Palatinate' },
    slug: { de: 'rheinland-pfalz', en: 'rhineland-palatinate' },
  },
  {
    code: 'SL',
    name: { de: 'Saarland', en: 'Saarland' },
    slug: { de: 'saarland', en: 'saarland' },
  },
  {
    code: 'SN',
    name: { de: 'Sachsen', en: 'Saxony' },
    slug: { de: 'sachsen', en: 'saxony' },
    regionalNote: {
      de: 'Örtlicher Feiertag in Sachsen (nicht landesweit): Fronleichnam in einzelnen sorbisch-katholischen Gemeinden.',
      en: 'Municipal holiday in Saxony (not state-wide): Corpus Christi in selected Sorbian Catholic municipalities.',
    },
  },
  {
    code: 'ST',
    name: { de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt' },
    slug: { de: 'sachsen-anhalt', en: 'saxony-anhalt' },
  },
  {
    code: 'SH',
    name: { de: 'Schleswig-Holstein', en: 'Schleswig-Holstein' },
    slug: { de: 'schleswig-holstein', en: 'schleswig-holstein' },
  },
  {
    code: 'TH',
    name: { de: 'Thüringen', en: 'Thuringia' },
    slug: { de: 'thueringen', en: 'thuringia' },
    regionalNote: {
      de: 'Örtlicher Feiertag in Thüringen (nicht landesweit): Fronleichnam im Landkreis Eichsfeld sowie in einzelnen Gemeinden im Unstrut-Hainich- und Wartburgkreis.',
      en: 'Municipal holiday in Thuringia (not state-wide): Corpus Christi in the Eichsfeld district and selected municipalities.',
    },
  },
] as const;

// Fix English slug for RP to be properly localized English
// Wait — check directly: let's define clean map lookup helpers
export function getStateByCode(code: GermanStateCode): GermanStateInfo {
  const found = GERMAN_STATES.find((s) => s.code === code);
  if (!found) throw new Error(`Unknown German state code: ${code}`);
  return found;
}

export type HolidayId =
  | 'newYear'
  | 'epiphany'
  | 'womensDay'
  | 'goodFriday'
  | 'easterMonday'
  | 'labourDay'
  | 'ascension'
  | 'whitMonday'
  | 'corpusChristi'
  | 'assumption'
  | 'childrensDay'
  | 'germanUnity'
  | 'reformation'
  | 'allSaints'
  | 'repentance'
  | 'christmasDay'
  | 'secondChristmasDay';

const HOLIDAY_NAMES: Record<HolidayId, Record<BrueckentageLocale, string>> = {
  newYear: { de: 'Neujahr', en: "New Year's Day" },
  epiphany: { de: 'Heilige Drei Könige', en: 'Epiphany' },
  womensDay: { de: 'Internationaler Frauentag', en: "International Women's Day" },
  goodFriday: { de: 'Karfreitag', en: 'Good Friday' },
  easterMonday: { de: 'Ostermontag', en: 'Easter Monday' },
  labourDay: { de: 'Tag der Arbeit', en: 'Labour Day' },
  ascension: { de: 'Christi Himmelfahrt', en: 'Ascension Day' },
  whitMonday: { de: 'Pfingstmontag', en: 'Whit Monday' },
  corpusChristi: { de: 'Fronleichnam', en: 'Corpus Christi' },
  assumption: { de: 'Mariä Himmelfahrt', en: 'Assumption Day' },
  childrensDay: { de: 'Weltkindertag', en: "World Children's Day" },
  germanUnity: { de: 'Tag der Deutschen Einheit', en: 'German Unity Day' },
  reformation: { de: 'Reformationstag', en: 'Reformation Day' },
  allSaints: { de: 'Allerheiligen', en: "All Saints' Day" },
  repentance: { de: 'Buß- und Bettag', en: 'Day of Repentance and Prayer' },
  christmasDay: { de: '1. Weihnachtstag', en: 'Christmas Day' },
  secondChristmasDay: { de: '2. Weihnachtstag', en: 'Second Day of Christmas' },
};

const SCHOOL_BREAK_EN: Record<string, string> = {
  Winterferien: 'Winter break',
  Osterferien: 'Easter break',
  'Frühjahrsferien': 'Spring break',
  Pfingstferien: 'Whitsun break',
  Sommerferien: 'Summer break',
  Herbstferien: 'Autumn break',
  Weihnachtsferien: 'Christmas break',
  'Himmelfahrts-/Pfingstferien': 'Ascension / Whitsun break',
  'Himmelfahrtsferien': 'Ascension break',
};

export interface PublicHoliday {
  id: HolidayId;
  date: string; // YYYY-MM-DD
  weekday: number; // 1 = Mon ... 7 = Sun
  isWorkday: boolean;
  name: Record<BrueckentageLocale, string>;
  states: GermanStateCode[] | 'ALL';
}

export interface SchoolBreak {
  state: GermanStateCode;
  name: Record<BrueckentageLocale, string>;
  start: string;
  end: string;
  days: number;
}

export interface BridgeOpportunity {
  id: string;
  occasion: Record<BrueckentageLocale, string>;
  detail: Record<BrueckentageLocale, string>;
  holidays: PublicHoliday[];
  leaveDates: string[];
  leaveDays: number;
  start: string;
  end: string;
  freeDays: number;
  efficiency: number;
  schoolBreakOverlaps: Record<BrueckentageLocale, string[]>;
  recommended: boolean;
  isClassicBridge: boolean; // 1–2 leave days directly bridging a Thu/Tue/Wed holiday
  states: GermanStateCode[] | 'ALL';
}

export interface StateYearSummary {
  state: GermanStateInfo;
  year: SupportedYear;
  holidays: PublicHoliday[];
  workdayHolidayCount: number;
  weekendHolidayCount: number;
  schoolBreaks: SchoolBreak[];
  opportunities: BridgeOpportunity[];
  recommendedPlan: {
    leaveDays: number;
    freeDays: number;
    count: number;
    efficiency: number;
  };
  bestSingleOpportunity: BridgeOpportunity | null;
}

// --- Pure UTC Date Helpers (no timezone drift) ---

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function makeIso(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, delta: number): string {
  const dt = parseIso(iso);
  dt.setUTCDate(dt.getUTCDate() + delta);
  return makeIso(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function diffDays(startIso: string, endIso: string): number {
  const a = parseIso(startIso).getTime();
  const b = parseIso(endIso).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** ISO weekday: 1 = Monday ... 7 = Sunday */
export function isoWeekday(iso: string): number {
  const wd = parseIso(iso).getUTCDay();
  return wd === 0 ? 7 : wd;
}

export function isWeekend(iso: string): boolean {
  const wd = isoWeekday(iso);
  return wd === 6 || wd === 7;
}

/** Gregorian Easter Sunday (Meeus/Jones/Butcher — matches Easter.swift) */
export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return makeIso(year, month, day);
}

/** Buß- und Bettag: last Wednesday before 23 November (matches GermanHolidayCalendar.swift) */
export function repentanceDay(year: number): string {
  const nov22 = makeIso(year, 11, 22);
  const wd = isoWeekday(nov22); // 1=Mon..7=Sun, Wed=3
  const back = (wd - 3 + 7) % 7;
  return addDays(nov22, -back);
}

// --- Statutory Holidays (matches GermanHolidayCalendar.swift) ---

interface HolidayRule {
  id: HolidayId;
  dateFor: (year: number, easter: string) => string;
  states: GermanStateCode[] | 'ALL';
}

const HOLIDAY_RULES: readonly HolidayRule[] = [
  { id: 'newYear', dateFor: (y) => makeIso(y, 1, 1), states: 'ALL' },
  { id: 'epiphany', dateFor: (y) => makeIso(y, 1, 6), states: ['BW', 'BY', 'ST'] },
  { id: 'womensDay', dateFor: (y) => makeIso(y, 3, 8), states: ['BE', 'MV'] },
  { id: 'goodFriday', dateFor: (_y, e) => addDays(e, -2), states: 'ALL' },
  { id: 'easterMonday', dateFor: (_y, e) => addDays(e, 1), states: 'ALL' },
  { id: 'labourDay', dateFor: (y) => makeIso(y, 5, 1), states: 'ALL' },
  { id: 'ascension', dateFor: (_y, e) => addDays(e, 39), states: 'ALL' },
  { id: 'whitMonday', dateFor: (_y, e) => addDays(e, 50), states: 'ALL' },
  { id: 'corpusChristi', dateFor: (_y, e) => addDays(e, 60), states: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'] },
  { id: 'assumption', dateFor: (y) => makeIso(y, 8, 15), states: ['SL'] },
  { id: 'childrensDay', dateFor: (y) => makeIso(y, 9, 20), states: ['TH'] },
  { id: 'germanUnity', dateFor: (y) => makeIso(y, 10, 3), states: 'ALL' },
  { id: 'reformation', dateFor: (y) => makeIso(y, 10, 31), states: ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'] },
  { id: 'allSaints', dateFor: (y) => makeIso(y, 11, 1), states: ['BW', 'BY', 'NW', 'RP', 'SL'] },
  { id: 'repentance', dateFor: (y) => repentanceDay(y), states: ['SN'] },
  { id: 'christmasDay', dateFor: (y) => makeIso(y, 12, 25), states: 'ALL' },
  { id: 'secondChristmasDay', dateFor: (y) => makeIso(y, 12, 26), states: 'ALL' },
];

export function getPublicHolidays(year: number, state: GermanStateCode | 'ALL'): PublicHoliday[] {
  const easter = easterSunday(year);
  return HOLIDAY_RULES.filter((rule) => {
    if (state === 'ALL') return rule.states === 'ALL';
    return rule.states === 'ALL' || rule.states.includes(state);
  })
    .map((rule) => {
      const date = rule.dateFor(year, easter);
      const weekday = isoWeekday(date);
      return {
        id: rule.id,
        date,
        weekday,
        isWorkday: weekday >= 1 && weekday <= 5,
        name: HOLIDAY_NAMES[rule.id],
        states: rule.states,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getStateSpecificHolidays(year: number): PublicHoliday[] {
  const easter = easterSunday(year);
  return HOLIDAY_RULES.filter((rule) => rule.states !== 'ALL')
    .map((rule) => {
      const date = rule.dateFor(year, easter);
      const weekday = isoWeekday(date);
      return {
        id: rule.id,
        date,
        weekday,
        isWorkday: weekday >= 1 && weekday <= 5,
        name: HOLIDAY_NAMES[rule.id],
        states: rule.states,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

// --- School Breaks (KMK Dataset from Dayweave) ---

interface RawBreak {
  state: GermanStateCode;
  name: string;
  start: string;
  end: string;
}

const RAW_BREAKS: RawBreak[] = rawHolidayDataset.breaks as RawBreak[];

function translateSchoolBreak(nameDe: string): string {
  if (SCHOOL_BREAK_EN[nameDe]) return SCHOOL_BREAK_EN[nameDe];
  return nameDe
    .replace('Winterferien', 'Winter break')
    .replace('Osterferien', 'Easter break')
    .replace('Frühjahrsferien', 'Spring break')
    .replace('Pfingstferien', 'Whitsun break')
    .replace('Sommerferien', 'Summer break')
    .replace('Herbstferien', 'Autumn break')
    .replace('Weihnachtsferien', 'Christmas break');
}

export function getSchoolBreaks(year: number, state: GermanStateCode): SchoolBreak[] {
  const yearStart = makeIso(year, 1, 1);
  const yearEnd = makeIso(year, 12, 31);
  return RAW_BREAKS.filter((b) => b.state === state && b.end >= yearStart && b.start <= yearEnd)
    .map((b) => ({
      state: b.state,
      name: { de: b.name, en: translateSchoolBreak(b.name) },
      start: b.start,
      end: b.end,
      days: diffDays(b.start, b.end) + 1,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

function getOverlappingSchoolBreaks(
  start: string,
  end: string,
  schoolBreaks: SchoolBreak[],
): Record<BrueckentageLocale, string[]> {
  const matching = schoolBreaks.filter((b) => b.start <= end && b.end >= start);
  const de = [...new Set(matching.map((b) => b.name.de))];
  const en = [...new Set(matching.map((b) => b.name.en))];
  return { de, en };
}

// --- Date Formatting (German & English, matching Dayweave DESIGN.md) ---

const WD_SHORT_DE = ['', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'];
const WD_LONG_DE = ['', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const MONTH_SHORT_DE = ['', 'Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
const MONTH_LONG_DE = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const WD_SHORT_EN = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WD_LONG_EN = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_SHORT_EN = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDateShort(iso: string, locale: BrueckentageLocale, includeYear = false): string {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = isoWeekday(iso);
  if (locale === 'de') {
    return `${WD_SHORT_DE[wd]}, ${d}. ${MONTH_SHORT_DE[m]}${includeYear ? ` ${y}` : ''}`;
  }
  return `${WD_SHORT_EN[wd]} ${d} ${MONTH_SHORT_EN[m]}${includeYear ? ` ${y}` : ''}`;
}

export function formatDateLong(iso: string, locale: BrueckentageLocale, includeYear = true): string {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = isoWeekday(iso);
  if (locale === 'de') {
    return `${WD_LONG_DE[wd]}, ${d}. ${MONTH_LONG_DE[m]}${includeYear ? ` ${y}` : ''}`;
  }
  return `${WD_LONG_EN[wd]}, ${d} ${MONTH_LONG_EN[m]}${includeYear ? ` ${y}` : ''}`;
}

export function formatWeekdayLong(weekday: number, locale: BrueckentageLocale): string {
  return locale === 'de' ? WD_LONG_DE[weekday] : WD_LONG_EN[weekday];
}

export function formatDateRange(start: string, end: string, locale: BrueckentageLocale, includeYear = false): string {
  const [y1, m1, d1] = start.split('-').map(Number);
  const [y2, m2, d2] = end.split('-').map(Number);
  const wd1 = isoWeekday(start);
  const wd2 = isoWeekday(end);
  if (start === end) {
    return formatDateShort(start, locale, includeYear);
  }
  const crossYear = y1 !== y2;
  if (locale === 'de') {
    if (!crossYear && m1 === m2) {
      return `${WD_SHORT_DE[wd1]}, ${d1}. – ${WD_SHORT_DE[wd2]}, ${d2}. ${MONTH_SHORT_DE[m2]}${includeYear ? ` ${y2}` : ''}`;
    }
    return `${WD_SHORT_DE[wd1]}, ${d1}. ${MONTH_SHORT_DE[m1]}${crossYear ? ` ${y1}` : ''} – ${WD_SHORT_DE[wd2]}, ${d2}. ${MONTH_SHORT_DE[m2]}${includeYear || crossYear ? ` ${y2}` : ''}`;
  }
  if (!crossYear && m1 === m2) {
    return `${WD_SHORT_EN[wd1]} ${d1} – ${WD_SHORT_EN[wd2]} ${d2} ${MONTH_SHORT_EN[m2]}${includeYear ? ` ${y2}` : ''}`;
  }
  return `${WD_SHORT_EN[wd1]} ${d1} ${MONTH_SHORT_EN[m1]}${crossYear ? ` ${y1}` : ''} – ${WD_SHORT_EN[wd2]} ${d2} ${MONTH_SHORT_EN[m2]}${includeYear || crossYear ? ` ${y2}` : ''}`;
}

export function formatLeaveDates(leaveDates: string[], locale: BrueckentageLocale): string {
  if (leaveDates.length === 0) return '';
  // Group contiguous dates into runs
  const runs: [string, string][] = [];
  let runStart = leaveDates[0];
  let prev = leaveDates[0];
  for (let i = 1; i < leaveDates.length; i++) {
    if (diffDays(prev, leaveDates[i]) === 1) {
      prev = leaveDates[i];
    } else {
      runs.push([runStart, prev]);
      runStart = leaveDates[i];
      prev = leaveDates[i];
    }
  }
  runs.push([runStart, prev]);
  return runs.map(([a, b]) => formatDateRange(a, b, locale)).join(locale === 'de' ? ' & ' : ' & ');
}

export function formatMultiplier(efficiency: number, locale: BrueckentageLocale): string {
  const fixed = efficiency.toFixed(1);
  return locale === 'de' ? `${fixed.replace('.', ',')}×` : `${fixed}×`;
}

// --- Bridge-Day Opportunity Generator ---

function isFreeDay(iso: string, holidayMap: Map<string, PublicHoliday>): boolean {
  return isWeekend(iso) || holidayMap.has(iso);
}

/** Expand a seed set of leave dates to the maximal contiguous stretch of free days + leave dates */
function expandStretch(
  leaveDates: string[],
  holidayMap: Map<string, PublicHoliday>,
): { start: string; end: string; freeDays: number; holidays: PublicHoliday[] } {
  const leaveSet = new Set(leaveDates);
  const sorted = [...leaveDates].sort();
  let start = sorted[0];
  let end = sorted[sorted.length - 1];

  while (isFreeDay(addDays(start, -1), holidayMap) || leaveSet.has(addDays(start, -1))) {
    start = addDays(start, -1);
  }
  while (isFreeDay(addDays(end, 1), holidayMap) || leaveSet.has(addDays(end, 1))) {
    end = addDays(end, 1);
  }

  const holidays: PublicHoliday[] = [];
  const total = diffDays(start, end) + 1;
  for (let i = 0; i < total; i++) {
    const d = addDays(start, i);
    const h = holidayMap.get(d);
    if (h) holidays.push(h);
  }

  return { start, end, freeDays: total, holidays };
}

function workdaysBetween(startIso: string, endIso: string, holidayMap: Map<string, PublicHoliday>): string[] {
  const days: string[] = [];
  const count = diffDays(startIso, endIso) + 1;
  for (let i = 0; i < count; i++) {
    const d = addDays(startIso, i);
    if (!isFreeDay(d, holidayMap)) days.push(d);
  }
  return days;
}

function buildOpportunity(
  id: string,
  occasion: Record<BrueckentageLocale, string>,
  detail: Record<BrueckentageLocale, string>,
  leaveDates: string[],
  holidayMap: Map<string, PublicHoliday>,
  schoolBreaks: SchoolBreak[],
  states: GermanStateCode[] | 'ALL',
  isClassicBridge: boolean,
): BridgeOpportunity | null {
  const cleanLeave = [...new Set(leaveDates)].filter((d) => !isFreeDay(d, holidayMap)).sort();
  if (cleanLeave.length === 0) return null;

  const { start, end, freeDays, holidays } = expandStretch(cleanLeave, holidayMap);
  if (holidays.length === 0) return null;

  // Efficiency must beat a regular 5-day vacation week (5 leave -> 9 free = 1.8x)
  const efficiency = freeDays / cleanLeave.length;
  if (efficiency < 1.99) return null;

  return {
    id,
    occasion,
    detail,
    holidays,
    leaveDates: cleanLeave,
    leaveDays: cleanLeave.length,
    start,
    end,
    freeDays,
    efficiency,
    schoolBreakOverlaps: getOverlappingSchoolBreaks(start, end, schoolBreaks),
    recommended: false,
    isClassicBridge,
    states,
  };
}

/**
 * Generates curated, high-signal bridge-day opportunities for a German state (or nationwide 'ALL')
 * in a given year, then marks the optimal non-overlapping combination (`recommended: true`)
 * using exact dynamic programming matching Dayweave's Planner.
 */
export function getBridgeOpportunities(year: SupportedYear, state: GermanStateCode | 'ALL'): BridgeOpportunity[] {
  const holidaysCurrent = getPublicHolidays(year, state);
  const holidaysNext = getPublicHolidays(year + 1, state);
  const holidayMap = new Map<string, PublicHoliday>();
  for (const h of [...holidaysCurrent, ...holidaysNext]) {
    holidayMap.set(h.date, h);
  }

  const schoolBreaks = state === 'ALL' ? [] : getSchoolBreaks(year, state);
  const byId = new Map<HolidayId, PublicHoliday>(holidaysCurrent.map((h) => [h.id, h]));
  const raw: BridgeOpportunity[] = [];
  const push = (opp: BridgeOpportunity | null) => {
    if (opp) raw.push(opp);
  };

  const newYear = byId.get('newYear');
  const epiphany = byId.get('epiphany');

  // 1. Neujahr + Heilige Drei Könige cluster (e.g. 2027 in BW/BY/ST: Fri 1 Jan + Wed 6 Jan)
  if (newYear && epiphany && newYear.isWorkday && epiphany.isWorkday) {
    const between = workdaysBetween(newYear.date, epiphany.date, holidayMap);
    const afterEpiphanyEnd = addDays(epiphany.date, 5 - epiphany.weekday); // Friday of Epiphany week
    const afterEpiphany = epiphany.weekday < 5 ? workdaysBetween(epiphany.date, afterEpiphanyEnd, holidayMap) : [];
    if (between.length > 0 && between.length <= 2) {
      push(
        buildOpportunity(
          `${year}-neujahr-hdk-kurz`,
          { de: 'Neujahr & Heilige Drei Könige', en: "New Year's & Epiphany" },
          { de: 'Brücke zwischen Neujahr und 6. Januar', en: "Bridge between New Year's Day and Epiphany" },
          between,
          holidayMap,
          schoolBreaks,
          epiphany.states,
          true,
        ),
      );
    }
    if (between.length > 0 && afterEpiphany.length > 0 && between.length + afterEpiphany.length <= 4) {
      push(
        buildOpportunity(
          `${year}-neujahr-hdk-lang`,
          { de: 'Neujahr & Heilige Drei Könige (lang)', en: "New Year's & Epiphany (extended)" },
          { de: 'Komplette erste Januarwoche freinehmen', en: 'Take the full first week of January off' },
          [...between, ...afterEpiphany],
          holidayMap,
          schoolBreaks,
          epiphany.states,
          false,
        ),
      );
    }
  } else if (epiphany && epiphany.isWorkday) {
    addSingleHolidayOpportunities(year, epiphany, holidayMap, schoolBreaks, push);
  }

  // 2. Neujahr standalone (only if it creates a >= 2x opportunity, e.g. Tue/Thu)
  if (newYear && newYear.isWorkday && !(epiphany && epiphany.isWorkday)) {
    if (newYear.weekday === 2 || newYear.weekday === 4) {
      addSingleHolidayOpportunities(year, newYear, holidayMap, schoolBreaks, push);
    }
  }

  // 3. Easter cluster (Karfreitag + Ostermontag — always Fri + Mon)
  const goodFriday = byId.get('goodFriday');
  const easterMonday = byId.get('easterMonday');
  if (goodFriday && easterMonday) {
    const beforeWeek = workdaysBetween(addDays(goodFriday.date, -4), addDays(goodFriday.date, -1), holidayMap);
    const afterWeek = workdaysBetween(addDays(easterMonday.date, 1), addDays(easterMonday.date, 4), holidayMap);

    push(
      buildOpportunity(
        `${year}-ostern-vor`,
        { de: 'Ostern (Karwoche)', en: 'Easter (week before)' },
        { de: '4 Tage vor Karfreitag frei', en: '4 leave days before Good Friday' },
        beforeWeek,
        holidayMap,
        schoolBreaks,
        'ALL',
        false,
      ),
    );
    push(
      buildOpportunity(
        `${year}-ostern-nach`,
        { de: 'Ostern (Osterwoche)', en: 'Easter (week after)' },
        { de: '4 Tage nach Ostermontag frei', en: '4 leave days after Easter Monday' },
        afterWeek,
        holidayMap,
        schoolBreaks,
        'ALL',
        false,
      ),
    );
    push(
      buildOpportunity(
        `${year}-ostern-kombi`,
        { de: 'Ostern (2 Wochen am Stück)', en: 'Easter (two-week break)' },
        { de: 'Karwoche und Osterwoche kombinieren', en: 'Combine both weeks around Easter' },
        [...beforeWeek, ...afterWeek],
        holidayMap,
        schoolBreaks,
        'ALL',
        false,
      ),
    );
  }

  // 4. All mid-year & autumn workday holidays
  const standardIds: HolidayId[] = [
    'womensDay',
    'labourDay',
    'ascension',
    'whitMonday',
    'corpusChristi',
    'assumption',
    'childrensDay',
    'germanUnity',
    'reformation',
    'allSaints',
    'repentance',
  ];

  // Check if Reformationstag (31 Oct) and Allerheiligen (1 Nov) exist? Never in same state, so safe individually.
  for (const id of standardIds) {
    const h = byId.get(id);
    if (h && h.isWorkday) {
      addSingleHolidayOpportunities(year, h, holidayMap, schoolBreaks, push);
    }
  }

  // 5. Christmas + New Year cluster (25/26 Dec -> 1 Jan next year)
  const xmas1 = byId.get('christmasDay');
  const xmas2 = byId.get('secondChristmasDay');
  const nextNewYear = holidaysNext.find((h) => h.id === 'newYear');
  if (xmas1 && xmas2 && nextNewYear && (xmas1.isWorkday || xmas2.isWorkday)) {
    const betweenXmasAndNY = workdaysBetween(xmas2.date, nextNewYear.date, holidayMap);
    if (betweenXmasAndNY.length > 0 && betweenXmasAndNY.length <= 4) {
      push(
        buildOpportunity(
          `${year}-weihnachten-neujahr`,
          { de: 'Weihnachten & Neujahr', en: "Christmas & New Year's" },
          { de: 'Zwischen den Jahren bis Neujahr frei', en: "Bridge Christmas through New Year's Day" },
          betweenXmasAndNY,
          holidayMap,
          schoolBreaks,
          'ALL',
          betweenXmasAndNY.length <= 3,
        ),
      );
    }
  }

  // Deduplicate identical (start, end, leaveDays) intervals and sort chronologically
  const deduped: BridgeOpportunity[] = [];
  const seen = new Set<string>();
  for (const opp of raw) {
    const key = `${opp.start}|${opp.end}|${opp.leaveDates.join(',')}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(opp);
    }
  }

  deduped.sort((a, b) => a.start.localeCompare(b.start) || a.leaveDays - b.leaveDays);

  // Mark recommended non-overlapping set (maximize net bonus days above a regular 5->9 week within 25 leave-day budget)
  markRecommendedSet(deduped, 25);

  return deduped;
}

function addSingleHolidayOpportunities(
  year: SupportedYear,
  h: PublicHoliday,
  holidayMap: Map<string, PublicHoliday>,
  schoolBreaks: SchoolBreak[],
  push: (opp: BridgeOpportunity | null) => void,
): void {
  const wd = h.weekday;
  const monday = addDays(h.date, -(wd - 1));
  const friday = addDays(h.date, 5 - wd);
  const fullWeekWorkdays = workdaysBetween(monday, friday, holidayMap);

  if (wd === 4) {
    // Thursday holiday -> classic 1-day bridge on Friday (1 -> 4) + optional 4-day full week (4 -> 9)
    push(
      buildOpportunity(
        `${year}-${h.id}-bruecke`,
        h.name,
        { de: 'Klassischer Brückentag am Freitag', en: 'Classic Friday bridge day' },
        [addDays(h.date, 1)],
        holidayMap,
        schoolBreaks,
        h.states,
        true,
      ),
    );
    push(
      buildOpportunity(
        `${year}-${h.id}-woche`,
        { de: `${h.name.de} (ganze Woche)`, en: `${h.name.en} (full week)` },
        { de: '4 Urlaubstage für 9 Tage am Stück', en: '4 leave days for 9 consecutive days off' },
        fullWeekWorkdays,
        holidayMap,
        schoolBreaks,
        h.states,
        false,
      ),
    );
  } else if (wd === 2) {
    // Tuesday holiday -> classic 1-day bridge on Monday (1 -> 4) + optional 4-day full week (4 -> 9)
    push(
      buildOpportunity(
        `${year}-${h.id}-bruecke`,
        h.name,
        { de: 'Klassischer Brückentag am Montag', en: 'Classic Monday bridge day' },
        [addDays(h.date, -1)],
        holidayMap,
        schoolBreaks,
        h.states,
        true,
      ),
    );
    push(
      buildOpportunity(
        `${year}-${h.id}-woche`,
        { de: `${h.name.de} (ganze Woche)`, en: `${h.name.en} (full week)` },
        { de: '4 Urlaubstage für 9 Tage am Stück', en: '4 leave days for 9 consecutive days off' },
        fullWeekWorkdays,
        holidayMap,
        schoolBreaks,
        h.states,
        false,
      ),
    );
  } else if (wd === 3) {
    // Wednesday holiday -> 2 days (Thu+Fri or Mon+Tue) = 5 days + 4 days full week = 9 days
    push(
      buildOpportunity(
        `${year}-${h.id}-kurz`,
        h.name,
        { de: '2 Brückentage vor oder nach dem Feiertag', en: '2 bridge days next to the midweek holiday' },
        [addDays(h.date, 1), addDays(h.date, 2)],
        holidayMap,
        schoolBreaks,
        h.states,
        true,
      ),
    );
    push(
      buildOpportunity(
        `${year}-${h.id}-woche`,
        { de: `${h.name.de} (ganze Woche)`, en: `${h.name.en} (full week)` },
        { de: '4 Urlaubstage für 9 Tage am Stück', en: '4 leave days for 9 consecutive days off' },
        fullWeekWorkdays,
        holidayMap,
        schoolBreaks,
        h.states,
        false,
      ),
    );
  } else if (wd === 1 || wd === 5) {
    // Monday or Friday holiday -> 4 leave days for 9 days off
    push(
      buildOpportunity(
        `${year}-${h.id}-woche`,
        h.name,
        { de: '4 Urlaubstage für 9 Tage am Stück', en: '4 leave days for 9 consecutive days off' },
        fullWeekWorkdays,
        holidayMap,
        schoolBreaks,
        h.states,
        false,
      ),
    );
  }
}

/** Exact non-overlapping weighted interval scheduling maximizing net bonus days within budget */
function markRecommendedSet(opportunities: BridgeOpportunity[], budget: number): void {
  const n = opportunities.length;
  if (n === 0) return;

  const order = opportunities.map((_, idx) => idx).sort(
    (a, b) =>
      opportunities[a].end.localeCompare(opportunities[b].end) ||
      opportunities[a].start.localeCompare(opportunities[b].start),
  );

  // prevNonOverlap[i] = largest index j < i (in sorted order) where end[j] < start[i]
  const prevNonOverlap = new Array<number>(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const startI = opportunities[order[i]].start;
    for (let j = i - 1; j >= 0; j--) {
      if (opportunities[order[j]].end < startI) {
        prevNonOverlap[i] = j;
        break;
      }
    }
  }

  const width = budget + 1;
  const dp = new Int32Array((n + 1) * width);
  const take = new Uint8Array((n + 1) * width);

  for (let i = 1; i <= n; i++) {
    const item = opportunities[order[i - 1]];
    const cost = item.leaveDays;
    // Net extra days gained vs. a standard 5->9 (1.8x) vacation week, plus slight nudge for classic 1-2 day bridges
    const itemBonus = Math.round((item.freeDays - 1.8 * cost) * 1000) + (item.isClassicBridge ? 450 : 0);
    const prevRow = (prevNonOverlap[i - 1] + 1) * width;
    const skipRow = (i - 1) * width;
    const curRow = i * width;

    for (let b = 0; b <= budget; b++) {
      let best = dp[skipRow + b];
      let picked = 0;
      if (cost <= b) {
        const cand = dp[prevRow + (b - cost)] + itemBonus;
        if (cand > best) {
          best = cand;
          picked = 1;
        }
      }
      dp[curRow + b] = best;
      take[curRow + b] = picked;
    }
  }

  // Reconstruct optimal selection
  let i = n;
  let b = budget;
  while (i > 0) {
    if (take[i * width + b] === 1) {
      const idx = order[i - 1];
      opportunities[idx].recommended = true;
      b -= opportunities[idx].leaveDays;
      i = prevNonOverlap[i - 1] + 1;
    } else {
      i -= 1;
    }
  }
}

export function getStateYearSummary(year: SupportedYear, stateCode: GermanStateCode): StateYearSummary {
  const state = getStateByCode(stateCode);
  const holidays = getPublicHolidays(year, stateCode);
  const workdayHolidayCount = holidays.filter((h) => h.isWorkday).length;
  const weekendHolidayCount = holidays.length - workdayHolidayCount;
  const schoolBreaks = getSchoolBreaks(year, stateCode);
  const opportunities = getBridgeOpportunities(year, stateCode);

  const rec = opportunities.filter((o) => o.recommended);
  const recLeave = rec.reduce((s, o) => s + o.leaveDays, 0);
  const recFree = rec.reduce((s, o) => s + o.freeDays, 0);

  const sortedByEff = [...opportunities].sort(
    (a, b) => b.efficiency - a.efficiency || b.freeDays - a.freeDays || a.start.localeCompare(b.start),
  );

  return {
    state,
    year,
    holidays,
    workdayHolidayCount,
    weekendHolidayCount,
    schoolBreaks,
    opportunities,
    recommendedPlan: {
      leaveDays: recLeave,
      freeDays: recFree,
      count: rec.length,
      efficiency: recLeave > 0 ? recFree / recLeave : 0,
    },
    bestSingleOpportunity: sortedByEff[0] ?? null,
  };
}

// --- Route Path Helpers ---

export function brueckentageOverviewPath(locale: BrueckentageLocale, year: SupportedYear): string {
  return locale === 'de'
    ? `/de/apps/dayweave/brueckentage-${year}/`
    : `/apps/dayweave/bridge-days-${year}/`;
}

export function brueckentageStatePath(
  locale: BrueckentageLocale,
  year: SupportedYear,
  state: GermanStateInfo,
): string {
  return `${brueckentageOverviewPath(locale, year)}${state.slug[locale]}/`;
}

export function getAllBrueckentagePaths(): string[] {
  const paths: string[] = [];
  for (const locale of ['de', 'en'] as const) {
    for (const year of SUPPORTED_YEARS) {
      paths.push(brueckentageOverviewPath(locale, year));
      for (const state of GERMAN_STATES) {
        paths.push(brueckentageStatePath(locale, year, state));
      }
    }
  }
  return paths;
}
