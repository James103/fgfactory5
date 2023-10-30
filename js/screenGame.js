//---
var TplScreenGame = function(screen) {
    //---
    let scenario = window.app.game.currentScenario
    //---
    let html = ''
    //---
    html += '<div class="position-relative w-100 h-100">'
        
        // Top bar
        //---
        html += '<div class="position-absolute border-bottom border-dark" style="top:0; width:100%; height:45px;">'
            html += '<div class="h-100 p-2 bg-light d-flex align-items-center">'
                html += '<div class="flex-fill row gx-2 align-items-center">'
                    html += '<div class="col">'
                        html += '<div class="row gx-2 align-items-center">'
                            html += '<div class="col-auto">'
                                html += '<img src="logo.png" width="24px" height="24px" class="rounded">'
                            html += '</div>'
                            html += '<div class="col text-truncate">'
                                html += '<span class="fs-6 text-white">' + i18next.t('game_title') + '</span>'
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                    html += '<div class="col-auto">'
                        html += '<div class="dropdown">'
                            html += '<button type="button" class="btn btn-outline-danger" data-bs-toggle="dropdown" aria-expanded="false">'
                                html += '<i class="fas fa-exclamation-triangle"></i>'
                                html += '<span class="d-none d-lg-inline ms-1">v 0.03</span>'
                            html += '</button>'
                            html += '<div class="dropdown-menu">'
                                html += '<div class="px-2 py-1 text-center small">'
                                    html += '<span class="text-danger">' + i18next.t('screenGame_disclaimer') + '</span>'
                                html += '</div>'
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                    for (let id in screen.tabs) {
                        let tab = screen.tabs[id]
                        html += '<div class="col-auto">'
                            html += '<button id="' + tab.id + '-tab-link" type="button" class="btn btn-outline-primary" onclick="window.app.doClick(\'selectTab\', { tabId:\'' + tab.id + '\' })">'
                                html += '<i class="' + tab.img + '"></i>'
                                html += '<span class="d-none d-lg-inline ms-1">' + i18next.t(scenario.label + tab.label) + '</span>'
                            html += '</button>'
                        html += '</div>'
                    }
                html += '</div>'
            html += '</div>'
        html += '</div>'
        
        // Tab panes
        //---
        html += '<div id="tab-content" class="position-absolute tab-content" style="top:45px; bottom:0px; width:100%;">'          
        html += '</div>'
        
    //---
    html += '</div>'
    
    //---
    return html
}
//---
class ScreenGame {
    //---
    constructor() {        
        //---
        this.tabs = {
            //---
            game: new TabGame(),
            options: new TabOptions(),
            scenarios: new TabScenarios(),
        }
        //---
        this.reset()
    }
    //---
    reset() {
        //---
        this.selectedTab = null
        //---
        for (let id in this.tabs) this.tabs[id].reset()
    }
    //---
    load(data) {
        //---
        if (data.selectedTabId != null) this.selectedTab = this.tabs[data.selectedTabId]
        //---
        if (data.tabs) {
            for (let id in this.tabs) {
                if (data.tabs[id]) this.tabs[id].load(data.tabs[id])
            }
        }
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        if (this.selectedTab) savedData.selectedTabId = this.selectedTab.id
        //---
        savedData.tabs = {}
        for (let id in this.tabs) {
            savedData.tabs[id] = this.tabs[id].getSaveData()
        }
        //---
        return savedData
    }
    //---
    display() {
        //---
        let node = document.getElementById('screen')
        node.innerHTML = TplScreenGame(this)
        //---
        if (this.selectedTab == null) this.selectedTab = this.tabs['game']
        this.doClick('selectTab', { tabId:this.selectedTab.id })
    }
    //---
    refresh(deltaMs) {
        //---
        this.selectedTab.refresh(deltaMs)
    }
    //---
    doClick(action, data) {
        //---
        if (action == 'selectTab') {
            //---
            let node
            //---
            node = document.getElementById(this.selectedTab.id + '-tab-link')
            if (node) node.classList.remove('active')
            //---
            this.selectedTab = this.tabs[data.tabId]
            //---
            node = document.getElementById(this.selectedTab.id + '-tab-link')
            if (node) node.classList.add('active')
            //---
            this.selectedTab.display()
        }
        //---
        this.selectedTab.doClick(action, data)
    }
}
