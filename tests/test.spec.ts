import { sortByFrecency, updateFrecencyData } from "../src/frecency-sort";

const setUpLocalStorageMock = () => {
  const localStorageMock = (function () {
    let store: any = {};

    return {
      getItem(key: string) {
        return store[key];
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      clear() {
        store = {};
      },
      removeItem(key: string) {
        delete store[key];
      },
      getAll() {
        return store;
      },
    };
  })();

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
};

beforeEach(() => {
  setUpLocalStorageMock();
});

test("sortedByFrecency updates sorting based on usage", () => {
  // Arrange
  const key = "testing-key";
  const query = "on";
  const matchingId = "1";

  const items = [
    { matchId: "0", label: "zero" },
    { matchId: matchingId, label: "one" },
    { matchId: "2", label: "two" },
    { matchId: "3", label: "three" },
  ];

  const sorted = sortByFrecency(query, items, key);
  expect(sorted).toEqual(items);

  // Act
  updateFrecencyData(query, matchingId, key);

  // Assert
  const updatedSorted = sortByFrecency(query, items, key);
  expect(updatedSorted[0].matchId).toBe(matchingId);
});

test("sortedByFrecency prefers multiple usages", () => {
  // Arrange
  const key = "testing-key";
  const query = "on";
  const matchingId = "1";
  const multipleUsageMatchingId = "2";

  const items = [
    { matchId: "0", label: "zero" },
    { matchId: matchingId, label: "one" },
    { matchId: multipleUsageMatchingId, label: "two" },
    { matchId: "3", label: "three" },
  ];

  // Act
  updateFrecencyData(query, matchingId, key);

  updateFrecencyData(query, multipleUsageMatchingId, key);
  updateFrecencyData(query, multipleUsageMatchingId, key);

  // Assert
  const updatedSorted = sortByFrecency(query, items, key);
  expect(updatedSorted[0].matchId).toBe(multipleUsageMatchingId);
});

test("sortedByFrecency prefers recent usages", () => {
  // Arrange
  const key = "testing-key";
  const query = "on";
  const matchingId = "1";
  const moreRecentUsageMatchingId = "2";
  const items = [
    { matchId: "0", label: "zero" },
    { matchId: matchingId, label: "one" },
    { matchId: moreRecentUsageMatchingId, label: "two" },
    { matchId: "3", label: "three" },
  ];

  const localStorageHistory = [
    [
      query,
      {
        selectedMatches: [
          {
            matchId: matchingId,
            visits: [
              "Mon Jan 01 2025 19:11:37 GMT+0100 (Central European Standard Time)",
              "Mon Jan 02 2025 19:11:37 GMT+0100 (Central European Standard Time)",
              "Mon Jan 03 2025 19:11:37 GMT+0100 (Central European Standard Time)",
            ],
          },

          {
            matchId: moreRecentUsageMatchingId,
            visits: [
              "Mon Feb 17 2025 19:11:37 GMT+0100 (Central European Standard Time)",
            ],
          },
        ],
      },
    ],
  ];
  localStorage.setItem(key, JSON.stringify(localStorageHistory));

  // Act
  const sorted = sortByFrecency(query, items, key);
  expect(sorted[0].matchId).toBe(moreRecentUsageMatchingId);
});
