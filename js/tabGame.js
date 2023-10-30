//---
var TplTabGame = function(data) {
    //---
    let html = ''
    //---
    html += '<div class="position-relative px-0 h-100" role="tabpanel" tabindex="0">'
        html += '<div id="left-pane" class="bg-dark' + (data.leftOpen ? ' open' : '') + '"></div>'
        html += '<div id="right-pane"></div>'
        html += '<div class="nav nav-tabs align-items-center border-top border-dark bg-light" style="height: 46px; position: absolute; bottom: 0; width: 100%;">'
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
        this.paneLeft = new PaneLeft()
        this.paneRight = new PaneRight()
        //---
        this.reset()
    }
    //---
    reset() {
        //---
        this.leftOpen = false
        //---
        this.paneLeft.reset()
        this.paneRight.reset()
    }
    //---
    load(data) {
        //---
        if (data.paneLeft != null) this.paneLeft.load(data.paneLeft)
        if (data.paneRight != null) this.paneRight.load(data.paneRight)
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        savedData.paneLeft = this.paneLeft.getSaveData()
        savedData.paneRight = this.paneRight.getSaveData()
        //---
        return savedData
    }
    //---
    display() {
        //---
        let node = document.getElementById('tab-content')
        node.innerHTML = TplTabGame(this)
        //---
        this.paneLeft.display()
        this.paneRight.display()
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
        this.paneLeft.refresh(deltaMs)
        this.paneRight.refresh(deltaMs)
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
            this.paneLeft.display()
            this.paneRight.display()
        }
        //---
        this.paneLeft.doClick(action, data)
        this.paneRight.doClick(action, data)
    }
}
