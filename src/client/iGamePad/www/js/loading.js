function LoadingGame(objDrawingArea) {
    "use strict";

    let self = this;

    let context = objDrawingArea.getContext("2d");

    let diameter = 0;
    let circleX = 0;
    let circleY = 0;

    let stringTextLoading = "L o a d i n g...";

    let animationFrame = null;
    let countText = 0;
    let shadowBlurText = 5;
    let shadowBlurDirection = 0;

    let propellerAngle = 0;
    let countPropellerAngle = 0;
    let timePropellerAngle = 0;
    let sleepPropellerAngle = false;

    let timerAnimation = 0;

    self.refresh = function () {
        diameter = objDrawingArea.width < objDrawingArea.height ? objDrawingArea.width : objDrawingArea.height;

        circleX = objDrawingArea.width / 2;
        circleY = objDrawingArea.height / 1.75;
    }

    self.initialize = function() {
        animationFrame = setInterval(executeAnimationFrame, 10);
    }

    self.kill = function () {
        clearInterval(animationFrame);
    }

    function executeAnimationFrame() {
        if (timerAnimation >= 200) {
            timerAnimation = 0;
            if (countText === 0) {
                stringTextLoading = "L o a d i n g   ";
                countText = 1;
            }
            else if (countText === 1) {
                stringTextLoading = "L o a d i n g.  ";
                countText = 2;
            }
            else if (countText === 2) {
                stringTextLoading = "L o a d i n g.. ";
                countText = 3;
            }
            else if (countText === 3) {
                stringTextLoading = "L o a d i n g...";
                countText = 0;
            }

            if (shadowBlurDirection === 0) {
                shadowBlurText += 5;

                if (shadowBlurText > 20) {
                    shadowBlurDirection = 1;
                }
            }
            else {
                shadowBlurText -= 5;

                if (shadowBlurText < 5) {
                    shadowBlurDirection = 0;
                }
            }
        }

        timerAnimation += 10;

        if (!sleepPropellerAngle) {
            propellerAngle += 5;
            countPropellerAngle += 1;

            if (countPropellerAngle === 45) {
                countPropellerAngle = 0;
                sleepPropellerAngle = true;
            }

            if (propellerAngle === 360) {
                propellerAngle = 0;
            }
        }
        else {
            timePropellerAngle += 1;

            if (timePropellerAngle > 40) {
                timePropellerAngle = 0;
                sleepPropellerAngle = 0;
            }
        }

        draw();
    }

    function draw() {      
        context.beginPath();

        createLoadingFont();

        context.fillStyle = '#050e40';
        context.fillRect(0, 0, objDrawingArea.width, objDrawingArea.height);

        let backY1 = objDrawingArea.height * 0.8;
        let backY2 = objDrawingArea.height * 0.75;

        context.moveTo(0, backY1);
        context.bezierCurveTo(0, backY2, objDrawingArea.width, backY2, objDrawingArea.width, backY1);
        context.lineTo(objDrawingArea.width, objDrawingArea.height)
        context.lineTo(0, objDrawingArea.height);
        context.lineTo(0, backY1);        
        
        let gradH = objDrawingArea.height - backY1;

        let gradientBack = context.createLinearGradient(0, backY1, 0, backY1 + gradH * 0.9);

        gradientBack.addColorStop(0, "#050e40");
        gradientBack.addColorStop(1, "#1127a1");

        context.fillStyle = gradientBack;
        context.fill();

        context.closePath();

        createTextLoading();
        
        createFirstCircle();

        createSecondCircle();

        context.save();
        createlittleCircle(0);
        createlittleCircle(90);
        createlittleCircle(180);
        createlittleCircle(270);
        createLinesCircle();
        context.restore();
        
        createCircleRect()

        createCenterCircle(0.35, 0.42, true);

        createCenterCircle(0.30, 0.38);

        context.save();

        let propellerLenght = diameter * 0.8;

        let rotationX = circleX;// + (propellerLenght / 2);
        let rotationY = circleY;// + (propellerLenght / 2);

        context.translate(rotationX, rotationY);
        context.rotate(propellerAngle * Math.PI / 180);
        context.translate(-rotationX, -rotationY);

        createPropeller(245.5, 202.5);
        createPropeller(294.5, 337.5);
        createPropeller(22.5, 67.5);
        createPropeller(114.5, 157.5);

        context.restore();

        createScrew()
    }

    function createLoadingFont() {
        context.save();
        context.beginPath();

        let fontSize = (objDrawingArea.width * 0.08);

        context.font = fontSize + 'px fontG';
        context.fillStyle = "#00F0F0";
        context.fillText(stringTextLoading, 0, fontSize * 0.85);

        context.font = fontSize + 'px viperSquadronSolid';
        context.fillStyle = "#00F0F0";
        context.fillText(stringTextLoading, 0, fontSize * 0.85);

        context.font = fontSize + 'px amazDooMLeft';
        context.fillStyle = "#00F0F0";
        context.fillText(stringTextLoading, 0, fontSize * 0.85);

        context.font = fontSize + 'px stencilArmy';
        context.fillStyle = "#00F0F0";
        context.fillText(stringTextLoading, 0, fontSize * 0.85);

        context.font = fontSize + 'px joystick';
        context.fillStyle = "#00F0F0";
        context.fillText(stringTextLoading, 0, fontSize * 0.85);

        context.closePath();
        context.restore();
    }

    function createTextLoading() {
        context.save();
        context.beginPath();

        let fontSize = (objDrawingArea.width * 0.08);

        context.font = fontSize + 'px viperSquadronSolid';
        
        context.lineWidth = 2;

        context.shadowColor = '#00ffff';
        context.shadowBlur = shadowBlurText;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        let x = objDrawingArea.width / 2 - context.measureText(stringTextLoading).width / 2;

        context.fillStyle = "#00F0F0";
        context.fillText(stringTextLoading, x, fontSize * 0.85);

        context.closePath();
        context.restore();
    }

    function createFirstCircle() {
        context.save();
        context.beginPath();

        context.setLineDash([4, 4, 1]);

        context.arc(circleX, circleY, (diameter * 0.8) / 2, 0, 1.5 * Math.PI);

        context.lineWidth = 1;

        context.strokeStyle = '#00ffff';
        context.stroke();

        context.closePath();

        context.beginPath();

        let x = circleX - ((diameter * 0.8) / 2);

        context.moveTo(x, circleY);
        context.lineTo(x * 0.9, circleY);
        context.lineTo(x * 0.8, circleY * 1.2);
        context.lineTo(0, circleY * 1.2);

        context.moveTo(x, circleY);
        context.lineTo(x * 0.9, circleY);
        context.lineTo(x * 0.8, circleY - circleY * 0.2);
        context.lineTo(0, circleY - circleY * 0.2);

        x = circleX + ((diameter * 0.8) / 2);
        let lastWidth = objDrawingArea.width - x;

        context.moveTo(x, circleY);
        context.lineTo(x + lastWidth * 0.1, circleY);
        context.lineTo(x + lastWidth * 0.2, circleY * 1.2);
        context.lineTo(objDrawingArea.width, circleY * 1.2);

        context.moveTo(x, circleY);
        context.lineTo(x + lastWidth * 0.1, circleY);
        context.lineTo(x + lastWidth * 0.2, circleY - circleY * 0.2);
        context.lineTo(objDrawingArea.width, circleY - circleY * 0.2);

        context.lineWidth = 1;

        context.strokeStyle = '#00ffff';
        context.stroke();

        context.closePath();
        context.restore();
    }

    function createSecondCircle() {
        context.beginPath();

        context.arc(circleX, circleY, (diameter * 0.6) / 2, 1, 2 * Math.PI);

        context.lineWidth = 1;

        context.strokeStyle = '#00ffff';
        context.stroke();

        context.closePath();
    }

    function createlittleCircle(angleInDegrees) {
        let radius = (diameter * 0.7) / 2;

        let origX = circleX;
        let origY = circleY;

        let x = (radius * Math.cos(angleInDegrees * Math.PI / 180)) + origX;
        let y = (radius * Math.sin(angleInDegrees * Math.PI / 180)) + origY;

        context.beginPath();

        context.shadowColor = '#41fbfb';
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.arc(x, y, (diameter * 0.05) / 2, 0, 2 * Math.PI);

        context.fillStyle = '#00ffff';
        context.fill();

        context.closePath();

        context.beginPath();

        context.arc(x, y, (diameter * 0.045) / 2, 0, 2 * Math.PI);

        context.fillStyle = '#050e40';
        context.fill();

        context.closePath();
    }

    function createLinesCircle() {
        context.lineWidth = 3;
        context.strokeStyle = '#00ffff';

        context.beginPath();
        context.arc(circleX, circleY, (diameter * 0.7) / 2, 1.07 * Math.PI, 1.42 * Math.PI);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(circleX, circleY, (diameter * 0.7) / 2, 1.58 * Math.PI, 1.93 * Math.PI);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(circleX, circleY, (diameter * 0.7) / 2, 0.07 * Math.PI, 0.43 * Math.PI);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(circleX, circleY, (diameter * 0.7) / 2, 0.58 * Math.PI, 0.93 * Math.PI);
        context.stroke();
        context.closePath();
    }

    function createCircleRect() {
        context.save();

        context.beginPath();

        context.globalAlpha = 0.2;

        context.arc(circleX, circleY, (diameter * 0.5) / 2, 0, 2 * Math.PI);

        context.lineWidth = (diameter * 0.04);

        context.strokeStyle = '#66FFC2';
        context.stroke();

        context.closePath();

        context.beginPath();

        context.globalAlpha = 1;

        context.shadowColor = '#41fbfb';
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        createLinesCircleRectX_Y(0);
        createLinesCircleRectX_Y(45);
        createLinesCircleRectX_Y(90);
        createLinesCircleRectX_Y(135);
        createLinesCircleRectX_Y(180);
        createLinesCircleRectX_Y(225);
        createLinesCircleRectX_Y(270);
        createLinesCircleRectX_Y(315);

        context.lineWidth = 2;

        context.strokeStyle = '#66FFC2';
        context.stroke();

        context.closePath();

        context.beginPath();

        context.arc(circleX, circleY, (diameter * 0.46) / 2, 0, 2 * Math.PI);

        context.fillStyle = '#050e40';
        context.fill();

        context.closePath();

        context.restore();
    }

    function createLinesCircleRectX_Y(angleInDegrees) {
        let radius = (diameter * 0.54) / 2;

        let origX = circleX;
        let origY = circleY;

        let x = (radius * Math.cos(angleInDegrees * Math.PI / 180)) + origX;
        let y = (radius * Math.sin(angleInDegrees * Math.PI / 180)) + origY;

        context.moveTo(origX, origY);
        context.lineTo(x, y);
    }

    function createCenterCircle(percDiameter1, percDiameter2, iSstroke) {
        context.save();

        context.beginPath();

        if (!iSstroke) {
            context.globalAlpha = 0.5;
        }

        context.shadowColor = '#41fbfb';
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.arc(circleX, circleY, (diameter * percDiameter1) / 2, 1 * Math.PI, 0.5 * Math.PI);

        let point1 = getPointCenterCircle(180, percDiameter1);

        let point2 = getPointCenterCircle(165, percDiameter2);
        let point3 = getPointCenterCircle(105, percDiameter2);

        let point4 = getPointCenterCircle(90, percDiameter1);

        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.lineTo(point3.x, point3.y);
        context.lineTo(point4.x, point4.y);

        if (iSstroke) {
            context.lineWidth = 1;

            context.strokeStyle = '#66FFC2';
            context.stroke();
        }
        else {
            context.fillStyle = '#66FFC2';
            context.fill();
        }

        context.closePath();

        context.restore();
    }

    function createPropeller(angle1, angle2) {
        context.beginPath();

        context.globalAlpha = 0.1;

        let pointLine1 = getPointCenterCircle(angle1, 0.77);
        let pointLine2 = getPointCenterCircle(angle2, 0.77);

        let pointCurve1 = getPointCenterCircle(angle1, 0.89);
        let pointCurve2 = getPointCenterCircle(angle2, 0.89);

        context.moveTo(circleX, circleY);
        context.lineTo(pointLine1.x, pointLine1.y);

        context.bezierCurveTo(pointCurve1.x, pointCurve1.y, pointCurve2.x, pointCurve2.y, pointLine2.x, pointLine2.y)
        context.lineTo(circleX, circleY);

        context.lineWidth = 1;

        context.fillStyle = '#FFFFFF';
        context.fill();

        context.closePath();
    }

    function createScrew() {
        context.save();

        context.beginPath();

        context.shadowColor = '#01115F';
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.arc(circleX, circleY, (diameter * 0.02) / 2, 0, 2 * Math.PI);

        context.fillStyle = '#01115F';
        context.fill();

        context.closePath();

        context.beginPath();

        context.arc(circleX, circleY, (diameter * 0.015) / 2, 0, 2 * Math.PI);

        context.fillStyle = '#66FFC2';
        context.fill();

        context.closePath();
        context.restore();
    }

    function getPointCenterCircle(angleInDegrees, percDiameter) {
        let radius = (diameter * percDiameter) / 2;

        let origX = circleX;
        let origY = circleY;

        let x = (radius * Math.cos(angleInDegrees * Math.PI / 180)) + origX;
        let y = (radius * Math.sin(angleInDegrees * Math.PI / 180)) + origY;

        return { x: x, y: y };
    }
}