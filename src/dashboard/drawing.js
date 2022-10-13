function Drawing(control) {
    const _control = control;

    this.draw = function(oCanvas, ctx) {
        ctx.drawImage(_control.getBackgroundImage(), 0, 0, oCanvas.width, oCanvas.height);
    
        const titleW = oCanvas.width * 0.5;
        const titleH = oCanvas.height * 0.3;
        const titleX = oCanvas.width / 2 - titleW / 2;
        const titleY = 0;
    
        titleDraw(ctx, titleX, titleY, titleW, titleH, 'Rock Paper Scissors')
    
        const personAreaW = oCanvas.width / 3;
        const personAreaH = oCanvas.height / 2;
        const personArea = personAreaW * 2 + personAreaH * 2;
    
        const personW = personArea * 0.15;
        const personH = personArea * 0.2;
        const personX1 = personAreaW / 2 - personW / 2;
        const personX2 = (personAreaW * 2) + (personAreaW / 2 - personW / 2);
        const personY = oCanvas.height / 2 - personH / 2;
    
        ctx.save();

        ctx.globalAlpha = _control.startAlpha();

        personDraw(ctx, personX1, personY, personW, personH, _control.getPlayer1().text);
        personDraw(ctx, personX2, personY, personW, personH, _control.getPlayer2().text);        

        playerDraw(ctx, _control.getPlayer1());
        playerDraw(ctx, _control.getPlayer2());

        ctx.restore();

        ctx.save();

        ctx.globalAlpha = _control.stoppedAlpha();

        const stoppedW = oCanvas.width * 0.7;
        const stoppedY = oCanvas.height * 0.9;
        const stoppedX = oCanvas.width / 2 - stoppedW / 2;

        stoppedDraw(ctx, stoppedX, stoppedW, stoppedY, 'Waiting...');

        ctx.restore();

        const resultW = oCanvas.width * 0.4;
        const resultY = oCanvas.height * 0.8;
        const resultX = oCanvas.width / 2 - resultW / 2;

        resultDraw(ctx, resultX, resultW, resultY, _control.getLabel());
    }

    function stoppedDraw(ctx, x, w, y, text){    
        const fontSize = w * 0.1;

        ctx.save();

        ctx.beginPath();
    
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 30;
    
        ctx.font = Math.round(fontSize) + "px fontG";
    
        let textW = ctx.measureText(text).width;
        let textX = x + w / 2 - textW / 2;
        let textY = y;
    
        ctx.fillStyle = '#000000';
        ctx.fillText(text, textX + fontSize * 0.03, textY + fontSize * 0.03);
    
        let gradientText = ctx.createLinearGradient(textX, textY, textX + textW, textY);
        gradientText.addColorStop(0.1, '#49FFFB');
        gradientText.addColorStop(0.5, '#00FF90');
        gradientText.addColorStop(0.9, '#49FFFB');
    
        ctx.fillStyle = gradientText;
        ctx.fillText(text, textX, textY);
    
        ctx.closePath();

        ctx.restore();
    }

    function resultDraw(ctx, x, w, y, label){    
        const fontSize = label.fontSize;
        const text = label.text;

        ctx.save();

        ctx.beginPath();
    
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 30;
    
        ctx.font = Math.round(fontSize) + "px fontG";
    
        let textW = ctx.measureText(text).width;
        let textX = x + w / 2 - textW / 2;
        let textY = y;
    
        ctx.fillStyle = '#000000';
        ctx.fillText(text, textX + fontSize * 0.03, textY + fontSize * 0.03);
    
        let gradientText = ctx.createLinearGradient(textX, textY, textX + textW, textY);
        gradientText.addColorStop(0.1, '#49FFFB');
        gradientText.addColorStop(0.5, '#00FF90');
        gradientText.addColorStop(0.9, '#49FFFB');
    
        ctx.fillStyle = gradientText;
        ctx.fillText(text, textX, textY);
    
        ctx.closePath();

        ctx.restore();
    }
    
    function titleDraw(ctx, x, y, w, h, text){    
        const fontSize = w * 0.1;
    
        ctx.save();

        ctx.beginPath();
    
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 30;
    
        ctx.font = Math.round(fontSize) + "px fontG";
    
        let textW = ctx.measureText(text).width;
        let textX = x + w / 2 - textW / 2;
        let textY = y + fontSize * 1.2;
    
        ctx.fillStyle = '#000000';
        ctx.fillText(text, textX + fontSize * 0.03, textY + fontSize * 0.03);
    
        let gradientText = ctx.createLinearGradient(textX, textY, textX + textW, textY);
        gradientText.addColorStop(0.1, '#49FFFB');
        gradientText.addColorStop(0.5, '#00FF90');
        gradientText.addColorStop(0.9, '#49FFFB');
    
        ctx.fillStyle = gradientText;
        ctx.fillText(text, textX, textY);
    
        ctx.closePath();

        ctx.restore();
    }
    
    function personDraw(ctx, x, y, w, h, text){
        const imageH = h * 0.8;
        
        const fontSize = (w * 2 + (h * 0.2) * 2) * 0.08;
    
        ctx.save();

        ctx.beginPath();
    
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 30;
    
        ctx.drawImage(_control.getPersonImage(), x, y, w, imageH);
    
        ctx.font = Math.round(fontSize) + "px 'Lucida Console'";
    
        let textW = ctx.measureText(text).width;
        let textX = x + w / 2 - textW / 2;
        let textY = (y + h * 0.8) + fontSize * 1.2;
    
        ctx.fillStyle = '#000000';
        ctx.fillText(text, textX + textW * 0.01, textY + fontSize * 0.02);
    
        let gradientText = ctx.createLinearGradient(textX, textY, textX + textW, textY);
        gradientText.addColorStop(0.1, '#49FFFB');
        gradientText.addColorStop(0.5, '#00FF90');
        gradientText.addColorStop(0.9, '#49FFFB');
    
        ctx.fillStyle = gradientText;
        ctx.fillText(text, textX, textY);
    
        ctx.closePath();

        ctx.restore();
    }
    
    function playerDraw(ctx, obj) {
        const radius = obj.radius > 0 ? obj.radius : 0;

        ctx.save();
    
        ctx.beginPath();

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = '#002112';
        ctx.shadowBlur = 30;

        const x1 = obj.centerX - radius;
        const y1 = obj.centerY - radius;
        const x2 = obj.centerX + radius;
        const y2 = obj.centerY + radius;
    
        ctx.lineWidth = radius * 0.1;

        const gradientBack = ctx.createLinearGradient(x1, y1, x2, y2);
        gradientBack.addColorStop(0.1, '#008245');
        gradientBack.addColorStop(0.5, '#00FF90');
    
        const gradientBorder = ctx.createLinearGradient(x1, y1, x2, y2);
        gradientBorder.addColorStop(0.1, '#00FF90');
        gradientBorder.addColorStop(0.5, '#008245');
    
        ctx.arc(obj.centerX, obj.centerY, radius, 0, 2 * Math.PI);
    
        ctx.fillStyle = gradientBack;
        ctx.fill();
    
        ctx.strokeStyle = gradientBorder;
        ctx.stroke();

        ctx.closePath();

        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 15;

        const imageW = radius;
        const imageH = imageW;
        const imageX = obj.centerX - imageW / 2;
        const imageY = obj.centerY - imageH / 2;

        ctx.drawImage(obj.image, imageX, imageY, imageW, imageH);
    
        ctx.restore();
    }
}