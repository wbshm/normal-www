import {
  formatDateLong,
  formatDateRange,
  formatLeaveDates,
  formatMultiplier,
  type BridgeOpportunity,
  type BrueckentageLocale,
  type StateYearSummary,
  type SupportedYear,
} from './brueckentage';

export interface FaqItem {
  question: string;
  answer: string;
}

export const uiCopy = {
  de: {
    backToApp: 'Dayweave',
    overviewCrumb: (year: SupportedYear) => `Brückentage ${year}`,
    yearSwitchLabel: 'Planungsjahr wählen',
    eyebrowOverview: (year: SupportedYear) => `Brückentage ${year} · Deutschland`,
    eyebrowState: (year: SupportedYear, code: string) => `Brückentage ${year} · ${code}`,
    h1Overview: (year: SupportedYear) => `Brückentage ${year}: Alle 16 Bundesländer & Urlaubsplaner`,
    h1State: (year: SupportedYear, stateName: string) => `Brückentage ${year} ${stateName}: Feiertage, Schulferien & Planer`,
    introOverview: {
      2027: 'Im Jahr 2027 fallen der 1. Mai, der 3. Oktober, der Reformationstag und beide Weihnachtstage auf ein Wochenende. Umso mehr lohnen sich die Brückentage rund um Ostern, Christi Himmelfahrt (Freitag, 7. Mai), Pfingsten sowie die zusätzlichen Landesfeiertage.',
      2028: '2028 ist ein besonders günstiges Jahr für Brückentage: Neben Ostern und Christi Himmelfahrt fallen auch der 1. Mai, der 3. Oktober, der Reformationstag, Allerheiligen sowie beide Weihnachtstage auf Werktage. Zwischen Weihnachten und Neujahr reichen 3 Urlaubstage für 10 Tage frei.',
    } as Record<SupportedYear, string>,
    titleOverview: (year: SupportedYear) => `Brückentage ${year}: Alle 16 Bundesländer & Urlaubsplaner – Dayweave`,
    descOverview: {
      2027: 'Brückentage 2027 für alle 16 Bundesländer: Ostern 4 Tage für 10 Tage frei, 7. Mai 1 Tag für 4 Tage frei, plus Schulferien und interaktiver Urlaubsrechner.',
      2028: 'Brückentage 2028 für alle 16 Bundesländer: 1. Mai, Christi Himmelfahrt, 3. Oktober, Weihnachten (3 Tage für 10 Tage frei) mit Schulferien und Urlaubsrechner.',
    } as Record<SupportedYear, string>,
    titleState: (year: SupportedYear, stateName: string) => `Brückentage ${year} ${stateName}: Feiertage & Schulferien – Dayweave`,
    descState: (year: SupportedYear, stateName: string, recLeave: number, recFree: number) =>
      `Alle Brückentage ${year} in ${stateName} mit gesetzlichen Feiertagen, KMK-Schulferien und Urlaubsrechner: Mit ${recLeave} Urlaubstagen bis zu ${recFree} Tage frei.`,
    stateGridHeading: (year: SupportedYear) => `Bundesland wählen (${year})`,
    stateGridLead: 'Jedes Bundesland hat eigene Feiertage und Schulferien. Wähle dein Bundesland für die vollständige Brückentage- und Ferientabelle.',
    stateSwitcherLabel: 'Bundesland wechseln',
    allStatesLink: 'Alle 16 Bundesländer',
    nationwideHeading: (year: SupportedYear) => `Bundesweite Brückentage ${year} (alle 16 Bundesländer)`,
    nationwideLead: 'Diese Brückentage gelten bei einer 5-Tage-Woche (Mo–Fr) in ganz Deutschland. Hake deine Wunsch-Zeiträume an, um Urlaubstage und freie Tage direkt zusammenzurechnen.',
    statePlannerHeading: (year: SupportedYear, stateName: string) => `Brückentage ${year} in ${stateName}`,
    statePlannerLead: 'Berechnet für eine 5-Tage-Woche (Mo–Fr). Wähle deine Wunsch-Auszeiten aus – überschneidende Zeiträume werden automatisch getauscht.',
    comparisonHeading: (year: SupportedYear) => `Alle 16 Bundesländer im Vergleich (${year})`,
    comparisonLead: 'Feiertage auf Werktagen (Mo–Fr) und die empfohlene Brückentage-Kombination pro Bundesland.',
    extraHolidaysHeading: (year: SupportedYear) => `Zusätzliche Landesfeiertage ${year}`,
    extraHolidaysLead: 'Diese Feiertage gelten nur in bestimmten Bundesländern und bringen dort zusätzliche Brückentage.',
    holidaysHeading: (year: SupportedYear, stateName: string) => `Gesetzliche Feiertage ${year} in ${stateName}`,
    schoolBreaksHeading: (year: SupportedYear, stateName: string) => `Schulferien ${year} in ${stateName} (KMK)`,
    schoolBreaksLead: 'Amtliche Ferientermine der Kultusministerkonferenz (KMK). Bewegliche Ferientage einzelner Schulen sind nicht enthalten.',
    faqHeading: 'Häufige Fragen',
    // Table columns
    colPlan: 'Plan',
    colOccasion: 'Anlass',
    colLeaveDates: 'Urlaubstage nehmen',
    colFreeRange: 'Freier Zeitraum',
    colRatio: 'Urlaub → Frei',
    colSchool: 'Schulferien',
    colState: 'Bundesland',
    colWorkdayHolidays: 'Feiertage (Mo–Fr)',
    colExtraHolidays: 'Besondere Feiertage',
    colBestBridge: 'Empfohlener Mix',
    colAction: 'Details',
    colDate: 'Datum',
    colWeekday: 'Wochentag',
    colHoliday: 'Feiertag',
    colStatus: 'Lage',
    colStates: 'Bundesländer',
    colBreakName: 'Ferien',
    colPeriod: 'Zeitraum',
    colDuration: 'Dauer',
    // Badges & Labels
    workdayBadge: 'Werktag',
    weekendBadge: 'Wochenende',
    classicTag: 'Brückentag',
    noSchoolOverlap: 'Außerhalb der Ferien',
    viewState: 'Tabelle öffnen',
    holidaysCountUnit: (n: number) => `${n} von`,
    daysUnit: (n: number) => (n === 1 ? '1 Tag' : `${n} Tage`),
    leaveShort: (n: number) => (n === 1 ? '1 Urlaubstag' : `${n} Urlaubstage`),
    freeShort: (n: number) => `${n} Tage frei`,
    // Interactive calculator
    budgetLabel: 'Jahresurlaub',
    budgetUnit: 'Tage',
    btnRecommended: 'Empfohlene Auswahl',
    btnClear: 'Zurücksetzen',
    jumpStateLabel: 'Direkt zum Bundesland',
    jumpStatePlaceholder: 'Bundesland wählen …',
    statSelectedLeave: 'Verplant',
    statTotalFree: 'Tage frei',
    statRemaining: 'Resturlaub',
    statRatio: 'Faktor',
    checkboxLabel: (occasion: string, leaveDays: number, freeDays: number) =>
      `${occasion} auswählen (${leaveDays} Urlaubstage für ${freeDays} Tage frei)`,
    overlapNotice: 'Überschneidender Zeitraum wurde automatisch ersetzt.',
    overBudgetNotice: 'Mehr Urlaubstage gewählt als im Budget – passe oben deinen Jahresurlaub an.',
    // KPI strip
    kpiWorkdayHolidays: 'Feiertage Mo–Fr',
    kpiWeekendHolidays: 'Am Wochenende',
    kpiBestRatio: 'Bester Hebel',
    kpiRecommended: 'Empfohlener Mix',
    // App Store CTA
    ctaEyebrow: 'Dayweave für iPhone',
    ctaTitle: 'Deine eigene Urlaubsplanung – offline auf dem iPhone',
    ctaBody:
      'Diese Tabelle rechnet mit einer Standard-Woche von Montag bis Freitag. In Dayweave planst du mit deinem echten Arbeitsmodell, behältst deinen Resturlaub im Blick und siehst alle Feiertage und Schulferien im Jahreskalender.',
    ctaBullets: [
      'Teilzeit, 4-Tage-Woche und eigene Arbeitstage',
      'Resturlaub aus dem Vorjahr mit Verfalls-Erinnerung',
      'Jahreskalender mit Kalenderwochen, Widgets und ICS-Export',
      'Vollständig offline – kein Konto, keine Werbung, kein Tracking',
    ],
    ctaButton: 'Dayweave im App Store ansehen',
    ctaSecondary: 'Mehr über Dayweave',
    disclaimerPrefix: 'Angaben ohne Gewähr – maßgeblich sind dein Arbeitgeber und die amtlichen Stellen. Schulferien nach',
    kmkLabel: 'KMK',
    privacyLink: 'Datenschutz',
    supportLink: 'Support',
    appNavLabel: (year: SupportedYear) => `Brückentage ${year}`,
  },
  en: {
    backToApp: 'Dayweave',
    overviewCrumb: (year: SupportedYear) => `Bridge days ${year}`,
    yearSwitchLabel: 'Choose planning year',
    eyebrowOverview: (year: SupportedYear) => `Bridge days ${year} · Germany`,
    eyebrowState: (year: SupportedYear, code: string) => `Bridge days ${year} · ${code}`,
    h1Overview: (year: SupportedYear) => `Germany Bridge Days ${year}: All 16 States & Leave Planner`,
    h1State: (year: SupportedYear, stateName: string) => `Bridge Days ${year} in ${stateName}: Public & School Holidays`,
    introOverview: {
      2027: 'In 2027, Labour Day (1 May), German Unity Day (3 Oct), Reformation Day and both Christmas days fall on weekends. That makes the remaining weekday holidays — Easter, Ascension Day (Friday, 7 May), Whit Monday and regional holidays — even more valuable for planning longer breaks.',
      2028: '2028 is a strong year for bridge days in Germany: Labour Day, Ascension Day, German Unity Day, Reformation Day, All Saints’ Day and both Christmas days all fall on weekdays. Over Christmas and New Year, 3 leave days unlock 10 consecutive days off.',
    } as Record<SupportedYear, string>,
    titleOverview: (year: SupportedYear) => `Germany Bridge Days ${year}: All 16 States & Leave Planner — Dayweave`,
    descOverview: {
      2027: 'Plan 2027 bridge days (Brückentage) across all 16 German federal states: 4 leave days for 10 days off at Easter, 1 day on 7 May for 4 days off, plus school holidays.',
      2028: 'Plan 2028 bridge days (Brückentage) across all 16 German states: Labour Day, Ascension Day, 3 October, Christmas (3 days for 10 days off) with school holidays.',
    } as Record<SupportedYear, string>,
    titleState: (year: SupportedYear, stateName: string) => `Bridge Days ${year} in ${stateName}: Public & School Holidays — Dayweave`,
    descState: (year: SupportedYear, stateName: string, recLeave: number, recFree: number) =>
      `All ${year} bridge days in ${stateName} with statutory public holidays, official KMK school breaks and an interactive leave calculator: turn ${recLeave} leave days into ${recFree} days off.`,
    stateGridHeading: (year: SupportedYear) => `Choose your federal state (${year})`,
    stateGridLead: 'Public holidays and school breaks vary by Bundesland. Pick your state for the full bridge-day and holiday schedule.',
    stateSwitcherLabel: 'Switch federal state',
    allStatesLink: 'All 16 states',
    nationwideHeading: (year: SupportedYear) => `Nationwide bridge days ${year} (all 16 states)`,
    nationwideLead: 'Calculated for a standard Monday–Friday workweek across Germany. Check the breaks you want to total your leave days and consecutive days off.',
    statePlannerHeading: (year: SupportedYear, stateName: string) => `Bridge days ${year} in ${stateName}`,
    statePlannerLead: 'Calculated for a standard Monday–Friday workweek. Select breaks to build your plan — overlapping options automatically swap.',
    comparisonHeading: (year: SupportedYear) => `All 16 German states compared (${year})`,
    comparisonLead: 'Weekday public holidays (Mon–Fri) and the recommended bridge-day mix for each federal state.',
    extraHolidaysHeading: (year: SupportedYear) => `State-specific public holidays ${year}`,
    extraHolidaysLead: 'These statutory holidays apply only in selected states and create extra bridge-day opportunities there.',
    holidaysHeading: (year: SupportedYear, stateName: string) => `Public holidays ${year} in ${stateName}`,
    schoolBreaksHeading: (year: SupportedYear, stateName: string) => `School holidays ${year} in ${stateName} (KMK)`,
    schoolBreaksLead: 'Official school break dates published by the Standing Conference of Ministers of Education (KMK). Individual school discretionary days are not included.',
    faqHeading: 'Frequently asked questions',
    // Table columns
    colPlan: 'Plan',
    colOccasion: 'Occasion',
    colLeaveDates: 'Leave days to take',
    colFreeRange: 'Time off',
    colRatio: 'Leave → Off',
    colSchool: 'School breaks',
    colState: 'Federal state',
    colWorkdayHolidays: 'Holidays (Mon–Fri)',
    colExtraHolidays: 'State-specific holidays',
    colBestBridge: 'Recommended mix',
    colAction: 'Details',
    colDate: 'Date',
    colWeekday: 'Weekday',
    colHoliday: 'Holiday',
    colStatus: 'Day type',
    colStates: 'States',
    colBreakName: 'School break',
    colPeriod: 'Dates',
    colDuration: 'Length',
    // Badges & Labels
    workdayBadge: 'Workday',
    weekendBadge: 'Weekend',
    classicTag: 'Bridge day',
    noSchoolOverlap: 'Outside school breaks',
    viewState: 'Open table',
    holidaysCountUnit: (n: number) => `${n} of`,
    daysUnit: (n: number) => (n === 1 ? '1 day' : `${n} days`),
    leaveShort: (n: number) => (n === 1 ? '1 leave day' : `${n} leave days`),
    freeShort: (n: number) => `${n} days off`,
    // Interactive calculator
    budgetLabel: 'Annual leave',
    budgetUnit: 'days',
    btnRecommended: 'Recommended mix',
    btnClear: 'Reset',
    jumpStateLabel: 'Jump to federal state',
    jumpStatePlaceholder: 'Select state …',
    statSelectedLeave: 'Planned',
    statTotalFree: 'Days off',
    statRemaining: 'Remaining',
    statRatio: 'Multiplier',
    checkboxLabel: (occasion: string, leaveDays: number, freeDays: number) =>
      `Select ${occasion} (${leaveDays} leave days for ${freeDays} days off)`,
    overlapNotice: 'Overlapping option was replaced automatically.',
    overBudgetNotice: 'Selected leave exceeds your budget — adjust your annual leave above.',
    // KPI strip
    kpiWorkdayHolidays: 'Weekday holidays',
    kpiWeekendHolidays: 'On weekends',
    kpiBestRatio: 'Best ratio',
    kpiRecommended: 'Recommended mix',
    // App Store CTA
    ctaEyebrow: 'Dayweave for iPhone',
    ctaTitle: 'Plan your own annual leave — completely offline on iPhone',
    ctaBody:
      'This table assumes a standard Monday–Friday workweek. Dayweave adapts to your real workdays, tracks carried-over leave and brings all 16 states’ public and school holidays into one calm calendar.',
    ctaBullets: [
      'Part-time, four-day weeks and custom working days',
      'Carried-over leave balance with expiry reminders',
      'Full-year calendar with ISO weeks, Home Screen widgets and ICS export',
      'Works completely offline — no account, no ads, no tracking',
    ],
    ctaButton: 'View Dayweave on the App Store',
    ctaSecondary: 'About Dayweave',
    disclaimerPrefix: 'No guarantee of accuracy — your employer and official authorities are authoritative. School holiday dates based on',
    kmkLabel: 'KMK',
    privacyLink: 'Privacy policy',
    supportLink: 'Support',
    appNavLabel: (year: SupportedYear) => `Bridge days ${year}`,
  },
} as const;

export function buildOverviewFaqs(locale: BrueckentageLocale, year: SupportedYear, nationwideOpps: BridgeOpportunity[]): FaqItem[] {
  const best = [...nationwideOpps].sort((a, b) => b.efficiency - a.efficiency || b.freeDays - a.freeDays)[0];
  const easterAfter = nationwideOpps.find((o) => o.id.endsWith('ostern-nach'));
  const ascension = nationwideOpps.find((o) => o.id.includes('ascension-bruecke'));
  const xmas = nationwideOpps.find((o) => o.id.endsWith('weihnachten-neujahr'));

  if (locale === 'de') {
    const items: FaqItem[] = [
      {
        question: `Welche Brückentage lohnen sich ${year} deutschlandweit am meisten?`,
        answer:
          year === 2027
            ? `2027 bieten vor allem Christi Himmelfahrt (${ascension ? `${formatLeaveDates(ascension.leaveDates, 'de')} = 1 Urlaubstag für 4 Tage frei` : 'Freitag, 7. Mai = 1 Tag für 4 Tage frei'}) und Ostern (${easterAfter ? `4 Urlaubstage für 10 Tage frei, z. B. ${formatDateRange(easterAfter.start, easterAfter.end, 'de')}` : '4 Tage für 10 Tage frei'}) sowie Pfingstmontag (4 Tage für 9 Tage frei) den größten Hebel.`
            : `2028 gibt es deutschlandweit besonders viele Brückentage: Christi Himmelfahrt (${ascension ? formatLeaveDates(ascension.leaveDates, 'de') : '26. Mai'}) und der Tag der Deutschen Einheit (Montag, 2. Okt.) bringen jeweils mit 1 Urlaubstag 4 freie Tage. Rund um Weihnachten und Neujahr ergeben ${xmas ? `${xmas.leaveDays} Urlaubstage (${formatLeaveDates(xmas.leaveDates, 'de')}) ganze ${xmas.freeDays} Tage frei` : '3 Urlaubstage ganze 10 Tage frei'}.`,
      },
      {
        question: `Warum unterscheiden sich die Brückentage ${year} je nach Bundesland?`,
        answer: `In Deutschland sind nur 9 Feiertage bundesweit gesetzlich geregelt. Zusätzliche Feiertage wie Heilige Drei Könige, Internationaler Frauentag, Fronleichnam, Mariä Himmelfahrt, Weltkindertag, Reformationstag, Allerheiligen und Buß- und Bettag gelten nur in einzelnen Bundesländern – und in Bayern, Sachsen und Thüringen teils sogar nur in bestimmten Gemeinden.`,
      },
      {
        question: `Welches Bundesland hat ${year} die meisten Feiertage auf Werktagen?`,
        answer:
          year === 2027
            ? '2027 führen Baden-Württemberg und Bayern mit 8 landesweiten Feiertagen auf Werktagen (Mo–Fr), gefolgt von Nordrhein-Westfalen, Rheinland-Pfalz, dem Saarland, Sachsen und Sachsen-Anhalt mit jeweils 7 Werktags-Feiertagen.'
            : '2028 haben Bayern und Baden-Württemberg 11 landesweite Werktags-Feiertage (Mo–Fr), in überwiegend katholischen Gemeinden Bayerns sogar 12 mit Mariä Himmelfahrt. Ebenfalls stark stehen das Saarland (11), Nordrhein-Westfalen, Rheinland-Pfalz, Sachsen und Sachsen-Anhalt (je 10) da.',
      },
      {
        question: `Wie funktionieren Brückentage bei Teilzeit oder 4-Tage-Woche?`,
        answer: `Die Tabellen auf dieser Seite gehen von einer 5-Tage-Woche (Montag bis Freitag) aus. Wenn du an anderen Tagen arbeitest, verschieben sich sowohl die benötigten Urlaubstage als auch der Hebel (${best ? `z. B. ${formatMultiplier(best.efficiency, 'de')}` : 'bis 4,0×'}). In der iPhone-App Dayweave kannst du deine exakten Arbeitstage hinterlegen und bekommst passende Vorschläge direkt offline berechnet.`,
      },
    ];
    return items;
  }

  return [
    {
      question: `Which bridge days in Germany offer the best return in ${year}?`,
      answer:
        year === 2027
          ? `In 2027, the strongest nationwide options are Ascension Day (${ascension ? `${formatLeaveDates(ascension.leaveDates, 'en')}: 1 leave day for 4 days off` : 'Friday 7 May: 1 leave day for 4 days off'}), Easter (${easterAfter ? `4 leave days for 10 days off, e.g. ${formatDateRange(easterAfter.start, easterAfter.end, 'en')}` : '4 leave days for 10 days off'}) and Whit Monday (4 leave days for 9 days off).`
          : `In 2028, Germany has several high-ratio bridge days nationwide: Ascension Day (${ascension ? formatLeaveDates(ascension.leaveDates, 'en') : '26 May'}) and German Unity Day (Monday 2 Oct) each turn 1 leave day into 4 days off, while Christmas and New Year turn ${xmas ? `${xmas.leaveDays} leave days (${formatLeaveDates(xmas.leaveDates, 'en')}) into ${xmas.freeDays} consecutive days off` : '3 leave days into 10 days off'}.`,
    },
    {
      question: `Why do ${year} bridge days differ across German federal states?`,
      answer:
        'Only 9 public holidays apply nationwide in Germany. Additional statutory holidays — such as Epiphany, International Women’s Day, Corpus Christi, Assumption Day, World Children’s Day, Reformation Day, All Saints’ Day and Day of Repentance and Prayer — apply only in specific states, and in Bavaria, Saxony and Thuringia some apply only in certain municipalities.',
    },
    {
      question: `Which German state has the most weekday public holidays in ${year}?`,
      answer:
        year === 2027
          ? 'In 2027, Baden-Württemberg and Bavaria lead with 8 state-wide weekday holidays (Mon–Fri), followed by North Rhine-Westphalia, Rhineland-Palatinate, Saarland, Saxony and Saxony-Anhalt with 7 weekday holidays each.'
          : 'In 2028, Baden-Württemberg, Bavaria and Saarland lead with 11 state-wide weekday holidays (Mon–Fri) — and predominantly Catholic municipalities in Bavaria get a 12th on Assumption Day (15 Aug).',
    },
    {
      question: `How do I plan bridge days if I work part-time or a 4-day week?`,
      answer:
        'The tables on this page assume a standard Monday–Friday schedule. If you work different days, the Dayweave iPhone app lets you configure your exact working days, carried-over leave and school holiday preferences completely offline.',
    },
  ];
}

export function buildStateFaqs(locale: BrueckentageLocale, summary: StateYearSummary): FaqItem[] {
  const { state, year, workdayHolidayCount, holidays, recommendedPlan, bestSingleOpportunity, schoolBreaks } = summary;
  const stateName = state.name[locale];
  const extraWorkdayHolidays = holidays.filter((h) => h.states !== 'ALL' && h.isWorkday);
  const nextSchoolBreak = schoolBreaks.find((b) => b.name.de.includes('Oster')) ?? schoolBreaks[0];

  if (locale === 'de') {
    return [
      {
        question: `Wie viele gesetzliche Feiertage fallen ${year} in ${stateName} auf einen Werktag?`,
        answer: `In ${stateName} gibt es ${year} insgesamt ${holidays.length} landesweite gesetzliche Feiertage, davon fallen ${workdayHolidayCount} auf einen Werktag (Montag bis Freitag) und ${holidays.length - workdayHolidayCount} auf ein Wochenende.${state.regionalNote ? ` ${state.regionalNote.de}` : ''}`,
      },
      {
        question: `Welcher Brückentag lohnt sich ${year} in ${stateName} am meisten?`,
        answer: bestSingleOpportunity
          ? `Den höchsten Hebel bietet ${bestSingleOpportunity.occasion.de}: Mit ${bestSingleOpportunity.leaveDays === 1 ? '1 Urlaubstag' : `${bestSingleOpportunity.leaveDays} Urlaubstagen`} (${formatLeaveDates(bestSingleOpportunity.leaveDates, 'de')}) bekommst du ${bestSingleOpportunity.freeDays} freie Tage am Stück (${formatDateRange(bestSingleOpportunity.start, bestSingleOpportunity.end, 'de')}, Faktor ${formatMultiplier(bestSingleOpportunity.efficiency, 'de')}). Mit dem empfohlenen Mix aus ${recommendedPlan.leaveDays} Urlaubstagen kommst du auf insgesamt ${recommendedPlan.freeDays} freie Tage.`
          : `Die besten Brückentage ${year} in ${stateName} liegen rund um Ostern, Christi Himmelfahrt und Pfingsten.`,
      },
      {
        question: `Welche besonderen Landesfeiertage hat ${stateName} ${year}?`,
        answer:
          extraWorkdayHolidays.length > 0
            ? `Zusätzlich zu den bundesweiten Feiertagen fallen ${year} in ${stateName} folgende Landesfeiertage auf Werktage: ${extraWorkdayHolidays.map((h) => `${h.name.de} (${formatDateLong(h.date, 'de', false)})`).join(', ')}.`
            : `${stateName} hat ${year} über die 9 bundesweiten Feiertage hinaus keine zusätzlichen Landesfeiertage auf einem Werktag (Montag bis Freitag).`,
      },
      {
        question: `Wann sind die Schulferien ${year} in ${stateName}?`,
        answer: nextSchoolBreak
          ? `Die offiziellen KMK-Schulferien ${year} in ${stateName} umfassen ${schoolBreaks.length} Ferienabschnitte, darunter die ${nextSchoolBreak.name.de} (${formatDateRange(nextSchoolBreak.start, nextSchoolBreak.end, 'de', true)}). In der Brückentage-Tabelle oben siehst du direkt, welche Auszeiten in den Ferien liegen und welche außerhalb.`
          : `Alle offiziellen KMK-Ferientermine für ${stateName} findest du in der Schulferien-Tabelle auf dieser Seite.`,
      },
    ];
  }

  return [
    {
      question: `How many public holidays fall on weekdays in ${stateName} in ${year}?`,
      answer: `${stateName} has ${holidays.length} state-wide statutory public holidays in ${year}: ${workdayHolidayCount} fall on weekdays (Monday to Friday) and ${holidays.length - workdayHolidayCount} fall on weekends.${state.regionalNote ? ` ${state.regionalNote.en}` : ''}`,
    },
    {
      question: `What is the best bridge day in ${stateName} in ${year}?`,
      answer: bestSingleOpportunity
        ? `The highest return comes around ${bestSingleOpportunity.occasion.en}: ${bestSingleOpportunity.leaveDays === 1 ? '1 leave day' : `${bestSingleOpportunity.leaveDays} leave days`} (${formatLeaveDates(bestSingleOpportunity.leaveDates, 'en')}) gives you ${bestSingleOpportunity.freeDays} consecutive days off (${formatDateRange(bestSingleOpportunity.start, bestSingleOpportunity.end, 'en')}, ${formatMultiplier(bestSingleOpportunity.efficiency, 'en')}). With the recommended mix of ${recommendedPlan.leaveDays} leave days, you can unlock ${recommendedPlan.freeDays} days off.`
        : `The strongest bridge days in ${stateName} in ${year} are around Easter, Ascension Day and Whit Monday.`,
    },
    {
      question: `Which extra state holidays does ${stateName} have in ${year}?`,
      answer:
        extraWorkdayHolidays.length > 0
          ? `Beyond Germany’s 9 nationwide holidays, ${stateName} has these additional weekday holidays in ${year}: ${extraWorkdayHolidays.map((h) => `${h.name.en} (${formatDateLong(h.date, 'en', false)})`).join(', ')}.`
          : `Beyond Germany’s 9 nationwide holidays, ${stateName} has no additional state-wide weekday holidays in ${year}.`,
    },
    {
      question: `When are the ${year} school holidays in ${stateName}?`,
      answer: nextSchoolBreak
        ? `Official KMK school holidays in ${stateName} for ${year} cover ${schoolBreaks.length} periods, including ${nextSchoolBreak.name.en} (${formatDateRange(nextSchoolBreak.start, nextSchoolBreak.end, 'en', true)}). The bridge-day table above flags whether each break overlaps with local school holidays.`
        : `All official KMK school break dates for ${stateName} are listed in the school holiday table on this page.`,
    },
  ];
}

export function buildStateIntro(locale: BrueckentageLocale, summary: StateYearSummary): string {
  const { state, year, workdayHolidayCount, holidays, recommendedPlan, bestSingleOpportunity } = summary;
  const stateName = state.name[locale];
  const extraWorkday = holidays.filter((h) => h.states !== 'ALL' && h.isWorkday);

  if (locale === 'de') {
    const extraClause =
      extraWorkday.length > 0
        ? ` Zu den bundesweiten Terminen kommen ${extraWorkday.map((h) => h.name.de).join(', ')} als zusätzliche Werktags-Feiertage.`
        : '';
    const bestClause = bestSingleOpportunity
      ? ` Mit der empfohlenen Auswahl aus ${recommendedPlan.leaveDays} Urlaubstagen holst du ${recommendedPlan.freeDays} freie Tage heraus.`
      : '';
    return `In ${stateName} fallen ${year} ${workdayHolidayCount} von ${holidays.length} landesweiten Feiertagen auf Montag bis Freitag.${extraClause}${bestClause}`;
  }

  const extraClause =
    extraWorkday.length > 0
      ? ` On top of Germany’s nationwide holidays, ${stateName} adds ${extraWorkday.map((h) => h.name.en).join(', ')} on weekdays.`
      : '';
  const bestClause = bestSingleOpportunity
    ? ` Using the recommended mix of ${recommendedPlan.leaveDays} leave days unlocks ${recommendedPlan.freeDays} consecutive days off.`
    : '';
  return `In ${stateName}, ${workdayHolidayCount} of ${holidays.length} state-wide public holidays fall on weekdays (Mon–Fri) in ${year}.${extraClause}${bestClause}`;
}
