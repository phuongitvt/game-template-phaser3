import 'phaser';
import DragRotatePlugin from 'phaser3-rex-notes/plugins/dragrotate-plugin.js';
import YoutubePlayerPlugin from 'phaser3-rex-notes/plugins/youtubeplayer-plugin.js'

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
    }

    create() {
        var graphics = this.add.graphics();


    graphics.lineStyle(4, 0xff00ff, 1);

    //  Without this the arc will appear closed when stroked
    graphics.beginPath();

    // arc (x, y, radius, startAngle, endAngle, anticlockwise)
    graphics.arc(400, 300, 200, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(180), true);

    //  Uncomment this to close the path before stroking
    // graphics.closePath();

    graphics.strokePath();
    }

    update() { }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true
    },
    scene: Demo,
    plugins: {
        global: [{
            key: 'rexYoutubePlayer',
            plugin: YoutubePlayerPlugin,
            start: true
        }]
    }
};

window.game = new Phaser.Game(config);