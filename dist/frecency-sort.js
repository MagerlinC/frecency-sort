"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFrecencyData = exports.compareByFrecency = void 0;
exports.sortByFrecency = sortByFrecency;
// Math stolen straight from: https://slack.engineering/a-faster-smarter-quick-switcher/
var getRecencyScoreForVisit = function (now, visit) {
    var visitDate = new Date(visit);
    var hoursSinceLastVisit = (now.getTime() - visitDate.getTime()) / 1000 / 60 / 60;
    if (hoursSinceLastVisit < 4)
        return 100;
    if (hoursSinceLastVisit < 24)
        return 80;
    if (hoursSinceLastVisit < 3 * 24)
        return 60;
    if (hoursSinceLastVisit < 7 * 24)
        return 40;
    if (hoursSinceLastVisit < 30 * 24)
        return 20;
    if (hoursSinceLastVisit < 90 * 24)
        return 10;
    return 0;
};
var getScoreForStoredMatch = function (storedMatch) {
    if (!storedMatch)
        return 0;
    var now = new Date();
    var visitScore = storedMatch.visits.reduce(function (acc, visitDate) { return getRecencyScoreForVisit(now, visitDate) + acc; }, 0);
    return (storedMatch.visits.length * visitScore) / storedMatch.visits.length;
};
var compareByFrecency = function (needle, matchAId, matchBId, localStorageKey) {
    var storedQueryMap = new Map(JSON.parse(localStorage.getItem(localStorageKey) || "[]"));
    var storedQuery = storedQueryMap.get(needle);
    var scoreA = getScoreForStoredMatch(storedQuery === null || storedQuery === void 0 ? void 0 : storedQuery.selectedMatches.find(function (storedMatch) { return storedMatch.matchId === matchAId; }));
    var scoreB = getScoreForStoredMatch(storedQuery === null || storedQuery === void 0 ? void 0 : storedQuery.selectedMatches.find(function (storedMatch) { return storedMatch.matchId === matchBId; }));
    return scoreB - scoreA;
};
exports.compareByFrecency = compareByFrecency;
function sortByFrecency(query, listItems, key) {
    return listItems.sort(function (itemA, itemB) {
        return (0, exports.compareByFrecency)(query, itemA.matchId, itemB.matchId, key);
    });
}
var updateFrecencyData = function (query, selectedMatchId, localStorageKey) {
    var storedQueryMap = new Map(JSON.parse(localStorage.getItem(localStorageKey) || "[]"));
    var now = new Date();
    var storedQuery = storedQueryMap.get(query);
    if (storedQuery == null) {
        storedQueryMap.set(query, {
            selectedMatches: [{ matchId: selectedMatchId, visits: [now.toString()] }],
        });
    }
    else {
        var existingSelectedMatch = storedQuery.selectedMatches.find(function (storedMatch) { return storedMatch.matchId === selectedMatchId; });
        if (existingSelectedMatch) {
            var newMatch = __assign(__assign({}, existingSelectedMatch), { visits: __spreadArray(__spreadArray([], existingSelectedMatch.visits, true), [now.toString()], false) });
            storedQueryMap.set(query, {
                selectedMatches: __spreadArray(__spreadArray([], storedQuery.selectedMatches.filter(function (storedMatch) { return storedMatch.matchId !== selectedMatchId; }), true), [
                    newMatch,
                ], false),
            });
        }
        else {
            storedQueryMap.set(query, {
                selectedMatches: __spreadArray(__spreadArray([], storedQuery.selectedMatches, true), [
                    { matchId: selectedMatchId, visits: [now.toString()] },
                ], false),
            });
        }
    }
    localStorage.setItem(localStorageKey, JSON.stringify(Array.from(storedQueryMap.entries())));
};
exports.updateFrecencyData = updateFrecencyData;
