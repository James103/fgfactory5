//---
var TplTabScenarios = function() {
    //---
    let html = ''
    //---
    html += '<div class="scrollbar" role="tabpanel" tabindex="0">'
        html += '<div class="my-lg-3 mx-auto px-2 py-3 bg-dark" style="max-width: 960px;">'
            html += '<div class="row gx-2 gy-3">'
                html += '<div class="col-12">'
                    html += '<div class="row g-2">'
                        html += '<div class="col-12">'
                            html += '<span class="fs-6 text-white">' + i18next.t('tabScenarios_scenarios') + '</span>'
                        html += '</div>'
                        //---
                        let scenarios = window.app.game.scenarios
                        scenarios.forEach(scenario => {
                            html += '<div class="col-12 col-lg-6 col-xl-4">'
                                html += '<button type="button" class="w-100 btn btn-light text-start' + (scenario.id == window.app.game.currentScenario.id ? ' border-warning' : '') + '" onclick="window.app.doClick(\'selectScenario\', { scenarioId:\'' + scenario.id + '\' })">'
                                    html += '<div class="row g-1 justify-content-center">'
                                        html += '<div class="col-12">'
                                            html += '<div class="row gx-2 align-items-center">'
                                                html += '<div class="col">'
                                                    html += '<span class="fs-6 text-white">' + i18next.t(scenario.label + 'name') + '</span>'
                                                html += '</div>'
                                                html += '<div id="' + scenario.id + '-victory" class="col-auto">'
                                                html += '</div>'
                                            html += '</div>'
                                        html += '</div>'
                                        html += '<div class="col-12 small">'
                                            html += '<span class="text-normal">' + i18next.t(scenario.label + 'desc') + '</span>'
                                        html += '</div>'
                                    html += '</div>'
                                html += '</button>'
                            html += '</div>'
                        })
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    // Modals
    //---
    html += TplModalScenario()

    //---
    return html
}
//---
class TabScenarios {
    //---
    constructor() {        
        //---
        this.id = 'scenarios'
        this.img = 'fas fa-th'
        this.label = 'tab_scenarios'
        //---
        this.reset()
    }
    //---
    reset() {
        //---
        this.newScenarioId = null
    }
    //---
    load(data) {
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        return savedData
    }
    //---
    display() {
        //---
        let node = document.getElementById('tab-content')
        node.innerHTML = TplTabScenarios()
    }
    //---
    refresh(deltaMs) {
        //---
        let node, html
        //---
        let scenarios = window.app.game.scenarios
        scenarios.forEach(scenario => {
            
            // Victory
            //---
            node = document.getElementById(scenario.id + '-victory')
            //---
            html = ''
            if (scenario.victoryDate) html += '<img src="img/victory.png" width="16px" height="16px" />'
            if (html != node.innerHTML) node.innerHTML = html
        })
    }
    //---
    doClick(action, data) {
        //---
        if (action == 'selectScenario') {
            //---
            this.newScenarioId = data.scenarioId
            window.app.showModal('modalScenario')
        }
        //---
        else if (action == 'changeScenario') {
            //---
            window.app.game.loadScenario(this.newScenarioId)
            window.app.game.currentScenario.startDate = Date.now()
            //---
            window.app.screens['game'].reset()
            //---
            window.app.save()
            //---
            window.location.replace('')
        }
    }
}
