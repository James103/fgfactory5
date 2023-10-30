//---
var TplPaneLeft = function(data) {
    //---
    let html = ''
    //---
    html += '<div class="scrollbar py-2" style="height:calc(100% - 0);">'
        //---
        let scenario = window.app.game.currentScenario
        scenario.categories.forEach(category => {
            let elems = window.app.game.currentElems.filter(elem => elem.unlocked && elem.completed == false && elem.cat == category)
            if (elems.length > 0) {
                //---
                html += '<div class="p-2">'
                    html += '<div class="row g-1">'
                        html += '<div class="col-12 small">' + i18next.t(scenario.label + category) + '</div>'
                        elems.forEach(elem => {
                            html += '<div class="col-12">'
                                html += '<button id="' + elem.id + '-elem-link" type="button" class="position-relative w-100 text-start btn' + (elem.id == data.selectedElemId ? ' btn-primary' : ' btn-light') + '" onclick="window.app.doClick(\'selectElem\', { elemId:\'' + elem.id + '\' })">'
                                    if (elem.notified) {
                                        html += '<div class="position-absolute lh-1 small" style="top: -.125rem; left: -.125rem;">'
                                            html += '<i class="fas fa-dot-circle text-success"></i>'
                                        html += '</div>'
                                    }
                                    html += '<div class="row gx-2 align-items-center">'
                                        html += '<div class="col-auto">' + displayIcon(elem.icon, elem.iconText, 24) + '</div>'
                                        html += '<div class="col text-truncate">' + i18next.t(scenario.label + elem.label) + '</div>'
                                        if (elem.type == 'product') html += '<div id="elem-' + elem.id + '-canBuild" class="col-auto"></div>'
                                        if (elem.cat == 'machine') html += '<div id="elem-' + elem.id + '-availableCount" class="col-auto"></div>'
                                        html += '<div id="elem-' + elem.id + '-count" class="col-auto"></div>'
                                    html += '</div>'
                                html += '</button>'
                            html += '</div>'
                        })
                    html += '</div>'
                html += '</div>'
            }
        })
    //---
    html += '</div>'
    //---
    return html
}
//---
class PaneLeft {
    //---
    constructor() {        
        //---
        this.reset()
    }
    //---
    reset() {
        //---
        this.selectedElemId = null
    }
    //---
    load(data) {
        //---
        if (data.selectedElemId != null) this.selectedElemId = data.selectedElemId
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        if (this.selectedElemId) savedData.selectedElemId = this.selectedElemId
        //---
        return savedData
    }
    //---
    display() {
        //---
        if (this.selectedElemId == null) this.selectedElemId = window.app.game.currentScenario.initElemId
        //---
        let elem = window.app.game.getElem(this.selectedElemId)
        if (elem.notified) elem.notified = false
        //---
        let node = document.getElementById('left-pane')
        node.innerHTML = TplPaneLeft(this)
    }
    //---
    refresh(deltaMs) {
        //---
        let node, value, html, style        
        //---
        let scenario = window.app.game.currentScenario
        scenario.categories.forEach(category => {
            let elems = window.app.game.currentElems.filter(elem => elem.unlocked && elem.completed == false && elem.cat == category)
            if (elems) {
                elems.forEach(elem => {
                    
                    // Elem count
                    //---
                    node = document.getElementById('elem-' + elem.id + '-count')
                    //---
                    value = Math.floor(elem.count)
                    //---
                    html = ''
                    if (elem.completed) html = '<i class="fas fa-check-circle text-success" aria-hidden="true"></i>'
                    else if (value >= elem.storage) html = '<span class="badge text-bg-danger">' + formatNumber(value, 0) + '</span>'
                    else if (value > 0) html = '<span class="badge text-bg-light">' + formatNumber(value, 0) + '</span>'
                    if (node.innerHTML != html) node.innerHTML = html
                    
                    //---
                    if (elem.type == 'product') {
                        
                        // Elem can build
                        //---
                        node = document.getElementById('elem-' + elem.id + '-canBuild')
                        //---
                        html = ''
                        if (window.app.game.canProductBuild(elem)) html = '<i class="fas fa-check text-success"></i>' 
                        if (node.innerHTML != html) node.innerHTML = html
                    }
                    
                    //---
                    if (elem.cat == 'machine') {
                        
                        // Elem available count
                        //---
                        node = document.getElementById('elem-' + elem.id + '-availableCount')
                        //---
                        value = window.app.game.getMachineAvailableCount(elem.id)
                        //---
                        html = ''
                        if (value > 0) html = '<span class="badge text-bg-success">' + formatNumber(value, 0) + '</span>'
                        if (node.innerHTML != html) node.innerHTML = html
                    }
                })
            }
        })
    }
    //---
    doClick(action, data) {
        //---
        if (action == 'selectElem') {
            //---
            let node
            //---
            node = document.getElementById(this.selectedElemId + '-elem-link')
            if (node) {
                //---
                node.classList.remove('btn-primary')
                node.classList.add('btn-light')
            }
            //---
            this.selectedElemId = data.elemId
            //---
            node = document.getElementById(this.selectedElemId + '-elem-link')
            if (node) {
                //---
                node.classList.remove('btn-light')
                node.classList.add('btn-primary')
            }
            //---
            node = document.getElementById('left-pane')
            if (node.classList.contains('open')) window.app.doClick('toggleLeft')
            //---
            let elem = window.app.game.getElem(this.selectedElemId)
            if (elem.notified) {
                //---
                elem.notified = false
                this.display()
            }
        }
    }
}
