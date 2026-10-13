(() => {
  const CHANNEL = 'postmaxxers-fast-scan-v2';
  const scan = document.getElementById('scan');
  const status = document.getElementById('status');
  let connected = false;
  let detectedBridge = false;
  const pending = new Map();
  function request(type, timeoutMs = 2000) {
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error('No response from extension bridge')); }, timeoutMs);
      pending.set(id, value => { clearTimeout(timer); resolve(value); });
      window.postMessage({channel: CHANNEL, from:'page', type, id}, location.origin);
    });
  }
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin) return;
    const m = event.data;
    if (!m || m.channel !== CHANNEL || m.from !== 'extension') return;
    detectedBridge = true;
    if (m.type === 'BRIDGE_READY' && !connected) status.textContent = 'Extension bridge loaded. Checking authorization…';
    if (m.type === 'RESPONSE' && pending.has(m.id)) {
      const complete = pending.get(m.id); pending.delete(m.id); complete(m);
    }
  });
  async function connect() {
    for(let i=0; i<10 && !connected; i++) {
      try {
        const r = await request('PING', 1800);
        if (!r.ok) {
          status.textContent = 'Extension detected but connection refused: ' + (r.error || 'Unknown error');
          return;
        }
        connected = true;
        status.textContent = 'Extension detected. Ready to scan.';
        return;
      } catch(e) {
        if (i<9) await new Promise(resolve => setTimeout(resolve, 450));
      }
    }
    status.textContent = detectedBridge
      ? 'Extension bridge loaded but not responding. Reload it in chrome://extensions, then refresh this page.'
      : 'Chrome did not load the extension bridge on this site. Verify the NEW Fast Scan extension is enabled and has site access to aeizu29.github.io, then reload Chrome and this page.';
  }
  scan.addEventListener('click', async () => {
    scan.disabled = true;
    status.textContent = 'Scanning in the background…';
    try {
      const r = await request('SCAN', 120000);
      if (!r.ok) throw new Error(r.error || r.reason || 'Scan failed');
      status.textContent = `Scan complete: ${r.count || 0} users. Check the extension GitHub sync status for publishing details.`;
    } catch(e) {
      status.textContent = 'Scan failed: ' + e.message;
    } finally {
      scan.disabled = false;
    }
  });
  connect();
})();