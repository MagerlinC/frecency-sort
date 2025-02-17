type SearchMatch = {
  id: string;
  label: string;
};

type StoredSearchMatch = {
  match: SearchMatch;
  count: number;
  visits: string[];
};

type StoredQuery = {
  selectedMatches: StoredSearchMatch[];
};

type StoredMap = Map<string, StoredQuery>;

// Math stolen straight from: https://slack.engineering/a-faster-smarter-quick-switcher/
const getRecencyScoreForVisit = (now: Date, visit: string): number => {
  const visitDate = new Date(visit);
  const hoursSinceLastVisit =
    (now.getTime() - visitDate.getTime()) / 1000 / 60 / 60;
  if (hoursSinceLastVisit < 4) return 100;
  if (hoursSinceLastVisit < 24) return 80;
  if (hoursSinceLastVisit < 3 * 24) return 60;
  if (hoursSinceLastVisit < 7 * 24) return 40;
  if (hoursSinceLastVisit < 30 * 24) return 20;
  if (hoursSinceLastVisit < 90 * 24) return 10;
  return 0;
};

const getScoreForStoredMatch = (storedMatch?: StoredSearchMatch): number => {
  if (!storedMatch) return 0;
  const now = new Date();
  const visitScore = storedMatch.visits.reduce(
    (acc, visitDate) => getRecencyScoreForVisit(now, visitDate) + acc,
    0,
  );
  return (storedMatch.count * visitScore) / storedMatch.visits.length;
};

const sortByFrecency = (
  needle: string,
  matchA: SearchMatch,
  matchB: SearchMatch,
  localStorageKey: string,
): number => {
  const storedQueryMap: StoredMap = new Map(
    JSON.parse(localStorage.getItem(localStorageKey) || "[]"),
  );
  const storedQuery = storedQueryMap.get(needle);
  const scoreA = getScoreForStoredMatch(
    storedQuery?.selectedMatches.find(
      (storedMatch) => storedMatch.match.id === matchA.id,
    ),
  );
  const scoreB = getScoreForStoredMatch(
    storedQuery?.selectedMatches.find(
      (storedMatch) => storedMatch.match.id === matchB.id,
    ),
  );
  if (scoreA === scoreB) {
    return matchA.label > matchB.label ? 1 : -1;
  }
  return scoreB - scoreA;
};

const isSearchMatch = (needle: string, haystack: string): boolean => {
  if (needle.includes(" ")) {
    const needleParts = needle.split(" ");
    const haystackParts = haystack.split(" ");
    return needleParts.every((needlePart) =>
      haystackParts.some((haystackPart) =>
        haystackPart.toLowerCase().includes(needlePart.toLowerCase()),
      ),
    );
  }
  return haystack.toLowerCase().includes(needle.toLowerCase());
};

export const sortedByFrecency = (
  needle: string,
  haystack: SearchMatch[],
  localStorageKey: string,
) => {
  return haystack
    .filter((straw) => isSearchMatch(needle, straw.label))
    .sort((a, b) => sortByFrecency(needle, a, b, localStorageKey));
};

export const updateFrecencyData = (
  query: string,
  selectedMatch: SearchMatch,
  localStorageKey: string,
) => {
  const storedQueryMap: StoredMap = new Map(
    JSON.parse(localStorage.getItem(localStorageKey) || "[]"),
  );
  const now = new Date();
  const storedQuery = storedQueryMap.get(query);
  if (storedQuery == null) {
    storedQueryMap.set(query, {
      selectedMatches: [
        { count: 1, match: selectedMatch, visits: [now.toString()] },
      ],
    });
  } else {
    const existingSelectedMatch = storedQuery.selectedMatches.find(
      (storedMatch) => storedMatch.match.id === selectedMatch.id,
    );
    if (existingSelectedMatch) {
      const newMatch = {
        ...existingSelectedMatch,
        count: existingSelectedMatch.count + 1,
        visits: [...existingSelectedMatch.visits, now.toString()],
      };
      storedQueryMap.set(query, {
        selectedMatches: [
          ...storedQuery.selectedMatches.filter(
            (storedMatch) => storedMatch.match.id !== selectedMatch.id,
          ),
          newMatch,
        ],
      });
    } else {
      storedQueryMap.set(query, {
        selectedMatches: [
          ...storedQuery.selectedMatches,
          { count: 1, match: selectedMatch, visits: [now.toString()] },
        ],
      });
    }
  }
  localStorage.setItem(
    localStorageKey,
    JSON.stringify(Array.from(storedQueryMap.entries())),
  );
};
