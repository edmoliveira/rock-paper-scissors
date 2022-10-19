function UtilGame() {
    "use strict";

    let self = this;

    Object.defineProperty(self, "currentDate", { get: function () { return new Date(); } });//2018,8,20, 9,12,35

    self.getwindowSize = function() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];

        let windowW = w.innerWidth || e.clientWidth || g.clientWidth;
        let windowH = w.innerHeight || e.clientHeight || g.clientHeight;

        return { width: windowW, height: windowH };
    }

    self.timeDiff = function (time1, time2) {
        return parseInt((time1.getTime() - time2.getTime()) / 1000);
    }

    self.timeDiff_M = function (time1, time2) {
        return parseInt((time1.getTime() - time2.getTime()));
    }

    self.searchAngleCircle = function (centerX, centerY, radius, angle) {
        let angleX = centerX + (radius * Math.cos(angle * Math.PI / 180));
        let angleY = centerY + (radius * Math.sin(angle * Math.PI / 180));

        return {
            x: angleX, y: angleY
        };
    }

    self.searchClickRect = function (element, mouseX, mouseY) {
        var x1 = element.x;
        var y1 = element.y;
        var x2 = element.x + element.width;
        var y2 = element.y + element.height;

        return (mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2);
    }

    self.searchClickCircle = function (element, mouseX, mouseY) {
        var x0 = mouseX;
        var x1 = element.centerX;

        var y0 = mouseY;
        var y1 = element.centerY;

        return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) < element.radius;
    }

    self.getTextSize = function (text, fontSize, fontFamily, bold) {
        let obj = document.getElementById('measureTextLabel');

        obj.innerHTML = text;
        obj.style.fontSize = fontSize + 'px';
        obj.style.fontFamily = fontFamily;
        obj.style.fontWeight = bold;

        return { width: obj.offsetWidth, height: obj.offsetHeight };
    }

    self.movePointAtAngle = function (angle, speed) {
        let newAngle = angle * Math.PI / 180;

        let posX = (speed * Math.cos(newAngle));
        let posY = (speed * Math.sin(newAngle));

        return { x: posX, y: posY };
    }

    self.hexToRgb = function (hexcolor) {
        let r = parseInt(hexcolor.substr(1, 2), 16);
        let g = parseInt(hexcolor.substr(3, 2), 16);
        let b = parseInt(hexcolor.substr(5, 2), 16);

        return { r: r, g: g, b: b };
    }

    self.rgbToHex = function (r, g, b) {
        return 'RGB(' + r + ',' + g + ',' + b + ')';
    }

    self.rgbaToHex = function (r, g, b, a) {
        return 'RGBA(' + r + ',' + g + ',' + b + ')';
    }

    self.rgbToHsl = function(r, g, b) {
        let r1 = r / 255;
        let g1 = g / 255;
        let b1 = b / 255;

        let maxColor = Math.max(r1, g1, b1);
        let minColor = Math.min(r1, g1, b1);

        let L = (maxColor + minColor) / 2;
        let S = 0;
        let H = 0;

        if (maxColor != minColor) {

            if (L < 0.5) {
                S = (maxColor - minColor) / (maxColor + minColor);
            } else {
                S = (maxColor - minColor) / (2.0 - maxColor - minColor);
            }

            if (r1 == maxColor) {
                H = (g1 - b1) / (maxColor - minColor);
            } else if (g1 == maxColor) {
                H = 2.0 + (b1 - r1) / (maxColor - minColor);
            } else {
                H = 4.0 + (r1 - g1) / (maxColor - minColor);
            }
        }

        L = L * 100;
        S = S * 100;
        H = H * 60;

        if (H < 0) {
            H += 360;
        }

        let objHsl = {
            hue: Math.round(H)
            , saturation: Math.round(S)
            , lightness: Math.round(L)
            , toString: function() {
                return 'hsl(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%)';
            }
        }

        return objHsl;
    }

    self.hslToRgb = function(h, s, l) {
        let r = 1;
        let g = 1;
        let b = 1;
        
        if (s === 0) {
            return { r: r, g: g, b: b };
        }

        h /= 360

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s
        let p = 2 * l - q;

        r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
        g = Math.round(hueToRgb(p, q, h) * 255);
        b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);

        return {
            r: r, g: g, b: b
        };
    }

    self.hsvToHsl = function(h,s,v) {
        let hue = h;
        let sat = s / 100;
        let val = v / 100;

        function round(value) {
            return Math.round(value * 100);
        }

        return[
            hue,
            round(sat*val/((hue=(2-sat)*val)<1?hue:2-hue)), 
            round(hue/2)
        ];
    }

    self.getValueScale = function (value, stageW, stageH) {
        let widthOrig = 640;
        let heightOrig = 360;

        let areaOrig = (widthOrig * 2) + (heightOrig * 2);
        let areaCurrent = (stageW * 2) + (stageH * 2);

        return (areaCurrent * value) / areaOrig;
    }

    self.formatNumber = function(value) {
        return value != null ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : null;
    }

    function hueToRgb(p, q, t) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

        return p
    }

    self.createTimer = function () {
        return new timerUtil(self);
    }
}

function timerUtil(parent) {
    let self = this;

    let _lastTime;
    let _currentDate;

    self.begin = function (seconds) {
        _lastTime = new Date();
    }

    self.current = function () {
        _currentDate = new Date();
    }

    self.end = function () {
        _lastTime = _currentDate;
    }

    self.getValuePosition = function (velocity) {
        let delta = parent.timeDiff_M(_currentDate, _lastTime) / 1000; 
        
        return velocity * Math.min(delta, 0.1);
    }
}

function Recorder(_elCanvas) {
    const recording = record(_elCanvas, 10000)
    // play it on another video element
    var video$ = document.createElement('video')
    document.body.appendChild(video$)
    recording.then(url => video$.setAttribute('src', url) )
    
    // download it
    var link$ = document.createElement('a')
    
    recording.then(url => {
     link$.setAttribute('href', url) 
     link$.click()
    })

    function record(canvas, time) {
        var recordedChunks = [];
        return new Promise(function (res, rej) {
            var stream = canvas.captureStream(25 /*fps*/);
            
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm; codecs=vp9"
            });
            
            //ondataavailable will fire in interval of `time || 4000 ms`
            mediaRecorder.start(time || 4000);
    
            mediaRecorder.ondataavailable = function (event) {
                recordedChunks.push(event.data);
                 // after stop `dataavilable` event run one more time
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
    
            }
    
            mediaRecorder.onstop = function (event) {
                var blob = new Blob(recordedChunks, {type: "video/webm" });
                var url = URL.createObjectURL(blob);
                res(url);
            }
        })
    }
}

//Prototype
CanvasRenderingContext2D.prototype.fillTextCircle = function (text, x, y, radius, startRotation, distance) {
    //var numRadsPerLetter = 2 * Math.PI / text.length;
    this.save();
    this.translate(x, y);
    this.rotate(startRotation);

    for (var i = 0; i < text.length; i++) {
        this.save();
        this.rotate(i * distance);

        this.fillText(text[i], 0, -radius);
        this.restore();
    }
    this.restore();
}
//Prototype