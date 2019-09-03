import 'phaser';
import uilab from '../assets/js/rexuiplugin.min.js'

const COLOR_PRIMARY = 0x4e342e;
const COLOR_DARK = 0x260e04;

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: uilab,
            sceneKey: 'rexUI'
        });      
    }

    create() {;

        var print1 = this.add.text(400, 0, '');
        this.rexUI.add.slider({
                x: 600,
                y: 300,
                width: 200,
                height: 20,
                orientation: 'y',

                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
                indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),

                input: 'click', // 'drag'|'click'
                valuechangeCallback: function (value) {
                    print1.text = value;
                },

            })
            .layout();
    }

    update() {}
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Demo
};

window.game = new Phaser.Game(config);