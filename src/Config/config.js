import 'phaser';
import BBCodeTextPlugin from 'phaser3-rex-notes/plugins/bbcodetext-plugin.js';
import TextEditPlugin from 'phaser3-rex-notes/plugins/textedit-plugin.js';
import InputTextPlugin from 'phaser3-rex-notes/plugins/inputtext-plugin.js';

export default {
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
    plugins: {
        global: [
            {
                key: 'BBCodeTextPlugin',
                plugin: BBCodeTextPlugin,
                start: true
            },
            {
                key: 'rexTextEdit',
                plugin: TextEditPlugin,
                start: true
            },
            {
                key: 'rexInputText',
                plugin: InputTextPlugin,
                start: true
            }
        ]
    }
};
