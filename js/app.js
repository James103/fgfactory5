//---
window.onload = function() {
    //---
    window.app = new App()
    window.app.start()
}
//---
class App {
    //---
    constructor() {
        //---
        this.fps = 60
        this.rafHandle = null
        this.saveInterval = null
        this.resetInProgress = false
        this.lastFrameTimeMs = new Date().getTime()
        this.localStorageName = 'fgfactory5'
        //---
        this.screens = {
            //---
            game: new ScreenGame(),
            error: new ScreenError(),
            loading: new ScreenLoading(),
        }
        //---
        this.selectedScreen = null
        //---
        this.game = new Game()
    }    
    //---
    start() {
        //---
        i18next.use(i18nextBrowserLanguageDetector).init({
            //---
            debug: true,
            fallbackLng: 'en-US',
            resources: {
                //---
                'en-US': { translation:en_translations },
            }
        })
        //---
        document.title = i18next.t('game_title')
        //---
        this.selectScreen('loading')
        //---
        try {
            //---
            let loadedData = localStorage.getItem(this.localStorageName)
            if (loadedData && loadedData !== null && loadedData.length % 4 == 0) {
                //---
                let text = LZString.decompressFromBase64(loadedData)
                if (!text) return console.error('Load failed')
                loadedData = JSON.parse(text)
                //---
                if (loadedData.lastFrameTimeMs != null) this.lastFrameTimeMs = loadedData.lastFrameTimeMs
                //---
                if (loadedData.screens) {
                    for (let screenId in this.screens) {
                        if (loadedData.screens[screenId] && this.screens[screenId].load) this.screens[screenId].load(loadedData.screens[screenId])
                    }
                }
                //---
                if (loadedData.game) this.game.load(loadedData.game)
            }
            else this.game.start('fto1')
            //---            
            window.onbeforeunload = () => {
                //---
                if (!this.resetInProgress) this.save()
                //---
                if (this.rafHandle) cancelAnimationFrame(this.rafHandle)
                if (this.saveInterval) clearInterval(this.saveInterval)
            }
            //---
            this.saveInterval = setInterval(() => { window.app.save() }, 30000)
            //---
            setTimeout(() => {
                //---
                this.selectScreen('game')
                this.mainloop()
            }, 1000)
        }
        catch (error) {
            //---
            this.selectScreen('error')
            console.error(error)
        }
    }
    //---
    mainloop() {
        //---
        window.app.update()
        window.app.rafHandle = requestAnimationFrame(window.app.mainloop)
    }
    //---
    update() {
        //---
        let currentTimeMs = Date.now()
        let deltaMs = currentTimeMs - this.lastFrameTimeMs
        //---
        let stepMs = 1000 / this.fps
        if (deltaMs >= stepMs) {
            //---
            this.lastFrameTimeMs = currentTimeMs
            //---
            this.game.doTick(deltaMs)
            //---
            if (this.game.isVictoryReached()) {
                //---
                this.game.doVictory()
                this.showModal('modalVictory')
            }
            //---
            this.selectedScreen.refresh(deltaMs)
        }
    }
    //---
    save() {
        //---
        let savedData = {
            //---
            lastFrameTimeMs: this.lastFrameTimeMs,
            //---
            screens: {},
            //---
            game: this.game.getSaveData(),
        }
        //---
        for (let screenId in this.screens) {
            if (this.screens[screenId].getSaveData) savedData.screens[screenId] = this.screens[screenId].getSaveData()
        }
        //---
        let text = JSON.stringify(savedData)
        let compressed = LZString.compressToBase64(text)
        localStorage.setItem(this.localStorageName, compressed)
    }
    //---
    selectScreen(screenId) {
        //---
        this.selectedScreen = this.screens[screenId]
        this.selectedScreen.display()
    }
    //---
    getLocalData() {
        //---
        return localStorage.getItem(this.localStorageName)
    }
    //---
    exportSave() {
        //---
        navigator.clipboard.writeText(this.getLocalData())
        this.showToast('toastExport')
    }
    //---
    downloadSave() {
        //---
        let elem = document.createElement('a')
        elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.getLocalData()))
        elem.setAttribute('download', this.localStorageName + '_save_' + (new Date).getTime() + '.txt')
        elem.style.display = 'none'
        document.body.appendChild(elem)
        //---
        elem.click()
        //---
        document.body.removeChild(elem)
    }
    //---
    wipeSave() {
        //---
        this.resetInProgress = true
        //---
        localStorage.removeItem(this.localStorageName)
        window.location.replace('')
    }
    //---
    importSave() {
        //---
        let elem = document.getElementById('importData')
        let importData = elem.value.trim()
        //---
        if (!importData) return this.showToast('toastImportEmpty')
        if (importData.length % 4 !== 0) return this.showToast('toastImportCorrupted')
        //---
        this.resetInProgress = true
        //---
        localStorage.setItem(this.localStorageName, importData)
        window.location.replace('')
    }
    //---
    showToast(toastElementId) {
        //---
        let elem = document.getElementById(toastElementId)
        let toast = new bootstrap.Toast(elem)
        toast.show()
    }
    //---
    showModal(modalElementId) {
        //---
        let elem = document.getElementById(modalElementId)
        let modal = new bootstrap.Modal(elem)
        modal.show()
    }
    //---
    doClick(action, data) { this.selectedScreen.doClick(action, data) }
}
