//---
var DATA = {
    //---
    scenarios:[],
}
//---
class GameScenario {
    //---
    constructor(data) {
        //---
        this.initData = data
        //---
        let names = Object.getOwnPropertyNames(data) 
        names.forEach(name => { Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(data, name)) })
    }
    //---
    reset(game) {
        //---
        this.startDate = null
        this.victoryDate = null
    }
    //---
    load(data) {
        //---
        if (data.startDate != null) this.startDate = data.startDate
        if (data.victoryDate != null) this.victoryDate = data.victoryDate
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        savedData.startDate = this.startDate
        savedData.victoryDate = this.victoryDate
        //---
        return savedData
    }
    //---
    getElemData(elemId) { return this.elems.find(elem => elem.id == elemId) }
}
//---
class GameElem {
    //---
    constructor(elemData) {
        //---
        let names = Object.getOwnPropertyNames(elemData) 
        names.forEach(name => { Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(elemData, name)) })
        //---
        this.count = this.initCount ? this.initCount : 0
        this.storage = this.stack ? this.stack : Infinity
        this.unlocked = this.reqs ? false : true
    }
    //---
    load(data) {
        //---
        if (data.count != null) this.count = data.count
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        savedData.count = this.count
        //---
        return savedData
    }
}
//---
class GameProduct extends GameElem {
    //---
    constructor(productData) {
        //---
        super(productData)
        //---
        this.counts = this.counts ? this.counts : [ '1' ]
        this.notified = true
        this.completed = false
        this.toComplete = true
        this.selectCount = this.counts[0]
    }
    //---
    load(data) {
        //---
        super.load(data)
        //---
        if (data.notified != null) this.notified = data.notified
        if (data.selectCount != null) this.selectCount = data.selectCount
    }
    //---
    getSaveData() {
        //---
        let savedData = super.getSaveData()
        //---
        savedData.notified = this.notified
        savedData.selectCount = this.selectCount
        //---
        return savedData
    }
}
//---
class GameItem extends GameElem {
    //---
    constructor(product, itemData, count) {
        //---
        super(itemData)
        //---
        this.id = product.id + '-' + itemData.id
        this.type = 'item'
        this.stack = count
        this.itemId = itemData.id
        this.counts = [ '1', '5', '10', 'max' ]
        this.output = this.output / this.seconds
        this.product = product
        this.storage = this.stack
        this.selectCount = this.counts[0]
        this.machineCount = 0
    }
    //---
    load(data) {
        //---
        super.load(data)
        //---
        if (data.selectCount != null) this.selectCount = data.selectCount
        if (data.machineCount != null) this.machineCount = data.machineCount
    }
    //---
    getSaveData() {
        //---
        let savedData = super.getSaveData()
        //---
        savedData.selectCount = this.selectCount
        savedData.machineCount = this.machineCount
        //---
        return savedData
    }
}
//---
class Game {
    //---
    constructor() {
        //---
        this.currentScenario = null
        //---
        this.victory = false
        this.victoryReqs = null
        //---
        this.scenarios = []
        DATA.scenarios.forEach(scenario => {
            //---
            let newScenario = new GameScenario(scenario)
            this.scenarios.push(newScenario)
        })
        //---
        this.currentElems = null
    }
    //---
    loadScenario(scenarioId) {
        //---
        this.currentScenario = this.scenarios.find(scenario => scenario.id == scenarioId)
        //---
        this.victory = false
        this.victoryReqs = this.currentScenario.victoryReqs ? this.currentScenario.victoryReqs : null
        //---
        this.currentElems = []
        //---
        let products = this.currentScenario.elems.filter(elem => elem.type == 'product')
        products.forEach(dataProduct => {
            //---
            let product = new GameProduct(dataProduct)
            this.currentElems.push(product)
            //---
            for (let id in dataProduct.items) this.addItemToProduct(product, id, product.items[id])
        })
    }
    //---
    addItemToProduct(product, itemId, count) {
        //---
        let dataItem = this.currentScenario.elems.find(elem => elem.id == itemId)
        //---
        let item = this.currentElems.find(elem => elem.itemId == dataItem.id && elem.product.id == product.id)
        if (item) item.stack += count
        else {
            //---
            let item = new GameItem(product, dataItem, count)
            this.currentElems.push(item)
        }
        //---
        for (let id in dataItem.items) this.addItemToProduct(product, id, count * dataItem.items[id] / dataItem.output)
        //---
        if (dataItem.machine) {
            //---
            let dataMachine = this.currentScenario.elems.find(elem => elem.id == dataItem.machine)
            if (dataMachine.energyId) {
                //---
                let seconds = count * dataItem.seconds / dataItem.output
                this.addItemToProduct(product, dataMachine.energyId, seconds * dataMachine.energyCount)
            }
        }
    }
    //---
    start(scenarioId) {
        //---
        this.loadScenario(scenarioId)
        //---
        this.refresh()
    }
    //---
    load(data) {
        //---
        if (data.scenarioId != null) this.loadScenario(data.scenarioId)
        if (data.victory != null) this.victory = data.victory
        //---
        if (data.scenarios != null) this.scenarios.forEach(scenario => { if (data.scenarios[scenario.id]) scenario.load(data.scenarios[scenario.id]) })
        //---
        if (data.elems != null) this.currentElems.forEach(elem => { if (data.elems[elem.id]) elem.load(data.elems[elem.id]) })
        //---
        this.refresh()
    }
    //---
    getSaveData() {
        //---
        let savedData = {}
        //---
        savedData.victory = this.victory
        savedData.scenarioId = this.currentScenario.id
        //---
        savedData.scenarios = {}
        this.scenarios.forEach(scenario => savedData.scenarios[scenario.id] = scenario.getSaveData())
        //---
        savedData.elems = {}
        this.currentElems.forEach(elem => savedData.elems[elem.id] = elem.getSaveData())
        //---
        return savedData
    }
    //---
    getElem(itemId) { return this.currentElems.find(item => item.id == itemId) }
    //---
    checkReqs(reqs) {
        //---
        let check = true        
        //---
        reqs.forEach(reqId => {
            //---
            let elem = this.getElem(reqId)
            if (elem.completed == false) check = false
        })
        //---
        return check
    }
    //---
    refresh() {
        //---
        this.refreshUnlocked()
        this.refreshItemStorages()
    }
    //---
    refreshUnlocked() {
        //---
        this.currentElems.filter(elem => elem.cat == 'mission').forEach(elem => {
            //---
            elem.count = 1
            //---
            for (let id in elem.products) {
                let productElem = this.currentElems.find(el => el.type == 'product' && el.id == id)
                if (productElem.count < elem.products[id]) elem.count = 0
            }
        })
        //---
        let refresh = false, next = null
        this.currentElems.forEach(elem => {
            if (elem.completed == false && elem.toComplete && elem.count >= elem.storage) {
                //---
                elem.completed = true
                refresh = true
                //---
                if (elem.cat == 'mission') next = elem.next
            }
        })
        //---
        this.currentElems.filter(elem => elem.reqs).forEach(elem => { elem.unlocked = this.checkReqs(elem.reqs) })
        //---
        if (refresh) window.app.doClick('refreshTabGame')
        if (next) window.app.doClick('selectElem', { elemId:next })
    }
    //---
    refreshItemStorages() {
        //---
        let products = this.currentElems.filter(elem => elem.type == 'product')
        products.forEach(product => {
            //---
            let buildCount = this.computeProductBuildCount(product)
            //---
            let items = this.currentElems.filter(item => item.type == 'item' && item.product.id == product.id)
            items.forEach(item => { item.storage = Math.ceil(buildCount * item.stack) })
        })
    }
    //---
    isVictoryReached() {
        //---
        if (this.victory) return false
        else if (this.victoryReqs) return this.checkReqs(this.victoryReqs)
        else return false
    }
    //---
    doVictory() {
        //---
        this.victory = true
        this.currentScenario.victoryDate = Date.now()
    }
    //---
    doTick(stepMs) {
        //---
        let seconds = stepMs / 1000
        //---
        let items = this.currentElems.filter(elem => elem.unlocked && elem.type == 'item' && elem.machineCount > 0 && elem.count < elem.storage)
        items.forEach(item => {
            //---
            item.count += item.output * seconds * item.machineCount
            if (item.count > item.storage) item.count = item.storage
        })
    }
    //---
    computeProductBuildCount(product) {
        //---
        if (product.selectCount == '1') return 1
        else if (product.selectCount == '5') return 5
        else if (product.selectCount == '10') return 10
        else if (product.selectCount == '25') return 25
    }
    canProductBuild(product) {
        //---
        if (!product.unlocked) return false
        //---
        if (product.count >= product.storage) return false
        //---
        let selectCount = this.computeProductBuildCount(product)
        if (selectCount <= 0) return false
        //---
        let check = true
        //---
        for (let id in product.products) {
            //---
            let productElem = window.app.game.currentElems.find(elem => elem.type == 'product' && elem.id == id)
            if (productElem.count < product.products[id]) return false
        }
        //---
        let items = this.currentElems.filter(item => item.type == 'item' && item.product.id == product.id )
        items.forEach(item => { if (item.count < item.storage) check = false })
        //---
        return check
    }
    productBuild(productId) {
        //---
        let product = this.getElem(productId)
        if (this.canProductBuild(product)) {
            //---
            let selectCount = this.computeProductBuildCount(product)
            product.count += selectCount
            //---
            let items = this.currentElems.filter(item => item.type == 'item' && item.product.id == product.id )
            items.forEach(item => {
                //---
                item.count = 0
                if (product.count >= product.storage) item.machineCount = 0
            })
            //---
            this.refresh()
        }
    }
    //---
    getMachineUsedCount(machineId) {
        //---
        let usedCount = 0
        //---
        let items = this.currentElems.filter(elem => elem.type == 'item' && elem.machine == machineId && elem.machineCount > 0)
        items.forEach(item => { usedCount += item.machineCount })
        //---
        return usedCount
    }
    getMachineAvailableCount(machineId) {
        //---
        let machine = this.getElem(machineId)
        //---
        let usedCount = this.getMachineUsedCount(machineId)
        return machine.count - usedCount
    }
    //---
    computeItemAssignCount(item) {
        //---
        if (item.selectCount == '1') return 1
        else if (item.selectCount == '5') return 5
        else if (item.selectCount == '10') return 10
        else if (item.selectCount == 'max') return this.getMachineAvailableCount(item.machine)
    }
    canItemAssignMachine(item) {
        //---
        if (!item.unlocked) return false
        //---
        let selectCount = this.computeItemAssignCount(item)
        if (selectCount <= 0) return false
        //---
        if (this.getMachineAvailableCount(item.machine) < selectCount) return false
        //---
        return true
    }
    itemAssignMachine(itemId) {
        //---
        let item = this.getElem(itemId)
        if (this.canItemAssignMachine(item)) {
            //---
            let selectCount = this.computeItemAssignCount(item)
            item.machineCount += selectCount
        }
    }
    //---
    computeItemUnassignCount(item) {
        //---
        if (item.selectCount == '1') return 1
        else if (item.selectCount == '5') return 5
        else if (item.selectCount == '10') return 10
        else if (item.selectCount == 'max') return item.machineCount
    }
    canItemUnassignMachine(item) {
        //---
        let selectCount = this.computeItemUnassignCount(item)
        if (selectCount <= 0) return false
        //---
        if (item.machineCount < selectCount) return false
        //---
        return true
    }
    itemUnassignMachine(itemId) {
        //---
        let item = this.getElem(itemId)
        if (this.canItemUnassignMachine(item)) {
            //---
            let selectCount = this.computeItemUnassignCount(item)
            item.machineCount -= selectCount
        }
    }
}