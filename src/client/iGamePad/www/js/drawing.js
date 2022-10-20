function Drawing(oImages) {
    "use strict";

    //#region Fiedls

    const _self = this;
    const _oImages = oImages;

    //#endregion

    //#region Methods public

    _self.draw = function (context, x, y, w, h, buttons, label, stopButton) {

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

        buttonDraw(context, stopButton);

        const labelW = w * 0.7;
        const labelH = h * 0.5;
        const labelX = w / 2 - labelW / 2;
        const labelY = y + h / 2;

        labelDraw(context, labelX, labelY, labelW, labelH, label);
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

            if(button.hasImage) {
                const imageW = radius;
                const imageH = imageW;
                const imageX = centerX - imageW / 2;
                const imageY = centerY - imageH / 2;

                context.shadowOffsetX = 2;
                context.shadowOffsetY = 2;
                context.shadowColor = '#000000';
                context.shadowBlur = 15;

                if(button.disabled) {
                    context.filter = 'grayscale(1)';
                }

                context.drawImage(button.image, imageX, imageY, imageW, imageH);
            }
            else {
                const imageW = radius * 0.7;
                const imageH = imageW;
                const imageX = centerX - imageW / 2;
                const imageY = centerY - imageH / 2;

                context.shadowOffsetX = 2;
                context.shadowOffsetY = 2;
                context.shadowColor = '#f0ebeb';
                context.shadowBlur = 1;

                if(button.disabled) {
                    context.fillStyle = 'gray';
                }
                else {
                    context.fillStyle = '#000000';    
                }
                
                context.fillRect(imageX, imageY, imageW, imageH);  
            }
        
            context.restore();
        }
    }

    function labelDraw(context, x, y, w, h, label) {
        const area = w * 2 + h * 2;

        const fontSize = area * 0.05;

        context.save();

        context.globalAlpha = label.alpha;

        context.beginPath();
    
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = '#FFFFFF';
        context.shadowBlur = 30;
    
        context.font = Math.round(fontSize) + "px fontG";
    
        let textW = context.measureText(label.text).width;
        let textX = x + w / 2 - textW / 2;
        let textY = y + fontSize / 2;
    
        context.fillStyle = '#000000';
        context.fillText(label.text, textX + fontSize * 0.03, textY + fontSize * 0.03);
    
        let gradientText = context.createLinearGradient(textX, textY, textX + textW, textY);
        gradientText.addColorStop(0.1, '#49FFFB');
        gradientText.addColorStop(0.5, '#00FF90');
        gradientText.addColorStop(0.9, '#49FFFB');
    
        context.fillStyle = gradientText;
        context.fillText(label.text, textX, textY);
    
        context.closePath();

        context.restore();
    }



    //#endregion
}