(() => {
  const channel = 'postmaxxers-fast-scan-v2';
  const btn = document.getElementById('scan');
  const status = document.getElementById('status');
  let ready = false;
  const pending = new Map();
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin) return;
    const msg = event.data;
    if (!msg || msg.channel !== channel || msg.from !== 'extension') return;
    if (msg.type === 'BRIDGE_READY') { ready=true;status.textContent='Extension detected. Ready to scan.'; return; }
    if (msg.type === 'RESPONSE' && pending.has(msg.id)) {
      const finish=pending.get(msg.id); pending.delete(msg.id); finish(msg);
    }
  });
  function send(type) {
    return new Promise((resolve,reject)=>{
      const id = crypto.randomUUID();
      const timeout=setTimeout(()=>{pending.delete(id);reject(new Error('Extension not responding. Check Fast Scan Setup and reload this page.'));},type === 'PING' ? 3500 : 120000);
      pending.set(id,r=>{clearTimeout(timeout);resolve(r)});
      window.postMessage({channel,from:'page',type,id},location.origin);
    });
  }
  btn.addEventListener('click', async()=>{
    btn.disabled=true;status.textContent='Scanning the leaderboard in the background…';
    try {
      const r=await send('SCAN');
      if(!r.ok)throw new Error(r.error||r.reason||'Scan failed.');
      status.textContent=`Scan complete. ${r.count||0} users. GitHub publishing attempted. Check your extension settings for upload status.`;
    } catch(e) {status.textContent='Error: '+e.message;}
    finally{btn.disabled=false;}
  });
  setTimeout(async()=>{
    if(ready)return;
    try {const r=await send('PING');if(r.ok){ready=true;status.textContent='Extension detected. Ready to scan.';}else status.textContent=r.error||'Extension unavailable.';}
    catch {status.textContent='Extension not detected. Install the companion extension, approve this GitHub Pages domain in Fast Scan Setup, and reload.';}
  },250);
})();
