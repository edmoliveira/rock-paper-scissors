class Label {
    fontSizeOriginal;
    fontSize;
    fontSizeDest;
    text = '';
    animation = animationEnum.NULL;

    onEndAnimation;

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
        else if (this.animation === animationEnum.CLOSE && this.onEndAnimation != null) {
            this.onEndAnimation();
        }

        this.animation = animationEnum.NULL; 
    }
}