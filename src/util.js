const directionEnum = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3
};
Object.freeze(directionEnum);

const gameEnum = {
    SCISSORS: 0,
    ROCK: 1,
    PAPER: 2,
    NULL: 3
};
Object.freeze(gameEnum);

const animationEnum = {
    NULL: 0,
    OPEN: 1,
    CLOSE: 2
};
Object.freeze(animationEnum);

function Timer() {
    let self = this;

    let _lastTime;
    let _currentDate;

    self.begin = function () {
        _lastTime = new Date();
    }

    self.current = function () {
        _currentDate = new Date();
    }

    self.end = function () {
        _lastTime = _currentDate;
    }

    self.getValuePosition = function (velocity) {
        let delta = timeDiff_M(_currentDate, _lastTime) / 1000; 
        
        return velocity * Math.min(delta, 0.1);
    }

    timeDiff = function (time1, time2) {
        return parseInt((time1.getTime() - time2.getTime()) / 1000);
    }

    timeDiff_M = function (time1, time2) {
        return parseInt((time1.getTime() - time2.getTime()));
    }
}