(() => {
  'use strict';
  const input = document.getElementById('start');
  const finish = document.getElementById('finish');
  const note = document.getElementById('note');
  const status = document.getElementById('pwa-status');
  let saveQueue = Promise.resolve();

  function render() {
    const t = FlexClock.parseTime(input.value);
    finish.textContent = t === null ? '--:--' : FlexClock.finishTime(input.value);
    finish.classList.toggle('placeholder', t === null);
    note.textContent = t === null ? 'Ange en giltig starttid' : t + 520 >= 1440 ? 'Nästa kalenderdag' : 'Då kan du gå hem';
  }
  function saveCurrent() {
    if (FlexClock.parseTime(input.value) === null) return;
    const value = FlexClock.formatTime(FlexClock.parseTime(input.value));
    // Serialized writes avoid stale state when users adjust the time quickly.
    saveQueue = saveQueue.then(() => FlexClock.write(value)).then(() => {
      if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: 'FLEX_TIME_CHANGED' });
    }).catch(console.error);
  }
  function setTime(value) {
    input.value = value;
    render();
    saveCurrent();
  }
  document.getElementById('now').addEventListener('click', () => setTime(FlexClock.nowTime()));
  document.getElementById('minus').addEventListener('click', () => adjust(-5));
  document.getElementById('plus').addEventListener('click', () => adjust(5));
  function adjust(diff) {
    let value = FlexClock.parseTime(input.value);
    if (value === null) value = FlexClock.parseTime(FlexClock.nowTime());
    setTime(FlexClock.formatTime(value + diff));
  }
  input.addEventListener('input', () => { render(); saveCurrent(); });
  input.addEventListener('change', () => {
    const t = FlexClock.parseTime(input.value);
    if (t !== null) input.value = FlexClock.formatTime(t);
    render(); saveCurrent();
  });
  async function refresh() {
    try {
      const state = await FlexClock.read();
      // Avoid overwriting user input while actively typing.
      if (document.activeElement !== input) input.value = state.start;
      render();
    } catch (error) { console.error(error); render(); }
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {scope: './'}).then(() => {
      status.textContent = 'PWA READY';
    }).catch(() => { status.textContent = 'LOCAL MODE'; });
  } else {
    status.textContent = 'LOCAL MODE';
  }
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  refresh();
})();
