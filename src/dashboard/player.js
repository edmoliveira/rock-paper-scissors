class Player {
    direction;

    centerXInitial;
    centerXDest;
    centerX;

    centerY;

    radiusInitial;
    radiusDest;
    radius;

    image;

    animation1 = animationEnum.NULL;
    animation2 = animationEnum.NULL;

    isWinner = false;
    isTIe = false;

    onWinner = null;
    onClose = null;

    move = null;

    score = 0;
    text;

    openAnimation1(isWinner, isTIe) {
        this.isWinner = isWinner;
        this.isTIe = isTIe;
        this.animation1 = animationEnum.OPEN;
    }

    closeAnimation1() {
        this.animation1 = animationEnum.CLOSE;
    }

    finishAnimation1() {
        if(this.animation1 === animationEnum.OPEN) {
            setTimeout(() => {
                if(this.isWinner){
                    this.isWinner = false;
                    
                    if(this.onWinner != null){
                        this.onWinner();
                    }
                }
                else {
                    if(this.onClose != null){
                        this.onClose(this.isTIe);
                        this.isTIe = false;
                    }
                }
            }, 1000); 
        }

        this.animation1 = animationEnum.NULL; 
    }

    openAnimation2() {
        this.animation2 = animationEnum.OPEN;
    }    

    closeAnimation2() {
        this.animation2 = animationEnum.CLOSE;
    }

    finishAnimation2() {
        if(this.animation2 === animationEnum.OPEN) {
            setTimeout(() => {
                this.score++;
                this.closeAnimation2();
            }, 2000); 
        }

        this.animation2 = animationEnum.NULL;
    }
}