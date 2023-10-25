//---
var TplTabGame = function(data) {
    //---
    let html = ''
    //---
    html += '<div class="position-relative px-0 h-100" role="tabpanel" tabindex="0">'
        html += '<div id="left-pane" class="bg-dark' + (data.leftOpen ? ' open' : '') + '"></div>'
        html += '<div id="right-pane"></div>'
        html += '<div class="nav nav-tabs align-items-center border-top bg-dark" style="height: 46px; position: absolute; bottom: 0; width: 100%;">'
            html += '<div class="col-auto d-sm-none px-2">'
                html += '<button type="button" class="btn btn-outline-primary lh-1" onclick="window.app.doClick(\'toggleLeft\')">'
                    html += '<i class="fas fs-6 fa-bars"></i>'
                html += '</button>'
            html += '</div>'
        html += '</div>'
    html += '</div>'    
    //---
    html += TplModalOffline()
    html += TplModalVictory()
    //---
    return html
}
//---
class TabGame {
    //---
    constructor() {        
        //---
        this.id = 'game'
        this.img = 'fas fa-industry'
        this.label = 'tab_game'
        //---
        this.leftPane = new LeftPane()
        this.rightPane = new RightPane()
        //---
        this.reset()
    }
    //---
    reset() {
        //---
        this.leftOpen = false
        //---
        this.leftPane.reset()
        this.rightPane.reset()
    }
    //---
    load(data) {
        //---
        if (data.leftPane != null) this.leftPane.load(data.leftPane)
        if (data.rightPane != null) this.rightPane.load(data.rightPane)
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        savedData.leftPane = this.leftPane.getSaveData()
        savedData.rightPane = this.rightPane.getSaveData()
        //---
        return savedData
    }
    //---
    display() {
        //---
        let node = document.getElementById('tab-content')
        node.innerHTML = TplTabGame(this)
        //---
        this.leftPane.display()
        this.rightPane.display()
    }
    //---
    refresh(deltaMs) {
        //---
        let node
        //---
        if (deltaMs > 15 * 60 * 1000) {
            //---
            node = document.getElementById('offlineTime')
            node.innerHTML = formatTime(deltaMs / 1000)
            //---
            window.app.showModal('modalOffline')
        }
        
        //---
        this.leftPane.refresh(deltaMs)
        this.rightPane.refresh(deltaMs)
    }
    //---
    doClick(action, data) {
        //---
        if (action == 'toggleLeft') {
            //---
            let node = document.getElementById('left-pane')
            if (node.classList.contains('open')) {
                //---
                node.classList.remove('open')
                this.leftOpen = false
            }
            else {
                //---
                node.classList.add('open')
                this.leftOpen = true
            }
        }
        //---
        else if (action == 'refreshTabGame') {
            //---
            this.leftPane.display()
            this.rightPane.display()
        }
        //---
        this.leftPane.doClick(action, data)
        this.rightPane.doClick(action, data)
    }
}
