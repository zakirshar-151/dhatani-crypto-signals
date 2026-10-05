const { app, BrowserWindow, Menu, Tray, Notification, nativeImage } = require('electron');
const path = require('path');
const CLOUD_API = process.env.DHATANI_CLOUD_API || 'https://dhatani-cloud-bot-live-production.up.railway.app';
const POLL_MS = 15000;
let mainWindow, tray, timer, lastAlertId = null, firstPoll = true;
function showWindow(){ if(mainWindow){ mainWindow.show(); mainWindow.focus(); } }
function createWindow(){
  mainWindow = new BrowserWindow({width:1440,height:950,minWidth:1000,minHeight:700,autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
  mainWindow.loadFile(path.join(__dirname,'..','index.html'));
  mainWindow.on('close',e=>{ if(!app.isQuitting){e.preventDefault();mainWindow.hide();} });
}
function createTray(){
  tray = new Tray(nativeImage.createEmpty());
  tray.setToolTip('Dhatani Crypto Signals — 24/7 Monitor');
  tray.setContextMenu(Menu.buildFromTemplate([
    {label:'Open Dhatani',click:showWindow},
    {label:'Check Cloud Now',click:()=>pollCloud(true)},
    {type:'separator'},
    {label:'Quit Dhatani',click:()=>{app.isQuitting=true;app.quit();}}
  ]));
  tray.on('double-click',showWindow);
}
async function pollCloud(force=false){
  try{
    const r=await fetch(CLOUD_API+'/api/alerts?since='+encodeURIComponent(new Date(Date.now()-60000).toISOString()),{headers:{'Cache-Control':'no-cache'}});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const d=await r.json(), alerts=Array.isArray(d.alerts)?d.alerts:[];
    if(alerts.length){const a=alerts[alerts.length-1]; if(a.id&&a.id!==lastAlertId){if(!firstPoll||force)new Notification({title:'Dhatani · '+(a.type||'Signal Alert'),body:a.message||'New signal update'}).show(); lastAlertId=a.id;}}
    firstPoll=false;
  }catch(e){if(force)new Notification({title:'Dhatani Cloud Engine',body:'Unavailable: '+e.message}).show();}
}
app.whenReady().then(()=>{app.setLoginItemSettings({openAtLogin:true});createWindow();createTray();pollCloud();timer=setInterval(()=>pollCloud(),POLL_MS);app.on('activate',showWindow);});
app.on('window-all-closed',e=>e.preventDefault());
app.on('before-quit',()=>{app.isQuitting=true;if(timer)clearInterval(timer);if(tray)tray.destroy();});
