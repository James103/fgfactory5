//---
var TplScreenError = function() {
    //---
    let html = ''
    //---
    html += '<div class="p-3" style="max-width:512px;">'
        html += '<div class="row g-3 justify-content-center">'
            html += '<div class="col-12 text-center">'
                html += '<img src="logo.png" width="48px" height="48px" />'
            html += '</div>'
            html += '<div class="col-12 text-center">'
                html += '<span class="h5 text-white">' + i18next.t('game_title') + '</span>'
            html += '</div>'
            html += '<div class="col-12 text-center">'
                html += '<span class="fs-6 text-danger">' + i18next.t('screenError_text') + '</span>'
            html += '</div>'
            html += '<div class="col-12 text-center">'
                html += '<span class="text-normal">' + i18next.t('screenError_info1') + '</span>'
            html += '</div>'
            html += '<div class="col-4 col-lg-3">'
                html += '<a href="https://discord.gg/ZXrggavUpv" target="_blank" class="w-100 btn btn-outline-primary">'
                    html += '<span><i class="fab fa-fw fa-discord"></i></span>'
                    html += '<span class="ms-1">Discord</span>'
                html += '</a>'
            html += '</div>'
            html += '<div class="col-12">'
                html += '<textarea spellcheck="false" rows="3" class="form-control" disabled readonly>' + window.app.getLocalData() + '</textarea>'
            html += '</div>'
            html += '<div class="col-4 col-lg-3">'
                html += '<button type="button" class="w-100 btn btn-outline-primary" onclick="window.app.exportSave()">'
                    html += '<span><i class="fas fa-fw fa-copy"></i></span>'
                    html += '<span class="ms-1">' + i18next.t('screenError_exportSave') + '</span>'
                html += '</button>'
            html += '</div>'
            html += '<div class="col-4 col-lg-3">'
                html += '<button type="button" class="w-100 btn btn btn-outline-primary px-0" onclick="window.app.downloadSave()">'
                    html += '<span><i class="fas fa-fw fa-download"></i></span>'
                    html += '<span class="ms-1">' + i18next.t('screenError_downloadSave') + '</span>'
                html += '</button>'
            html += '</div>'
            html += '<div class="col-12 text-center">'
                html += '<span class="text-normal">' + i18next.t('screenError_info2') + '</span>'
            html += '</div>'
            html += '<div class="col-4 col-lg-3">'
                html += '<button type="button" class="w-100 btn btn-outline-danger" onclick="window.app.showModal(\'modalWipe\')">'
                    html += '<span><i class="fas fa-fw fa-skull"></i></span>'
                    html += '<span class="ms-1">' + i18next.t('screenError_wipeSave') + '</span>'
                html += '</button>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    // Toasts
    //---
    html += '<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3">'
        html += TplToastExport()
    html += '</div>'
    
    // Modals
    //---
    html += TplModalWipe()

    //---
    return html
}
//---
class ScreenError {
    //---
    display() {
        //---
        let node = document.getElementById('screen')
        node.className = 'position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center'
        node.innerHTML = TplScreenError()
    }
}