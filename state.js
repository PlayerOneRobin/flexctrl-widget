/* Shared clock state for the webpage and service worker. 24-hour times, minute accuracy. */
(function (scope) {
  'use strict';
  var CACHE = 'flexctrl-clock-state-v1';
  var KEY = new URL('./flexctrl-state.json', scope.location.href).href;
  function pad(n) { return String(n).padStart(2, '0'); }
  function parseTime(value) {
    var m = /^(\d{1,2}):([0-5]\d)$/.exec(String(value || ''));
    if (!m || +m[1] > 23) return null;
    return (+m[1]) * 60 + (+m[2]);
  }
  function formatTime(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    return pad(Math.floor(mins / 60)) + ':' + pad(mins % 60);
  }
  function finishTime(start) {
    var t = parseTime(start);
    return t === null ? '--:--' : formatTime(t + 520);
  }
  function nowTime() {
    var now = new Date();
    return pad(now.getHours()) + ':' + pad(now.getMinutes());
  }
  async function read() {
    var cache = await caches.open(CACHE);
    var response = await cache.match(KEY);
    if (!response) return { start: '07:30' };
    try {
      var state = await response.json();
      return parseTime(state.start) !== null ? state : { start: '07:30' };
    } catch (_) { return { start: '07:30' }; }
  }
  async function write(start) {
    if (parseTime(start) === null) throw new Error('Felaktig starttid: ' + start);
    var state = { start: start, savedAt: new Date().toISOString() };
    var cache = await caches.open(CACHE);
    await cache.put(KEY, new Response(JSON.stringify(state), { headers: {'Content-Type':'application/json'} }));
    return state;
  }
  scope.FlexClock = { parseTime: parseTime, formatTime: formatTime, finishTime: finishTime, nowTime: nowTime, read: read, write: write };
})(typeof self !== 'undefined' ? self : window);
