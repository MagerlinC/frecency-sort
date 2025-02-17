import { StoredQueryMatch, StoredQueryMap } from "./types";

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

const getScoreForStoredMatch = (storedMatch?: StoredQueryMatch): number => {
  if (!storedMatch) return 0;
  const now = new Date();
  const visitScore = storedMatch.visits.reduce(
    (acc, visitDate) => getRecencyScoreForVisit(now, visitDate) + acc,
    0,
  );
  return (storedMatch.visits.length * visitScore) / storedMatch.visits.length;
};

const compareByFrecency = (
  needle: string,
  matchAId: string,
  matchBId: string,
  localStorageKey: string,
): number => {
  const storedQueryMap: StoredQueryMap = new Map(
    JSON.parse(localStorage.getItem(localStorageKey) || "[]"),
  );
  const storedQuery = storedQueryMap.get(needle);
  const scoreA = getScoreForStoredMatch(
    storedQuery?.selectedMatches.find(
      (storedMatch) => storedMatch.matchId === matchAId,
    ),
  );
  const scoreB = getScoreForStoredMatch(
    storedQuery?.selectedMatches.find(
      (storedMatch) => storedMatch.matchId === matchBId,
    ),
  );
  return scoreB - scoreA;
};

// Exports

export function sortByFrecency<T extends { matchId: string }>(
  query: string,
  listItems: T[],
  key: string,
) {
  return listItems.sort((itemA, itemB) =>
    compareByFrecency(query, itemA.matchId, itemB.matchId, key),
  );
}

export const updateFrecencyData = (
  query: string,
  selectedMatchId: string,
  localStorageKey: string,
) => {
  const storedQueryMap: StoredQueryMap = new Map(
    JSON.parse(localStorage.getItem(localStorageKey) || "[]"),
  );
  const now = new Date();
  const storedQuery = storedQueryMap.get(query);
  if (storedQuery == null) {
    storedQueryMap.set(query, {
      selectedMatches: [{ matchId: selectedMatchId, visits: [now.toString()] }],
    });
  } else {
    const existingSelectedMatch = storedQuery.selectedMatches.find(
      (storedMatch) => storedMatch.matchId === selectedMatchId,
    );
    if (existingSelectedMatch) {
      const newMatch = {
        ...existingSelectedMatch,
        visits: [...existingSelectedMatch.visits, now.toString()],
      };
      storedQueryMap.set(query, {
        selectedMatches: [
          ...storedQuery.selectedMatches.filter(
            (storedMatch) => storedMatch.matchId !== selectedMatchId,
          ),
          newMatch,
        ],
      });
    } else {
      storedQueryMap.set(query, {
        selectedMatches: [
          ...storedQuery.selectedMatches,
          { matchId: selectedMatchId, visits: [now.toString()] },
        ],
      });
    }
  }
  localStorage.setItem(
    localStorageKey,
    JSON.stringify(Array.from(storedQueryMap.entries())),
  );
};
