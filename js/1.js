window.onload = function(){
  let view = {
    // 收到一个参数msg，用于更改网页中的文本并在消息区域显示
    displayMessage: function(msg) {
    // 获取网页中的元素并储存起来
    let messageArea = document.getElementById("messageArea");
    // 更改网页的文本为msg
    messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
      // 获取网页中玩家选择击中的位置
      let cell = document.getElementById(location);
      // 将这个<td>元素的class更改为hit以此来显示战舰图像
      cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
      let cell = document.getElementById(location);
      // 将这个<td>元素的class更改为miss，在元素中显示miss图像
      cell.setAttribute("class", "miss");
    }
  };

  // view.displayMiss("00");
  // view.displayHit("34");
  // view.displayMiss("55");
  // view.displayHit("12");
  // view.displayMiss("25");
  // view.displayHit("26");

  view.displayMessage("Tap tap, is this thing on?");

  let ships = [
    { locations: ["31", "41", "51"], hits: ["", "", ""] },
    { locations: ["14", "24", "34"], hits: ["", "", ""] },
    { locations: ["00", "01", "02"], hits: ["", "", ""] }
  ];


  let model = {
    //游戏板网格大小
    boardSize: 7,
    //游戏战舰数
    numShips: 3,
    //玩家击沉的战舰数，初始为0
    shipsSunk: 0,
    //每艘战舰包含的格式
    shipLength: 3,
    //战舰占据的三个位置                             位置是否被击中
    ships: [{ locations: ["06", "16", "26"], hits: ["", "", ""] },
            { locations: ["24", "34", "44"], hits: ["", "", ""] },
            { locations: ["10", "11", "12"], hits: ["", "", ""] } 
    ],
    //判断开火是否击中
    fire: function(guess) {
      for (let i = 0; i < this.numShips; i++) {
        //储存船的位置数据
        let ship = this.ships[i];
        //判断用户猜测的代码是否是船的位置 并储存起来
        let index = ship.locations.indexOf(guess);

        //判断是否包含
        if (index >= 0) {
          //更改数组中 是否被击中
          ship.hits[index] = "hit";
          //显示战舰
          view.displayHit(guess);
          //发送左上角消息
          view.displayMessage("HIT!");

          //判断下面isSunk值是否为true
          if (this.isSunk(ship)) {
            //左上角显示消息
            view.displayMessage("You sank my battleship!");
            //击沉数增加
            this.shipsSunk++;
          }

          return true;
        }
      }
      //如果没击中 则显示miss
      view.displayMiss(guess);
      view.displayMessage("You missed.");
      //返回false
      return false;
    },
    isSunk: function(ship) { 
      for (let i = 0; i < this.shipLength; i++) {
        //判断击中次数 如果不是hit 则返回false
        if (ship.hits[i] !== "hit") {
          return false;
        }
      }
      //击中数够则返回true
      return true;
    }
  };

  // let controller = {
  //   //记录玩家猜测的次数，初始值为0
  //   guesses: 0,

  //   processGuess: function(guess) {

  //   }
  // };
}