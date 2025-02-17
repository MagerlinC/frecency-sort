export type StoredQueryMatch = {
    matchId: string;
    visits: string[];
};
export type StoredQuery = {
    selectedMatches: StoredQueryMatch[];
};
export type StoredQueryMap = Map<string, StoredQuery>;
