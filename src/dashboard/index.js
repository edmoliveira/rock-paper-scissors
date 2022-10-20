function Control() {
    const self = this;

    let socket;

    const oCanvas = document.querySelector('canvas');
    const context = oCanvas.getContext('2d');
    const backgroundImage = new Image();
    const personImage = new Image();
    const rockImage = new Image();
    const scissorsImage = new Image();
    const paperImage = new Image();
    const nullImage = new Image();
    const label = new Label();
    const player1 = new Player();
    const player2 = new Player();
    const oDrawing = new Drawing(self);
    const timer = new Timer();

    let _controlAnimation = animationEnum.NULL;
    
    let _wasStarted = false;
    let _startAlpha = 0;
    let _stoppedAlpha = 1;

    backgroundImage.src = 'images/background.png'
    personImage.src = 'images/person.png'
    rockImage.src = 'images/rock.png'
    scissorsImage.src = 'images/scissors.png'
    paperImage.src = 'images/paper.png'
    nullImage.src = 'images/null.png'

    self.startAlpha = () => {
        return _startAlpha;
    }

    self.stoppedAlpha = () => {
        return _stoppedAlpha;
    }

    self.wasStarted = () => {
        return _wasStarted;
    }

    self.getLabel = () => {
        return label;
    }

    self.getPlayer1 = () => {
        return player1;
    }

    self.getPlayer2 = () => {
        return player2;
    }

    self.getBackgroundImage = () => {
        return backgroundImage;
    }

    self.getPersonImage = () => {
        return personImage;
    }

    window.onload = () => {
        socket = io('http://127.0.0.1:3000');

        socket.on('connect', function () {
            _wasStarted = false;
            _controlAnimation = animationEnum.CLOSE;

            setTimeout(() => {
                socket.emit('addPlayer', '{"type": 0, "id": "", "name": ""}');
            }, 500);
        });

        socket.on('start', function (data) {
            const d = JSON.parse(data);

            player1.text = d.player1;
            player2.text = d.player2;

            player1.score = 0;
            player2.score = 0;

            _wasStarted = true;
            _controlAnimation = animationEnum.OPEN;
        });

        socket.on('stop', function () {
            _wasStarted = false;
            _controlAnimation = animationEnum.CLOSE;
        });

        socket.on('move', function (data) {
            const d = JSON.parse(data);
        
            if(d.player === 1) {
                setMove(player1, d.move);
            }
            else if(d.player === 2) {
                setMove(player2, d.move);
            }
        
            if(player1.move != null && player2.move != null) {
                const result = compare(player1.move, player2.move);
        
                player1.openAnimation1(result === 1, result === 0);
                player2.openAnimation1(result === 2, result === 0);
        
                if(result === 0) {
                    label.text = 'Tie Game';
                }
                else {                    
                    label.text = result === 1 ? player1.text : player2.text;
                }
            }
        });

        socket.on('disconnect', function() {
            _wasStarted = false;
            _controlAnimation = animationEnum.CLOSE;
        });

        timer.begin();

        resize();
        animation();
    };
    
    window.onresize = () => {
        resize();
        oDrawing.draw(oCanvas, context, self);
    };

    window.onbeforeunload = () => {
        if(socket != null) {
            socket.disconnect();
            socket = null;
        }
    };
    
    function setMove(player, move) {
        player.move = move;

        if(move === gameEnum.SCISSORS){
            player.image = scissorsImage;
        }
        else if(move === gameEnum.ROCK){
            player.image = rockImage;
        }
        else if(move === gameEnum.PAPER){
            player.image = paperImage;
        }
        else {
            player.image = nullImage;
        }
    }

    function resize() {
        let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];

        let windowW = w.innerWidth || e.clientWidth || g.clientWidth;
        let windowH = w.innerHeight || e.clientHeight || g.clientHeight;
    
        oCanvas.width = windowW;
        oCanvas.height = windowH;
    
        oCanvas.style.width = windowW + 'px';
        oCanvas.style.height = windowH + 'px';
    
        initialize();
    }

    function initialize() {
        label.fontSizeOriginal = 0;
        label.fontSizeDest = (oCanvas.width * 2 + oCanvas.height * 2) * 0.02;
        label.fontSize = label.fontSizeOriginal;
        label.onEndAnimation = () => {
            setMove(player1, null);
            setMove(player2, null);

            if(socket != null) {
                socket.emit('canPlay', true);
            }
        }

        const personAreaW = oCanvas.width / 3;
    
        const containerW = personAreaW / 2;
        const containerX1 = personAreaW;
        const containerX2 = personAreaW + containerW;
    
        const playerCenterX1 = containerX1 + containerW / 3.1;
        const playerCenterX2 = containerX2 + containerW / 1.4;
        const playerCenterY = oCanvas.height * 0.75;
        const playerRadius = (containerW * 2 + oCanvas.height * 2) * 0.07;
    
        player1.text = 'Player 1';
        player1.direction = directionEnum.RIGHT;
        player1.centerX = playerCenterX1;
        player1.centerXInitial = playerCenterX1;
        player1.centerXDest = oCanvas.width / 2;
        player1.centerY = playerCenterY;
        player1.radius = 0;
        player1.radiusInitial = 0;
        player1.radiusDest = playerRadius;
        player1.image = nullImage;
        player1.onWinner = () => {            
            player1.openAnimation2();
            label.openAnimation();
        }
        player1.onClose = () => {
            player1.closeAnimation1();            
        }

        player2.text = 'Player 2';
        player2.direction = directionEnum.LEFT;
        player2.centerX = playerCenterX2;
        player2.centerXInitial = playerCenterX2;
        player2.centerXDest = oCanvas.width / 2;
        player2.centerY = playerCenterY;
        player2.radius = 0;
        player2.radiusInitial = 0;
        player2.radiusDest = playerRadius;
        player2.image = nullImage;
        player2.onWinner = () => {            
            player2.openAnimation2();
            label.openAnimation();
        }
        player2.onClose = isTIe => {
            player2.closeAnimation1();

            if(isTIe){
                label.openAnimation();
            }
        }
    }
    
    function animation() {
        timer.current();

        context.clearRect(0, 0, oCanvas.width, oCanvas.height);

        executeControlAnimation();

        executePlayerAnimation1(player1);
        executePlayerAnimation1(player2);

        executePlayerAnimation2(player1);
        executePlayerAnimation2(player2);

        labelAnimation(label);

        oDrawing.draw(oCanvas, context);

        timer.end();
    
        requestAnimationFrame(animation);
    }

    executeControlAnimation = function() {
        const value = timer.getValuePosition(getValueScale(1));

        if(_controlAnimation === animationEnum.OPEN) {
            _stoppedAlpha -= value;
            _startAlpha += value;

            if(_startAlpha >= 1) {
                _stoppedAlpha = 0;
                _startAlpha = 1;
                _controlAnimation = animationEnum.NULL;

                if(socket != null) {
                    socket.emit('canPlay', true);
                }
            }
        }
        else if(_controlAnimation === animationEnum.CLOSE) {
            _stoppedAlpha += value;
            _startAlpha -= value;

            if(_stoppedAlpha >= 1) {
                _stoppedAlpha = 1;
                _startAlpha = 0;
                _controlAnimation = animationEnum.NULL;
            }
        }
    }

    executePlayerAnimation1 = function(player) {
        const anim1Velocity = getValueScale(400);

        if(player.animation1 === animationEnum.OPEN) {
            if(player.radius >= player.radiusDest) {
                player.radius = player.radiusDest;
                player.finishAnimation1();
            }
            else {
                player.radius += timer.getValuePosition(anim1Velocity);
            }
        }
        else if(player.animation1 === animationEnum.CLOSE) {
            if(player.radius <= player.radiusInitial) {
                player.radius = player.radiusInitial;
                player.finishAnimation1();
            }
            else {
                player.radius -= timer.getValuePosition(anim1Velocity);
            }
        }
    }

    executePlayerAnimation2 = function(player) {
        const anim1Velocity = getValueScale(400);

        if(player.animation2 === animationEnum.OPEN) {
            if(player.direction === directionEnum.RIGHT){
                if(player.centerX >= player.centerXDest) {
                    player.centerX = player.centerXDest;
                    player.finishAnimation2();
                }
                else {
                    player.centerX += timer.getValuePosition(anim1Velocity);
                }
            }
            else {
                if(player.centerX <= player.centerXDest) {
                    player.centerX = player.centerXDest;
                    player.finishAnimation2();
                }
                else {
                    player.centerX -= timer.getValuePosition(anim1Velocity);
                }
            }
        }
        else if(player.animation2 === animationEnum.CLOSE) {
            if(player.radius <= player.radiusInitial) {
                player.centerX = player.centerXInitial;
                player.radius = player.radiusInitial;
                player.finishAnimation2();
            }
            else {
                player.radius -= timer.getValuePosition(anim1Velocity);
            }
        }
    }

    labelAnimation = function(lbl) {
        const anim1Velocity = getValueScale(400);

        if(lbl.animation === animationEnum.OPEN) {
            if(lbl.fontSize >= lbl.fontSizeDest) {
                lbl.fontSize = lbl.fontSizeDest;
                lbl.finishAnimation();
            }
            else {
                lbl.fontSize += timer.getValuePosition(anim1Velocity);
            }
        }
        else if(lbl.animation === animationEnum.CLOSE) {
            if(lbl.fontSize <= lbl.fontSizeOriginal) {
                lbl.fontSize = lbl.fontSizeOriginal;
                lbl.finishAnimation();
            }
            else {
                lbl.fontSize -= timer.getValuePosition(anim1Velocity);
            }
        }
    }

    getValueScale = function (value) {
        let widthOrig = 640;
        let heightOrig = 360;

        let areaOrig = (widthOrig * 2) + (heightOrig * 2);
        let areaCurrent = (oCanvas.width * 2) + (oCanvas.height * 2);

        return (areaCurrent * value) / areaOrig;
    }
    
    compare = (jog1, jog2) => jog1 === jog2 ? 0 : (jog2 + 1) % 3 === jog1 ? 1 : 2;
}

new Control();