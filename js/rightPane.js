//---
var TplRightPane = function(data) {
    //---
    let game = window.app.game
    let scenario = window.app.game.currentScenario
    //---
    let product = game.currentElems.find(elem => elem.unlocked && elem.id == data.selectedElemId)
    //---
    let html = ''
    html += '<div class="scrollbar">'
        html += '<div class="my-lg-3 mx-auto px-2 py-3 bg-dark" style="max-width: 720px;">'
            html += '<div class="row gx-2 gy-3">'
                html += '<div class="col-12">'
                    html += '<div class="border-bottom pb-1">'
                        html += '<div class="row gx-2 align-items-center">'
                            html += '<div class="col-auto">' + displayIcon(product.icon, product.iconText, 24) + '</div>'
                            html += '<div class="col text-truncate" style="line-height:29px;"><span class="fs-6 text-white">' + i18next.t(scenario.label + product.label) + '</span></div>'
                            if (product.completed) {
                                html += '<div id="selectedElem-count" class="col-auto"></div>'
                            }
                            else {
                                if (product.cat == 'machine') html += '<div id="selectedElem-availableCount" class="col-auto"></div>'
                                html += '<div id="selectedElem-count" class="col-auto"></div>'
                                if (product.cat != 'mission') {
                                    if (product.counts && product.counts.length > 1) {
                                        html += '<div class="col-auto">'
                                            html += '<select name="' + product.id + '" class="form-control text-center" onchange="window.app.doClick(\'setProductSelectCount\', { productId:\'' + product.id + '\', count:this.value })">'
                                                product.counts.forEach(count => {
                                                    html += '<option' + (product.selectCount == count ? ' selected' : '') + '  value="' + count + '">' + i18next.t('word_' + count) + '</option>'
                                                })
                                            html += '</select>'
                                        html += '</div>'
                                    }
                                    html += '<div class="col-auto">'
                                        value = game.canProductBuild(product)
                                        html += '<button type="button" id="selectedElem-buildBtn" class="btn btn-outline-primary' + (value == false ? ' disabled' : '') + '" onclick="window.app.doClick(\'productBuild\', { productId:\'' + product.id + '\' })">'
                                            if (product.cat == 'machine' || product.cat == 'product') html += i18next.t('word_build')
                                            else if (product.cat == 'tech') html += i18next.t('word_research')
                                        html += '</button>'
                                    html += '</div>'
                                }
                            }
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
                if (!product.completed) {
                    if (product.desc) {
                        html += '<div class="col-12">'
                            html += i18next.t(scenario.label + product.desc)
                        html += '</div>'
                    }
                    if (product.products) {
                        html += '<div class="col-12">'
                            html += '<div class="row g-1 align-items-center">'
                                for (let id in product.products) {
                                    let productElem = game.currentElems.find(elem => elem.type == 'product' && elem.id == id)
                                    html += '<div class="col-12">'
                                        html += '<div class="card card-body">'
                                            html += '<div class="row gx-2 align-items-center">'
                                                if (productElem.unlocked) {
                                                    html += '<div class="col">'
                                                        html += '<div class="row gx-2 align-items-center">'
                                                            html += '<div class="col-auto"><button class="btn btn-light" onclick="window.app.doClick(\'selectElem\', { elemId:\'' + productElem.id + '\' })">' + displayIcon(productElem.icon, productElem.iconText, 18) + '</button></div>'
                                                            html += '<div class="col text-white">' + i18next.t(scenario.label + productElem.label) + '</div>'
                                                        html += '</div>'
                                                    html += '</div>'
                                                    html += '<div id="product-' + productElem.id + '-count" class="col-auto"></div>'
                                                }
                                                else {
                                                    html += '<div class="col-auto text-center" style="width: 44px;"><i class="fas fa-lock"></i></div>'
                                                    html += '<div class="col" style="line-height: 28px;">' + i18next.t('word_locked') + '</div>'
                                                }
                                            html += '</div>'
                                        html += '</div>'
                                    html += '</div>'
                                }
                            html += '</div>'
                        html += '</div>'
                    }
                    let items = game.currentElems.filter(item => item.type == 'item' && item.product.id == product.id)
                    if (items.length > 0) {
                        items.sort(function(a, b) {
                            if (a.order < b.order) return -1
                            if (a.order > b.order) return 1
                            return 0
                        })
                        html += '<div class="col-12">'
                            html += '<div class="row gx-1 align-items-center justify-content-end">'
                                html += '<div class="col-auto small pe-2">' + i18next.t('word_forAll') + '</div>'
                                html += '<div class="col-auto">'
                                    html += '<button type="button" class="btn btn-outline-danger" onclick="window.app.doClick(\'productUnassignMachine\')">'
                                        html += '<i class="fas fa-fw fa-minus-circle"></i>'
                                    html += '</button>'
                                html += '</div>'
                                html += '<div class="col-auto">'
                                    html += '<button type="button" class="btn btn-outline-primary" onclick="window.app.doClick(\'productAssignMachine\')">'
                                        html += '<i class="fas fa-fw fa-plus-circle"></i>'
                                    html += '</button>'
                                html += '</div>'
                            html += '</div>'
                        html += '</div>'
                        html += '<div class="col-12">'
                            html += '<div class="row g-1 align-items-center">'
                                items.forEach(item => {
                                    html += '<div class="col-12">'
                                        html += '<div class="card card-body">'
                                            html += '<div class="row g-1 align-items-center justify-content-end">'
                                                if (item.unlocked) {
                                                    html += '<div class="col-12 col-lg">'
                                                        html += '<div class="row g-1 align-items-center justify-content-end">'
                                                            html += '<div class="col-auto">' + displayIcon(item.icon, item.iconText, 24) + '</div>'
                                                            html += '<div class="ps-2 col text-white">' + i18next.t(scenario.label + item.label) + '</div>'
                                                            html += '<div class="ms-auto col-auto text-end">'
                                                                html += '<div id="item-' + item.id + '-count"></div>'
                                                                html += '<div class="progress" role="progressbar" style="width: 75px; height: 3px;">'
                                                                    html += '<div id="item-' + item.id + '-progress" class="progress-bar bg-success" style="width: 0%"></div>'
                                                                html += '</div>'
                                                            html += '</div>'
                                                        html += '</div>'
                                                    html += '</div>'
                                                    html += '<div id="item-' + item.id + '-machineCount" class="col-auto text-end" style="width: 45px;"></div>'
                                                    let machineElem = game.getElem(item.machine)
                                                    html += '<div class="col-auto">'
                                                        html += '<button class="btn btn-light" onclick="window.app.doClick(\'selectElem\', { elemId:\'' + machineElem.id + '\' })">' + displayIcon(machineElem.icon, machineElem.iconText, 18) + '</button>'
                                                    html += '</div>'
                                                    if (item.counts) {                                            
                                                        html += '<div class="col-auto">'
                                                            html += '<select name="' + item.id + '" class="form-control text-center" onchange="window.app.doClick(\'setItemSelectCount\', { itemId:\'' + item.id + '\', count:this.value })">'
                                                                item.counts.forEach(count => {
                                                                    html += '<option' + (item.selectCount == count ? ' selected' : '') + '  value="' + count + '">' + i18next.t('word_' + count) + '</option>'
                                                                })
                                                            html += '</select>'
                                                        html += '</div>'
                                                    }
                                                    html += '<div class="col-auto">'
                                                        let value = game.canItemUnassignMachine(item)
                                                        html += '<button type="button" id="item-' + item.id + '-unassignBtn" class="btn btn-outline-danger' + (value == false ? ' disabled' : '') + '" onclick="window.app.doClick(\'itemUnassignMachine\', { itemId:\'' + item.id + '\' })">'
                                                            html += '<i class="fas fa-fw fa-minus-circle"></i>'
                                                        html += '</button>'
                                                    html += '</div>'
                                                    html += '<div class="col-auto">'
                                                        value = game.canItemAssignMachine(item)
                                                        html += '<button type="button" id="item-' + item.id + '-assignBtn" class="btn btn-outline-primary' + (value == false ? ' disabled' : '') + '" onclick="window.app.doClick(\'itemAssignMachine\', { itemId:\'' + item.id + '\' })">'
                                                            html += '<i class="fas fa-fw fa-plus-circle"></i>'
                                                        html += '</button>'
                                                    html += '</div>'
                                                }
                                                else {
                                                    html += '<div class="col-auto text-center" style="width: 32px;"><i class="fas fa-lock"></i></div>'
                                                    html += '<div class="col" style="line-height: 28px;">' + i18next.t(scenario.label + item.label) + '</div>'
                                                    html += '<div class="col-auto small">' + i18next.t('word_locked') + '</div>'
                                                }
                                            html += '</div>'
                                        html += '</div>'
                                    html += '</div>'
                                })
                            html += '</div>'
                        html += '</div>'
                    }
                }
            html += '</div>'
        html += '</div>'
    html += '</div>'
    //---
    return html
}
//---
class RightPane {
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
        let node = document.getElementById('right-pane')
        node.innerHTML = TplRightPane(this)
    }
    //---
    refresh(deltaMs) {
        //---
        let node, value, html, style
        //---
        let elem = window.app.game.currentElems.find(elem => elem.unlocked && elem.id == this.selectedElemId)
        if (elem.completed) return
            
        // Elem count
        //---
        node = document.getElementById('selectedElem-count')
        //---
        value = elem.count
        //---
        html = ''
        if (elem.completed) html = '<i class="fas fa-check-circle text-success" aria-hidden="true"></i>'
        else if (elem.type == 'product') {
            //---
            if (value > 0) html = '<span class="text-white">' + formatNumber(value, 0) + '</span>'
            //---
            if (elem.storage != Infinity) {
                //---
                if (html == '') html = '<span class="text-normal">' + formatNumber(value, 0) + '</span>'
                if (value >= elem.storage) html = '<span class="text-danger">' + formatNumber(value, 0) + '</span>'
                html += ' / ' + formatNumber(elem.storage)
            }
        }
        if (node.innerHTML != html) node.innerHTML = html
        
        //---
        if (elem.cat == 'machine') {
            
            // Elem available count
            //---
            node = document.getElementById('selectedElem-availableCount')
            //---
            value = window.app.game.getMachineAvailableCount(elem.id)
            //---
            html = ''
            if (value > 0) html = '<span class="badge text-bg-success">' + formatNumber(value, 0) + '</span>'
            if (node.innerHTML != html) node.innerHTML = html
        }
            
        //---
        if (elem.cat != 'mission') {
            
            // Elem build button
            //---
            node = document.getElementById('selectedElem-buildBtn')
            //---
            style = 'btn btn-outline-primary'
            if (window.app.game.canProductBuild(elem) == false) style += ' disabled'
            if (node.className != style) node.className = style
        }
        
        //---
        let items = window.app.game.currentElems.filter(item => item.unlocked && item.type == 'item' && item.product.id == elem.id)
        items.forEach(item => {
            
            // Item count
            //---
            node = document.getElementById('item-' + item.id + '-count')
            //---
            if (item.count >= item.storage) html = '<small><i class="fas fa-check-circle text-success" aria-hidden="true"></i></small>'
            else {
                //---
                value = Math.floor(item.count)
                //---
                if (value > 0) html = '<small class="text-white">' + formatNumber(value) + '</small>'
                else html = '<small class="text-normal">' + formatNumber(value) + '</small>'
                html += '<small> / ' + formatNumber(item.storage) + '</small>'
            }
            if (node.innerHTML != html) node.innerHTML = html

            // Item progress
            //---
            node = document.getElementById('item-' + item.id + '-progress')
            //---
            let progress = 100 * (item.count - Math.floor(item.count))
            //---
            html = progress + '%'
            if (node.style.width != html) node.style.width = html
            
            // Item machine count
            //---
            node = document.getElementById('item-' + item.id + '-machineCount')
            //---
            if (item.machineCount > 0) html = '<span class="text-white"><small class="opacity-50">x</small> ' + formatNumber(item.machineCount, 0) + '</span>'
            else html = '<span class="text-normal"><small class="opacity-50">x</small> ' + formatNumber(item.machineCount, 0) + '</span>'
            if (node.innerHTML != html) node.innerHTML = html
            
            // Item machine assign button
            //---
            node = document.getElementById('item-' + item.id + '-assignBtn')
            //---
            style = 'btn btn-outline-primary'
            if (window.app.game.canItemAssignMachine(item) == false) style += ' disabled'
            if (node.className != style) node.className = style
            
            // Item machine unassign button
            //---
            node = document.getElementById('item-' + item.id + '-unassignBtn')
            //---
            style = 'btn btn-outline-danger'
            if (window.app.game.canItemUnassignMachine(item) == false) style += ' disabled'
            if (node.className != style) node.className = style
        })
        
        //---
        for (let id in elem.products) {
            let productElem = window.app.game.currentElems.find(elem => elem.type == 'product' && elem.id == id)
            if (productElem.unlocked) {
                
                // Product count
                //---
                node = document.getElementById('product-' + id + '-count')
                //---
                if (productElem.count >= elem.products[id]) html = '<i class="fas fa-check-circle text-success" aria-hidden="true"></i>'
                else {
                    if (productElem.count > 0) html = '<span class="text-white">' + formatNumber(productElem.count, 0) + '</span>'
                    else html = '<span class="text-normal">' + formatNumber(productElem.count, 0) + '</span>'
                    html += ' / ' + formatNumber(elem.products[id])
                }
                if (node.innerHTML != html) node.innerHTML = html
            }
        }
    }
    //---
    doClick(action, data) {
        //---
        if (action == 'selectElem') {
            //---
            this.selectedElemId = data.elemId
            this.display()
        }
        //---
        else if (action == 'setProductSelectCount') {
            //---
            let product = window.app.game.getElem(data.productId)
            product.selectCount = data.count
            //---
            let buildCount = window.app.game.computeProductBuildCount(product)
            //---
            let items = window.app.game.currentElems.filter(item => item.type == 'item' && item.product.id == product.id)
            items.forEach(item => { item.storage = Math.ceil(buildCount * item.stack) })
        }
        else if (action == 'productBuild') { window.app.game.productBuild(data.productId) }
        else if (action == 'productAssignMachine') {
            //---
            let items = window.app.game.currentElems.filter(item => item.type == 'item' && item.product.id == this.selectedElemId)
            items.sort(function(a, b) {
                if (a.order < b.order) return -1
                if (a.order > b.order) return 1
                return 0
            })
            items.reverse().forEach(item => { this.doClick('itemAssignMachine', { itemId:item.id }) })
        }
        else if (action == 'productUnassignMachine') {
            //---
            let items = window.app.game.currentElems.filter(item => item.type == 'item' && item.product.id == this.selectedElemId)
            items.reverse().forEach(item => { this.doClick('itemUnassignMachine', { itemId:item.id }) })
        }
        //---
        else if (action == 'setItemSelectCount') {
            //---
            let item = window.app.game.getElem(data.itemId)
            item.selectCount = data.count
        }
        else if (action == 'itemAssignMachine') window.app.game.itemAssignMachine(data.itemId)
        else if (action == 'itemUnassignMachine') window.app.game.itemUnassignMachine(data.itemId)
    }
}
