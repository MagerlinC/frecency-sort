export type StoredQueryMatch = {
  matchId: string;
  visits: string[];
};

// Given a query string, what matches have the user selected before?
export type StoredQuery = {
  selectedMatches: StoredQueryMatch[];
};

export type StoredQueryMap = Map<string, StoredQuery>;
