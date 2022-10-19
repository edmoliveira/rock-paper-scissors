function ControlGamePad(elCanvas, elDiv) {
    "use strict";

    //#region Fiedls

    const _self = this;
    const _elCanvas = elCanvas;
    const _elDiv = elDiv;
    const _oUtil = new UtilGame();   
    const _oLoadingGame = new LoadingGame(_elCanvas);  
    const _oImages = factoryImages('img');   
    const _oDrawing = new Drawing(_oImages);  
    const _context = _elCanvas.getContext('2d');

    const _timer = _oUtil.createTimer();

    const _buttons = [];

    const _enterButton = document.getElementById('enterButton');
    const _nameInput = document.getElementById('nameInput');

    //#endregion

    //#region Variables

    let isDeviceReady = false;
    let socket;
    let socketData;

    //#endregion

    //#region Properties     

    Object.defineProperty(_self, "oUtil", {
        get: function () {
            return _oUtil;
        }
    });

    //#endregion

    //#region Methods public

    _self.setDeviceReady = function () {
        isDeviceReady = true;
    }

    //#endregion

    //#region Methods private

    window.addEventListener('DOMContentLoaded', () => {
        _timer.begin();

        const disableHideButtons = id => {
            _buttons.filter(b => b.id !== id).forEach(button => {
                button.startCloseAnimation();
            })
        }

        const button_Click = source => {
            if(!source.disabled) {
                disableHideButtons(source.id);

                source.startMoveDestinyAnimation();

                socket.emit('move', '{"id": "' + device.uuid + '", "move": ' + source.move + '}');
            }
        }

        const rockButton = factoryButton(1, _oImages.rock, false, true, 1);
        rockButton.addClickListener(button_Click)
        _buttons.push(rockButton);

        const paperButton = factoryButton(2, _oImages.paper, false, true, 2);
        paperButton.addClickListener(button_Click)
        _buttons.push(paperButton);

        const scissorsButton = factoryButton(3, _oImages.scissors, false, true, 0);
        scissorsButton.addClickListener(button_Click)
        _buttons.push(scissorsButton);

        window_Resize();
        
        _oLoadingGame.initialize();

        loadingScreen(function () {
            _oLoadingGame.kill();

            executeAnimation();

            socket = io('http://127.0.0.1:3000');

            socket.on('connect', function () {
                elDivShow();
            });

            socket.on('canPlay', function () {
                _buttons.forEach(button => {
                    button.enable();
                    button.show();
                    button.startOpenAnimation();
                    button.startMoveOriginalAnimation();
                });
            });

            socket.on('start', function () {
                elDivHide();

                _buttons.forEach(button => {
                    button.show();
                    button.disable();
                    button.startOpenAnimation();
                });
            });

            socket.on('stop', function () {
                _buttons.forEach(button => {
                    button.disable();
                    button.startMoveOriginalAnimation();
                });
            });

            socket.on('close', function() {
                elDivHide();

                _buttons.forEach(button => {
                    button.startCloseAnimation();
                    button.startMoveOriginalAnimation();
                });
            });

            socket.on('ping', function () {
                socket.emit('pong', socketData);
            });
            
        });
    });

    _enterButton.onclick = () => {
        socketData = '{"type": 1, "id": "' + device.uuid + '", "name": "' + _nameInput.value + '"}';
        socket.emit('addPlayer', socketData);     
    }

    window.onbeforeunload = () => {
        if(socket != null) {
            socket.disconnect();
            socket = null;
        }
    };

    window.onresize = () => {
        window_Resize();
    };

    if ('ontouchstart' in document.documentElement) {
        document.addEventListener('touchstart', e => {

            window_TouchStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        });

        document.addEventListener('touchend', e => {
            window_TouchEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        });
    }
    else {
        window.onmousedown = (e) => {        
            window_TouchStart(e.offsetX, e.offsetY);
        };
        
        window.onmouseup = (e) => {
            window_TouchEnd(e.offsetX, e.offsetY);
        };
    }

    let buttonSelected = null;

    function window_TouchStart(pageX, pageY) {
        for(let index = 0; index < _buttons.length;index++) {
            if(_oUtil.searchClickCircle(_buttons[index], pageX, pageY)) {
                buttonSelected = _buttons[index];
                break;
            }
        }
    }

    function window_TouchEnd(pageX, pageY) {
        if(buttonSelected != null) {
            buttonSelected.click();
            buttonSelected = null;
        }
    }

    function window_Resize() {
        let screen = _self.oUtil.getwindowSize();

        _elCanvas.width = screen.width;
        _elCanvas.height = screen.height;
        _elCanvas.style.width = screen.width + 'px';
        _elCanvas.style.height = screen.height + 'px';

        const divW = screen.width * 0.95;
        const divH = screen.height * 0.90;

        _elDiv.style.width = divW + 'px';
        _elDiv.style.height = divH + 'px'; 

        _oLoadingGame.refresh();

        setSizePosition();
    }

    function setSizePosition() {
        const buttonContainer = _elCanvas.width / 3;

        const buttonRadius = buttonContainer * 0.35;
        const centerY = _elCanvas.height / 2;

        const centerX1 = (buttonContainer / 2);
        const centerX2 = buttonContainer + (buttonContainer / 2);
        const centerX3 = buttonContainer * 2 + (buttonContainer / 2);

        _buttons[0].setSizePosition(centerX1, centerX2, centerY, buttonRadius);
        _buttons[1].setSizePosition(centerX2, centerX2, centerY, buttonRadius);
        _buttons[2].setSizePosition(centerX3, centerX2, centerY, buttonRadius);
    }

    function executeAnimation() {
        _timer.current();

        _buttons.forEach(button => {
            executeButtonAnimation(button);
        });

        _context.clearRect(0, 0, _elCanvas.width, _elCanvas.height);

        _oDrawing.draw(_context, 0, 0, _elCanvas.width, _elCanvas.height, _buttons);

        _timer.end();
    
        requestAnimationFrame(executeAnimation);
    }

    function executeButtonAnimation(button) {
        const velocity = button.closeAnimation === animationEnum.ON || button.openAnimation === animationEnum.ON
                         ? 10 : 800;

        const value = _timer.getValuePosition(_oUtil.getValueScale(velocity, _elCanvas.width, _elCanvas.height));

        if(button.closeAnimation === animationEnum.ON) {
            button.alpha -= value;

            if(button.alpha <= 0) {
                button.alpha = 0;
                button.endCloseAnimation();
                button.hide();
            }
        }
        else if(button.openAnimation === animationEnum.ON) {
            button.alpha += value;

            if(button.alpha >= 1) {
                button.alpha = 1;
                button.endOpenAnimation();
            }
        }
        
        if(button.moveAnimation === animationEnum.ON) {
            if(button.moveDirectionAnimation === animationDirectionEnum.DESTINY) {
                if(button.moveToDestPosition(value)) {
                    button.endMoveAnimation();
                    button.disable();
                }
            }
            else {
                if(button.moveToOriginPosition(value)) {
                    button.endMoveAnimation();
                }
            }
        }
    }

    function loadingScreen(fn) {
        const font1 = new Image();
        font1.src = 'css/fonts/fontG.ttf';
        font1.onerror = function () {
            this.isLoad = true;
        };

        loadExterns();

        function loadExterns() {
            let isOk = true;

            if (font1.isLoad != true) {
                isOk = false;
            }

            if (_oImages.scissors.isLoad != true) {
                isOk = false;
            }

            if (_oImages.rock.isLoad != true) {
                isOk = false;
            }

            if (_oImages.paper.isLoad != true) {
                isOk = false;
            }

            if (!isDeviceReady) {
                isOk = false;
            }

            if (isOk) {
                fn();
            }
            else {
                setTimeout(loadExterns, 50);
            }
        }
    }
    
    function elDivShow() {
        _elDiv.classList.add('enterShow');

        _enterButton.removeAttribute('disabled');
        _nameInput.removeAttribute('disabled');
    }

    function elDivHide() {
        _elDiv.classList.remove('enterShow');

        _enterButton.setAttribute('disabled', '');
        _nameInput.setAttribute('disabled', '');
    }

    //#endregion
}