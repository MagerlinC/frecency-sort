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

  const updatedSorted = sortByFrecency(query, items, key);
  expect(updatedSorted[0].matchId).toBe(multipleUsageMatchingId);
});
