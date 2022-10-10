class Label {
    fontSizeOriginal;
    fontSize;
    fontSizeDest;
    text = '';
    animation = animationEnum.NULL;

    openAnimation() {
        this.animation = animationEnum.OPEN;
    }

    closeAnimation() {
        this.animation = animationEnum.CLOSE;
    }

    finishAnimation() {
        if(this.animation === animationEnum.OPEN) {
            setTimeout(() => {
                this.closeAnimation();
            }, 2000); 
        }

        this.animation = animationEnum.NULL; 
    }
}