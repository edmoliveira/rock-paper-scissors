function ControlGamePad(elCanvas, elDiv) {
    "use strict";

    //#region Fiedls

    const _self = this;
    const _elCanvas = elCanvas;
    const _elDiv = elDiv;
    const _oUtil = new UtilGame();   
    const _oLoadingGame = new LoadingGame(_elCanvas);  
    const _oImages = factoryImages('img');   
    const _waitingLabel = factoryLabel('Waiting...');
    const _oDrawing = new Drawing(_oImages);  
    const _context = _elCanvas.getContext('2d');

    const _timer = _oUtil.createTimer();

    const _buttons = [];
    const _stopButton = factoryButton(10, null, false, true);

    const _enterButton = document.getElementById('enterButton');
    const _nameInput = document.getElementById('nameInput');

    //#endregion

    //#region Variables

    let isDeviceReady = false;
    let socket;
    let socketData;
    let devideId;
    let elDivIsOpen = false;

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

                socket.emit('move', '{"id": "' + devideId + '", "move": ' + source.move + '}');
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

        _stopButton.addClickListener(source => {
            if(!source.disabled) {
                _stopButton.hide();
                _waitingLabel.alpha = 0;

                socket.emit('removePlayer', socketData);

                socketData = null;

                elDivShow();
            }
        });

        window_Resize();
        
        _oLoadingGame.initialize();

        loadingScreen(function () {
            _oLoadingGame.kill();

            _waitingLabel.alpha = 1;

            executeAnimation();

            socket = io('http://127.0.0.1:3000');

            let action = 0;

            const connectFn = () => {
                if(action === 0) {
                    if(socketData == null) {
                        action = 1;

                        _waitingLabel.alpha = 0;
    
                        _stopButton.hide();
    
                        _buttons.forEach(button => {
                            button.hide();
                        });
        
                        elDivShow();
    
                        action = 0;
                    }
                }
                else{
                    setTimeout(connectFn, 100);
                }
            };

            const canPlayFn = () => {
                if(action === 0) {
                    action = 1;

                    _waitingLabel.startCloseAnimation();

                    _buttons.forEach(button => {
                        button.enable();
                        button.show();
                        button.startOpenAnimation();
                        button.startMoveOriginalAnimation();
                    });

                    action = 0;
                }
                else{
                    setTimeout(canPlayFn, 100);
                }
            };

            const startFn = () => {
                if(action === 0) {
                    action = 1;

                    _stopButton.show();
                    _stopButton.enable();

                    _buttons.forEach(button => {
                        button.show();
                        button.disable();
                        button.startOpenAnimation();
                    });

                    action = 0;
                }
                else{
                    setTimeout(start, 100);
                }
            };

            const stopFn = () => {
                if(action === 0) {
                    action = 1;

                    if(!elDivIsOpen) {
                        _waitingLabel.startOpenAnimation();
                    }                
    
                    _buttons.forEach(button => {
                        button.disable();
                        button.startCloseAnimation();
                        button.startMoveOriginalAnimation();
                    });

                    action = 0;
                }
                else{
                    setTimeout(stop, 100);
                }
            };

            const disconnectFn = () => {
                if(action === 0) {
                    action = 1;

                    _stopButton.hide();
                    _stopButton.disable();

                    elDivHide();

                    _waitingLabel.startOpenAnimation();
    
                    _buttons.forEach(button => {
                        button.startCloseAnimation();
                        button.startMoveOriginalAnimation();
                    });

                    action = 0;
                }
                else{
                    setTimeout(disconnectFn, 100);
                }
            };

            socket.on('connect', connectFn);

            socket.on('canPlay', canPlayFn);

            socket.on('start', startFn);

            socket.on('stop', stopFn);

            socket.on('disconnect', disconnectFn);

            socket.on('ping', function () {
                if(socketData != null) {
                    socket.emit('pong', socketData);
                }
            });
            
        });
    });

    _enterButton.onclick = () => {
        if((_nameInput.value || '').trim() != '') {            
            devideId = device.uuid + '_' + _nameInput.value;

            socketData = '{"type": 1, "id": "' + devideId + '", "name": "' + _nameInput.value + '"}';

            elDivHide();

            _waitingLabel.startOpenAnimation();
            
            socket.emit('addPlayer', socketData);  
        }   
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

        if(buttonSelected == null) {
            if(_oUtil.searchClickCircle(_stopButton, pageX, pageY)) {
                buttonSelected = _stopButton;
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
        const centerY = _elCanvas.height - buttonRadius * 1.3;

        const centerX1 = (buttonContainer / 2);
        const centerX2 = buttonContainer + (buttonContainer / 2);
        const centerX3 = buttonContainer * 2 + (buttonContainer / 2);

        _buttons[0].setSizePosition(centerX1, centerX2, centerY, buttonRadius);
        _buttons[1].setSizePosition(centerX2, centerX2, centerY, buttonRadius);
        _buttons[2].setSizePosition(centerX3, centerX2, centerY, buttonRadius);

        const stopButtonRadius = buttonContainer * 0.15;
        const stopButtonY = stopButtonRadius * 1.3;

        _stopButton.setSizePosition(centerX2, centerX2, stopButtonY, stopButtonRadius);
    }

    function executeAnimation() {
        _timer.current();

        _buttons.forEach(button => {
            executeButtonAnimation(button);
        });

        executeLabelAnimation(_waitingLabel);

        _context.clearRect(0, 0, _elCanvas.width, _elCanvas.height);

        _oDrawing.draw(_context, 0, 0, _elCanvas.width, _elCanvas.height, _buttons, _waitingLabel, _stopButton);

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

    function executeLabelAnimation(label) {
        const velocity = 10;
        const value = _timer.getValuePosition(_oUtil.getValueScale(velocity, _elCanvas.width, _elCanvas.height));

        if(label.closeAnimation === animationEnum.ON) {
            label.alpha -= value;

            if(label.alpha <= 0) {
                label.alpha = 0;
                label.endCloseAnimation();
            }
        }
        else if(label.openAnimation === animationEnum.ON) {
            label.alpha += value;

            if(label.alpha >= 1) {
                label.alpha = 1;
                label.endOpenAnimation();
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
        elDivIsOpen = true;

        _elDiv.classList.add('enterShow');

        _enterButton.removeAttribute('disabled');
        _nameInput.removeAttribute('disabled');
    }

    function elDivHide() {
        elDivIsOpen = false;

        _elDiv.classList.remove('enterShow');

        _enterButton.setAttribute('disabled', '');
        _nameInput.setAttribute('disabled', '');

        _nameInput.value = '';
    }

    //#endregion
}