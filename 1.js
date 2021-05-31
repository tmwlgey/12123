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
    ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
            { locations: ["0", "0", "0"], hits: ["", "", ""] },
            { locations: ["0", "0", "0"], hits: ["", "", ""] } 
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
    },

    generateShipLocations: function() {
      let locations;
      //循环次数与要为其生成位置的战舰数相同
      for (var i = 0; i < this.numShips; i++) {
        do {
          //生成战舰占据的一系列的位置
          locations = this.generateShip();
          //并检查这些位置与游戏版中生成的战舰位置是否重叠，是则不断生成，直到不重叠为止
        } while (this.collision(locations));
        //将可用的位置赋给ship中的属性locations
        this.ships[i].locations = locations;
      }
    },

    generateShip: function() {
      //得到随机是0或者1的数字
      let direction = Math.floor(Math.random() * 2);
      let row, col;
      //direction为1，意味着要创建一艘水平放置的战舰   如果为0，以为这要创建一艘垂直放置的战舰
      if (direction === 1) {
     // 生成水平战舰的起始位置
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

      } else {
     // 生成垂直战舰的起始位置
        row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        col = Math.floor(Math.random() * this.boardSize);
      }
      //创建新战舰的locations属性，要创建一个数组然后其中逐一添加位置
      let newShipLocations = [];
      //循环次数为战舰占据的单元格
      for (var i = 0; i < this.shipLength; i++) {
        if (direction === 1) {
     // 在水平战舰的位置数组中添加位置
          newShipLocations.push(row + "" + (col + i));
        } else {
     // 在垂直战舰的位置数组中添加位置
          newShipLocations.push((row + i) + "" + col);
        }
      }
      return newShipLocations;
    },

      collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
          var ship = model.ships[i];
          for (var j = 0; j < locations.length; j++) {
            if (ship.locations.indexOf(locations[j]) >= 0) {
              return true;
            }
          }
        }
        return false;
      }
  };

  let controller = {
    //记录玩家猜测的次数，初始值为0
    guesses: 0,

    processGuess: function(guess) {
      //验证玩家猜测是否有效
      let location = parseGuess(guess);
      if (location) {
        //猜测有效则guesses加1
        this.guesses++;

        let hit = model.fire(location);
        if (hit && model.shipsSunk === model.numShips) {
          view.displayMessage("You sank all my battleships, in " +
          this.guesses + " guesses");
        }
      }
    }
  };
  function parseGuess(guess) {
    //一个包含所有有效字母的数组
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    //检测猜测是否为null或者猜测长度不等于2来检测数值的长度是否有效
    if (guess === null || guess.length !== 2) {
      //如果是这样则提醒玩家
      alert("Oops, please enter a letter and a number on the board.");
    } else {
      //获得第一个有效字母
      firstChar = guess.charAt(0);
      //获得一个0~6的数字，是字母在数组里的位置
      let row = alphabet.indexOf(firstChar);

      //获得字符串的第二个字母，它表示列号
      let column = guess.charAt(1);
      //函数isNaN测试是否为非数值来检测row和column是否都是数字
      if (isNaN(row) || isNaN(column)) {
        //如果是则提醒玩家
        alert("Oops, that isn't on the board.");
      } else 
      //如果row小于0或者row大于游戏版的大小或者column小于0或者column大于游戏版大小来检测是否有效
      if (row < 0 || row >= model.boardSize ||column < 0 || column >= model.boardSize) {
        //如果是则提醒玩家
        alert("Oops, that's off the board!");
      } else {
        //至此，两个都有效，所以返回这两个数字
        //row是数字，column是字符串，所以自动转换成一个字符串
        return row + column;
      }
    }
    //否之则返回无效
    return null;
  // console.log(parseGuess("A0"));
  // console.log(parseGuess("B6"));
  // console.log(parseGuess("G3"));
  // console.log(parseGuess("H0"));
  // console.log(parseGuess("A7"));
  // controller.processGuess("A0");
  // controller.processGuess("A6");
  // controller.processGuess("B6");
  // controller.processGuess("C6");
  // controller.processGuess("C4");
  // controller.processGuess("D4");
  // controller.processGuess("E4");
  // controller.processGuess("B0");
  // controller.processGuess("B1");
  // controller.processGuess("B2");
}

  function init() {
    //使用fire的id来获取指向它的引用
    let fireButton = document.getElementById("fireButton");
    //给它添加单击事件
    fireButton.onclick = handleFireButton;
    //用于处理html输入字段的按键事件
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
  }
  function handleFireButton() {
    // 使用表单元素的id来获取一个指向它的引用
    let guessInput = document.getElementById("guessInput");
    //从value中获取猜测
    let guess = guessInput.value;
    //将玩家猜测发给控制器
    controller.processGuess(guess);

    //然后将表单中输入的值变为空字符串 就无需再删除前一次猜测了
    guessInput.value = " ";
  }
  window.onload = init;

  //按键事件处理程序
  function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    //如果按下回车键希望fire按钮被单击
    if (e.keyCode === 13) {
      fireButton.click();
      //返回false不做任何事情
      return false;
    }
  }

