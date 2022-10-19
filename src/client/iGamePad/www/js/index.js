(function () {
    "use strict";

    let objControl = new ControlGamePad(
        document.querySelector('canvas'),
        document.getElementsByClassName('enter')[0]
    );

    document.addEventListener('deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Manipular eventos de pausa e retomada do Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: o Cordova foi carregado. Execute qualquer inicialização que exija o Cordova aqui.

        objControl.setDeviceReady();
    };

    function onPause() {
        // TODO: este aplicativo foi suspenso. Salve o estado do aplicativo aqui.
    };

    function onResume() {
        // TODO: este aplicativo foi reativado. Restaure o estado do aplicativo aqui.
    };

    window.device = {
        uuid: '111-222-333'
    }
    
    objControl.setDeviceReady();
} )();