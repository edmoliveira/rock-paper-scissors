const factoryLabel = (text) => {
    "use strict";

    const _text = text;
    
    let _alpha = 0;
    let _openAnimation = animationEnum.OFF;
    let _closeAnimation = animationEnum.OFF;    

    let self;

    class Label {
        get text() { return _text; }
        get alpha() { return _alpha; } set alpha(value) { _alpha = value; }

        get closeAnimation() { return _closeAnimation; }
        get openAnimation() { return _openAnimation; } 

        constructor() {
            self = this;
        }

        startCloseAnimation() {
            this.endOpenAnimation();
            _closeAnimation = animationEnum.ON;
        }

        endCloseAnimation() {
            _closeAnimation = animationEnum.OFF;
        }

        startOpenAnimation() {
            this.endCloseAnimation();
            _openAnimation = animationEnum.ON;
        }

        endOpenAnimation() {
            _openAnimation = animationEnum.OFF;
        }
    }

    const oLabel = new Label();

    Object.freeze(oLabel);

    return oLabel;
};
Object.freeze(factoryLabel);