function Drawing(oImages) {
    "use strict";

    //#region Fiedls

    const _self = this;
    const _oImages = oImages;

    //#endregion

    //#region Methods public

    _self.draw = function (context, x, y, w, h, buttons) {
        const area = w * 2 + h * 2;

        context.save();

        const gradientRect = context.createLinearGradient(x, y, x, y + h);
        gradientRect.addColorStop(0.1, '#4B0BC1');
        gradientRect.addColorStop(0.5, '#BB77FF');
        gradientRect.addColorStop(0.9, '#4B0BC1');

        context.fillStyle = gradientRect;
        context.fillRect(x, y, w, h);     
        
        context.restore();

        buttons.forEach(button => {
            buttonDraw(context, button);
        });
    }

    //#endregion

    //#region Methods private

    function buttonDraw(context, button) {
        const centerX = button.centerX;
        const centerY = button.centerY;
        const radius = button.radius;

        if(button.visible) {
            context.save();

            context.globalAlpha = button.alpha;
    
            context.beginPath();
    
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowColor = '#002112';
            context.shadowBlur = 30;
    
            const x1 = centerX - radius;
            const y1 = centerY - radius;
            const x2 = centerX + radius;
            const y2 = centerY + radius;
        
            context.lineWidth = radius * 0.1;
    
            const gradientBack = context.createLinearGradient(x1, y1, x2, y2);
            const gradientBorder = context.createLinearGradient(x1, y1, x2, y2);

            if(!button.disabled) {
                gradientBack.addColorStop(0.1, '#008245');
                gradientBack.addColorStop(0.5, '#00FF90');            
                
                gradientBorder.addColorStop(0.1, '#00FF90');
                gradientBorder.addColorStop(0.5, '#008245');
            }
            else {
                gradientBack.addColorStop(0.1, '#999999');
                gradientBack.addColorStop(0.5, '#555555');            
                
                gradientBorder.addColorStop(0.1, '#555555');
                gradientBorder.addColorStop(0.5, '#999999');
            }
        
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        
            context.fillStyle = gradientBack;
            context.fill();
        
            context.strokeStyle = gradientBorder;
            context.stroke();
    
            context.closePath();
    
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = '#000000';
            context.shadowBlur = 15;
    
            const imageW = radius;
            const imageH = imageW;
            const imageX = centerX - imageW / 2;
            const imageY = centerY - imageH / 2;
    
            if(button.disabled) {
                context.filter = 'grayscale(1)';
            }

            context.drawImage(button.image, imageX, imageY, imageW, imageH);
        
            context.restore();
        }
    }

    //#endregion
}