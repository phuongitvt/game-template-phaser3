import 'phaser';
import io from 'socket.io-client';
import 'phaser';
import Button from '../Objects/ButtonReady';
import UIPlugin from '../../assets/js/rexuiplugin.min.js';
import { runInThisContext } from 'vm';

var socket;
const COLOR_PRIMARY = 0x950000;
const COLOR_DARK = 0xffffff;

function objectPlayer(id) {
  this.position;
  this.id = id;
  this.cards = {};
  this.xPlayer;
  this.yPlayer;
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.groupCards;
    this.groupOtherCards;
    this.ortherLayers = {};
    this.playergame = {};
    this.allPlayers = {};
    this.positionArr = {
      "1": {
        "x": 700,
        "y": 410,
        "hold": false,
        "key": 1,
        "player": 0
      },
      "2": {
        "x": 700,
        "y": 100,
        "hold": false,
        "key": 2,
        "player": 0
      },
      "3": {
        "x": 50,
        "y": 100,
        "hold": false,
        "key": 3,
        "player": 0
      },
      "4": {
        "x": 50,
        "y": 410,
        "hold": false,
        "key": 4,
        "player": 0
      }
    }
  }

  preload() {
    // load images
    this.load.scenePlugin(
      {
        key: 'rexuiplugin',
        url: UIPlugin,
        sceneKey: 'rexUI'
      }
    );
  }

  create() {


    //khoi tao all players
    socket = io('http://localhost:3000');
    this.add.image(400, 300, 'background');

    const self = this;

    this.groupCards = this.add.group();
    this.groupOtherCards = this.add.group();

    socket.on('newPlayer', function (data) {
      console.log(self.playergame);
      console.log(Object.keys(self.playergame).length);
      let playerData = data.players;
      Object.values(playerData).forEach(function (item, index) {
        console.log(index);
        if (item.id === socket.id && Object.keys(self.playergame).length === 0) {
          self.addPlayer(item, self);
        } else if(item.id != socket.id) {
          if (!(item.id in self.allPlayers)){
            //tao moi player sau do cho vao danh sach
            let newPlayer = new objectPlayer(item.id);  

            let flag = false;
            //kiem tra vi tri con trong
            Object.values(self.positionArr).forEach(function (itemPos,indexPos) {
              if (itemPos.hold == false && flag === false) {
                flag = true;
                itemPos.hold = true;
                newPlayer.position = itemPos.key;
                newPlayer.xPlayer = itemPos.x;
                newPlayer.yPlayer = itemPos.y;
              }
            });
            self.allPlayers[item.id] = newPlayer;
            self.addOthersLayer(newPlayer, { xPlayer: newPlayer.xPlayer, yPlayer: newPlayer.yPlayer }, self);
          }          
        }
      });
    });
    socket.on('disconnect',function(id){
      console.log(id);
      console.log('co nguoi disconnect');
        if(id in self.allPlayers){
          const item = self.allPlayers[id];
          self.positionArr[item.position].hold = false;
          console.log("thanh cong rui");

          //lam trong vi tri trong danh sach vi tri

          
          ///delete data player
          delete self.allPlayers[id];
          self.ortherLayers[id].visible = false;

          ///delete container show player
          delete self.ortherLayers[id];
          
        }
    });
    socket.on('turnReadyButton',function(data){
      self.readylButton.visible = true;
    })
  }

  addPlayer(item, position, self) {  
    //add container layer
    this.containerPlayer = this.add.container(360, 400);
    //cards
    const cards = this.add.sprite(0, 0, 'atlasBai', 'green_back.png').setScale(0.4, 0.4).setInteractive();
    const cards1 = this.add.sprite(40, 0, 'atlasBai', 'green_back.png').setScale(0.4, 0.4).setInteractive();
    //avata
    const avatar = this.add.sprite(0, 100, 'user');
    //name
    const text = this.add.text(35, 80, 'User', {
      fontFamily: '"Roboto Condensed"',
      color: 'black',
      fixedWidth: '50',
      fixedHeight: '20',
      align: 'center'
    });
    var graphics = this.add.graphics(0, 0)
    graphics.lineStyle(1, 0x0e0e0e)
    graphics.fillStyle(0xffcc00, 1);
    graphics.strokeRoundedRect(text.x, text.y, 50, 20, 4)
    graphics.fillRoundedRect(text.x, text.y, 50, 20, 4)
    //money
    const text1 = this.add.text(35, 110, '$1000', {
      fontFamily: '"Roboto Condensed"',
      color: 'white',
      fixedWidth: '50',
      fixedHeight: '20',
      align: 'center'
    });
    var graphics1 = this.add.graphics(0, 0)
    graphics1.lineStyle(1, 0x0e0e0e)
    graphics1.fillStyle(0x990000, 1);
    graphics1.strokeRoundedRect(text1.x, text1.y, 50, 20, 10)
    graphics1.fillRoundedRect(text1.x, text1.y, 50, 20, 10)

    //message
    const message = this.add.sprite(0, 160, 'message');
    const textMessage = this.add.text(-25, 150, 'All in', {
      fontFamily: '"Roboto Condensed"',
      color: 'black',
      fixedWidth: '50',
      fixedHeight: '50',
      align: 'center'
    })
    message.visible = false;
    textMessage.visible = false;

    //add player
    var qwe = this.add.graphics();   
    qwe.lineStyle(10, 0xff00ff, 1);

      //  Without this the arc will appear closed when stroked
      qwe.beginPath();

      // arc (x, y, radius, startAngle, endAngle, anticlockwise)
      qwe.arc(avatar.x, avatar.y, 50, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), true);

      //  Uncomment this to close the path before stroking
      //graphics.closePath();

      qwe.strokePath();
    

    this.containerPlayer.add([cards, avatar, cards1, graphics, text, graphics1, text1, message, textMessage,qwe]);
    this.addMenuThisPlayer();
    this.playergame[item.id] = this.containerPlayer;
    this.callCirlce(qwe,avatar);
  }


  addMenuThisPlayer() {
    const self = this;

    this.readylButton = new Button(this, 360, 570, 'blueButton1', 'blueButton2', 'Ready', 'Game');
    this.readylButton.button.on('pointerdown',function(){
      socket.emit('ready');
      self.readylButton.visible = false;
    })
    this.readylButton.visible = false;

    //menu fold call and raise
    var containerMenu = this.add.container();
    //add button fold 
    this.foldButton = new Button(this, 260, 570, 'blueButton1', 'blueButton2', 'Fold', 'Game');
    this.foldButton.button.on('pointerdown', function () {
      containerMenu.visible = false;
      //hien thị message
    })
    //add button call
    this.callButton = new Button(this, 360, 570, 'blueButton1', 'blueButton2', 'Call', 'Game');
    //add button raise
    this.raiseButton = new Button(this, 460, 570, 'blueButton1', 'blueButton2', 'Raise', 'Game');

    this.raiseButton.button.on('pointerdown', function () {
      //an menu raise
      containerDemo.visible = true;
      sliderRaise.visible = true;
      //hien thi menu all
      containerMenu.visible = false;
    });

    containerMenu.add([this.foldButton, this.callButton, this.raiseButton]);
    containerMenu.visible = false;



    //raise menu
    //-------
    var containerDemo = this.add.container();
    this.raiseBackButton = new Button(this, 120, 570, 'blueButton1', 'blueButton2', 'back', 'Game');
    this.raiseBackButton.button.setScale(0.4, 0.6);
    this.raiseBackButton.button.on('pointerdown', function () {
      //an menu raise
      containerDemo.visible = false;
      sliderRaise.visible = false;
      //hien thi menu all
      containerMenu.visible = true;
    });
    this.raiseoOkButton = new Button(this, 750, 570, 'blueButton1', 'blueButton2', 'Ok', 'Game');
    this.raiseoOkButton.button.setScale(0.4, 0.6);
    this.raiseoOkButton.button.on('pointerdown', function () {
      //an menu raise
      containerDemo.visible = false;
      sliderRaise.visible = false;
      self.callMessage('chơi hết lun');
      //hien message
    });

    var inputText = this.add.rexInputText(650, 570, 10, 10, {
      type: 'text',
      text: 'hello world',
      fontSize: '20px',
      backgroundColor: 0x950000,
      color: 0xffffff,
      border: '1px solid black',
      padding: '3px',
      radius: '5px'
    })
      .resize(100, 30)
      .setOrigin(0.5)
      .on('textchange', function (inputText) {

      })
    const sliderRaise = this.rexUI.add.slider({
      x: 380,
      y: 570,
      width: 400,
      height: 20,
      orientation: 'y',

      track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
      indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
      thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),

      input: 'click', // 'drag'|'click'
      valuechangeCallback: function (value) {
        inputText.text = value;
      },

    })
      .layout();
    containerDemo.add([this.raiseBackButton, this.raiseoOkButton, inputText]);
    //mac dinh ban dau an menu raise
    containerDemo.visible = false;
    sliderRaise.visible = false;
    //raise menu
    //-------
  }

  addOthersLayer(item, position, self) {
    //add container layer
    const PlayerOther = self.add.container(position.xPlayer, position.yPlayer);
    //cards
    const cardsOther = self.add.sprite(0, 0, 'atlasBai', 'green_back.png').setScale(0.4, 0.4).setInteractive();
    const cards1Other = self.add.sprite(40, 0, 'atlasBai', 'green_back.png').setScale(0.4, 0.4).setInteractive();
    //avata
    const avatarOther = self.add.sprite(0, 100, 'user');
    //name
    const textOther = self.add.text(35, 80, 'User', {
      fontFamily: '"Roboto Condensed"',
      color: 'black',
      fixedWidth: '50',
      fixedHeight: '20',
      align: 'center'
    });
    var graphicsOther = self.add.graphics(0, 0)
    graphicsOther.lineStyle(1, 0x0e0e0e)
    graphicsOther.fillStyle(0xffcc00, 1);
    graphicsOther.strokeRoundedRect(textOther.x, textOther.y, 50, 20, 4)
    graphicsOther.fillRoundedRect(textOther.x, textOther.y, 50, 20, 4)
    //money
    const text1Other = self.add.text(35, 110, '$1000', {
      fontFamily: '"Roboto Condensed"',
      color: 'white',
      fixedWidth: '50',
      fixedHeight: '20',
      align: 'center'
    });
    var graphics1Other = self.add.graphics(0, 0)
    graphics1Other.lineStyle(1, 0x0e0e0e)
    graphics1Other.fillStyle(0x990000, 1);
    graphics1Other.strokeRoundedRect(text1Other.x, text1Other.y, 50, 20, 10)
    graphics1Other.fillRoundedRect(text1Other.x, text1Other.y, 50, 20, 10)

    //message
    const message = this.add.sprite(0, 160, 'message');
    const textMessage = this.add.text(-25, 150, 'All in', {
      fontFamily: '"Roboto Condensed"',
      color: 'black',
      fixedWidth: '50',
      fixedHeight: '20',
      align: 'center'
    })

    PlayerOther.add([cardsOther, avatarOther, cards1Other, graphicsOther, textOther, graphics1Other, text1Other, message, textMessage]);
    PlayerOther.getAt(7).visible = false;
    PlayerOther.getAt(8).visible = false;
    this.ortherLayers[item.id] = PlayerOther;
  }


  addPlayerCard(group, x, y, hinh) {
    const hinh1 = this.add.sprite(100, 100, 'atlasBai', hinh).setOrigin(0.5, 0).setScale(0.4, 0.4);
  }


  addOtherCard(group, x, y, hinh) {
    const hinh1 = this.add.sprite(100, 100, 'atlasBai', hinh).setOrigin(0.5, 0).setScale(0.4, 0.4);
  }

  callMessage(value) {
    const imageMessage = this.containerPlayer.getAt(7);
    const message = this.containerPlayer.getAt(8);
    console.log(message.text);
    message.setText(value);
    message.visible = true;
    imageMessage.visible = true;
  }

  callCirlce(qwe,avatar,second){
    var yrotate = 360;    
    let intervalclok = setInterval(function(){
      qwe.clear();
      yrotate = yrotate - 1;
      if(yrotate === 0){
        clearInterval(intervalclok);
      }
      qwe.lineStyle(10, 0xff00ff, 1);

      //  Without this the arc will appear closed when stroked
      qwe.beginPath();

      // arc (x, y, radius, startAngle, endAngle, anticlockwise)
      qwe.arc(avatar.x, avatar.y, 50, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(yrotate), false);

      //  Uncomment this to close the path before stroking
      //graphics.closePath();

      qwe.strokePath();
    }, 10);
  }
};
