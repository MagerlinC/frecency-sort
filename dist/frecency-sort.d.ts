export declare const compareByFrecency: (needle: string, matchAId: string, matchBId: string, localStorageKey: string) => number;
export declare function sortByFrecency<T extends {
    matchId: string;
}>(query: string, listItems: T[], key: string): T[];
export declare const updateFrecencyData: (query: string, selectedMatchId: string, localStorageKey: string) => void;
