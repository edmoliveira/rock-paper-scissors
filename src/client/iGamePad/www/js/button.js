const factoryButton = (id, image, v, d, move) => {
    "use strict";
    
    const _id = id;
    const _image = image;
    const _listeners = [];
    const _move = move;

    let _visible = v;
    let _disabled = d;
    
    let _alpha = 1;

    let _centerX = 0;
    let _centerXDest = 0;
    let _centerXOrig = 0;
    let _centerY = 0;
    let _radius = 0;

    let _closeAnimation = animationEnum.OFF;
    let _openAnimation = animationEnum.OFF;

    let _moveAnimation = animationEnum.OFF;
    let _moveDirectionAnimation = animationDirectionEnum.NULL;
    
    let self;
    let animationType;

    class Button {
        get id() { return _id; }
        get image() { return _image; }
        get move() { return _move; }
        get visible() { return _visible; }
        get disabled() { return _disabled; }

        get centerX() { return _centerX; }
        get centerY() { return _centerY; }
        get radius() { return _radius; }

        get alpha() { return _alpha; } set alpha(value) { _alpha = value; }

        get closeAnimation() { return _closeAnimation; }
        get openAnimation() { return _openAnimation; } 
        get moveAnimation() { return _moveAnimation; }
        get moveDirectionAnimation() { return _moveDirectionAnimation; }

        constructor() {
            self = this;
        }

        addClickListener(fn) {
            _listeners.push(fn);
        }

        click() {
            _listeners.forEach(fn => {
                fn(self);
            });
        }

        startCloseAnimation() {
            animationType = 1;
            _closeAnimation = animationEnum.ON;
        }

        endCloseAnimation() {
            _closeAnimation = animationEnum.OFF;
        }

        startOpenAnimation() {
            animationType = 2;
            _openAnimation = animationEnum.ON;
        }

        endOpenAnimation() {
            _openAnimation = animationEnum.OFF;
        }

        startMoveDestinyAnimation() {
            animationType = 3;
            _moveAnimation = animationEnum.ON;
            _moveDirectionAnimation = animationDirectionEnum.DESTINY;
        }

        startMoveOriginalAnimation() {
            animationType = 4;
            _moveAnimation = animationEnum.ON;
            _moveDirectionAnimation = animationDirectionEnum.ORIGINAL;
        }

        endMoveAnimation() {
            _moveAnimation = animationEnum.OFF;
            _moveDirectionAnimation = animationDirectionEnum.NULL;
        }

        show() {
            _visible = true;
        }

        hide() {
            _visible = false;
        }

        enable() {
            _disabled = false;
        }

        disable() {
            _disabled = true;
        }

        moveToDestPosition(value) {
            if(_centerXOrig > _centerXDest) {
                _centerX -= value;

                if(_centerX <= _centerXDest) {
                    _centerX = _centerXDest;
                    return true;
                }

                return false;
            }
            else {
                _centerX += value;

                if(_centerX >= _centerXDest) {
                    _centerX = _centerXDest;
                    return true;
                }

                return false;
            }
        }

        moveToOriginPosition(value) {
            if(_centerXOrig > _centerXDest) {
                _centerX += value;

                if(_centerX >= _centerXOrig) {
                    _centerX = _centerXOrig;
                    return true;
                }

                return false;
            }
            else {
                _centerX -= value;

                if(_centerX <= _centerXOrig) {
                    _centerX = _centerXOrig;
                    return true;
                }

                return false;
            }
        }

        setSizePosition(centerX, centerXDest, centerY, radius) {
            _centerX = centerX;
            _centerXOrig = centerX;
            _centerXDest = centerXDest;
            _centerY= centerY;
            _radius = radius;
        }
    }

    const oButton = new Button();

    Object.freeze(oButton);

    return oButton;
};
Object.freeze(factoryButton);