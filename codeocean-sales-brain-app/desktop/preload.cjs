const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('salesBrain',{
getState:()=>ipcRenderer.invoke('state:get'),
saveBusiness:b=>ipcRenderer.invoke('business:save',b),
resetBusiness:()=>ipcRenderer.invoke('business:reset'),
completeOnboarding:()=>ipcRenderer.invoke('onboarding:done'),
hunt:o=>ipcRenderer.invoke('hunt',o),
brain:t=>ipcRenderer.invoke('brain',t),
updateLead:(id,p)=>ipcRenderer.invoke('lead:update',id,p),
toggleTask:id=>ipcRenderer.invoke('task:toggle',id),
ollamaStatus:()=>ipcRenderer.invoke('ollama:status'),
ollamaInstall:()=>ipcRenderer.invoke('ollama:install'),
ollamaPull:m=>ipcRenderer.invoke('ollama:pull',m),
ollamaSelect:m=>ipcRenderer.invoke('ollama:select',m),
openExternal:u=>ipcRenderer.invoke('external',u),
onProgress:cb=>ipcRenderer.on('progress',(_,p)=>cb(p))
});