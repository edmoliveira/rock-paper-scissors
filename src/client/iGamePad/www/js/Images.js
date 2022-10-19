const factoryImages = (url) => {
    "use strict";

    const _url = url;
    const _scissors = new ImageExt();
    const _rock = new ImageExt();
    const _paper = new ImageExt();

    class Images {
        get rock() { return _rock; }
        get scissors() { return _scissors; }
        get paper() { return _paper; }

        constructor() {
            _rock.src = _url + '/rock.png'
            _scissors.src = _url + '/scissors.png'
            _paper.src = _url + '/paper.png'
        }
    }

    const oImages = new Images();

    Object.freeze(oImages);

    return oImages;
};
Object.freeze(factoryImages);

class ImageExt extends Image {
    isLoad = false;

    constructor(w, h) {
        super(w, h);

        this.onload = () => this.isLoad = true;
    }
}