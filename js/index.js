var mediaQueryList = window.matchMedia("(max-width: 100%)");
mediaQueryList.addEventListener("change", function(a, b){
    if (a.matches) {
        document.body.style.backgroundColor = '#ccc';
    } else {
        document.body.style.backgroundColor = 'transparent';
    }
})
var game = {

    data: [],//储存游戏数据
    score: 0,//当前分数
    dataCopy: [],//三维数组，存放历史记录
    scoreCopy: [],//存放分数历史记录
    copyNum: 0,//记录备份的数量

    isMoved: false,
    isEnd: false,
    //初始化
    initial: function () {
        //将胜利与结束图层隐藏
        document.getElementById("gameWinContainer").style.display = "none";
        document.getElementById("gameOverContainer").style.display = "none";
        //初始化游戏数据
        for (var i = 0; i < 4; i++) {
            this.data[i] = [];
            for (var j = 0; j < 4; j++) {
                this.data[i][j] = 0;
            }
        }
        this.dataCopy = [];
        this.dataCopyNum = 0;
        this.isMoved = false;
        this.isEnd = false;
        this.score = 0;
        this.getRandomNumber();
        this.getRandomNumber();
        //将数组显示在网页上
        this.updateView();
        //保存历史记录
        this.save();
        //按键绑定以移动
        this.move();
    },
    //在数组中上生成随机数

    getRandomNumber: function () {
        var di = [];
        var dj = [];
        var index = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.data[i][j] == 0) {
                    di[index] = i;
                    dj[index] = j;
                    index++;
                }
            }
        }
        if (index == 0) {
            return;
        }
        var rand = Math.floor(Math.random() * index);
        var i = di[rand];
        var j = dj[rand];
        this.data[i][j] = Math.random() < 0.85 ? 2 : 4;
    },


    //监测键盘按键并移动元素
    move: function () {
        document.onkeydown = function (event) {
            switch (event.keyCode) {
                case 37:
                    game.moveLeft();
                    break;
                case 65:
                    game.moveLeft();
                    break;
                case 38:
                    game.moveUp();
                    break;
                case 87:
                    game.moveUp();
                    break;
                case 39: game.moveRight();
                    break;
                case 68:
                    game.moveRight();
                    break;
                case 40:
                    game.moveDown();
                    break;
                case 83:
                    game.moveDown();
                    break;
                default:
                    break;
            }
        }
    },

    //保存历史数据
    save: function () {
        //三维数组，备份数据
        this.dataCopy[this.copyNum] = [];
        this.scoreCopy[this.copyNum] = this.score;
        for (var i = 0; i < 4; i++) {
            this.dataCopy[this.copyNum][i] = [];
            for (var j = 0; j < 4; j++) {
                this.dataCopy[this.copyNum][i][j] = this.data[i][j];
            }
        }
        this.copyNum++;
    },

    //更新界面显示
    updateView: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var element = document.getElementById("elem_" + i + "_" + j);
                var elemNum = this.data[i][j];

                // 如果数组中对应的值是0，方块的内容设置为空
                if (elemNum == 0) {
                    element.innerHTML = "";
                    element.className = "elem_" + i + "_" + j;
                }
                else {
                    element.innerHTML = elemNum;
                    element.className = "elem_" + i + "_" + j + " " + "n" + elemNum;
                }
            }
        }
        //更新分数
        var score = document.getElementById("userScore");
        score.innerHTML = this.score;
    },


    //移动一个元素
    moveSingle: function (i, j, di, dj) {
        if (this.isEnd) {
            return;
        }
        if (this.data[i][j] == 0) {
            return;
        }
        var ti = i + di;//结束位置
        var tj = j + dj;//结束位置
        var ts = this.data[i][j];//移动产生的分数
        //没越界且是空格子就可以移动
        while (ti >= 0 && ti < 4 && tj >= 0 && tj < 4 && this.data[ti][tj] == 0) {
            ti += di;
            tj += dj;
        }
        //如果移动到越界
        if (ti < 0 || ti > 3 || tj < 0 || tj > 3) {
            ti = ti - di;
            tj = tj - dj;
        }
        //遇到其他方块
        else {
            if (this.data[ti][tj] == this.data[i][j]) {
                ts = 2 * this.data[ti][tj];
                this.score += this.data[ti][tj];
            }
            else {
                ti = ti - di;
                tj = tj - dj;

            }
        }

        //能否滑动的关键
        if (ti != i || tj != j) {
            this.data[ti][tj] = ts;
            this.data[i][j] = 0;
            this.isMoved = true;
            //通过修改elem元素的类名，使其定位发生变化，并通过transition属性产生动画
            var elems = document.getElementById("elem_" + i + "_" + j);
            var elemt = document.getElementById("elem_" + ti + "_" + tj);
            elems.id = "elem_" + ti + "_" + tj;
            elems.className = "elem_" + ti + "_" + tj;
            elemt.id = "elem_" + i + "_" + j;
            elemt.classname = "elem_" + i + "_" + j;
            elemt.innerHTML = "";
        }

    },


    //全部元素向左移
    moveLeft: function () {
        this.isMoved = false;
        var di = 0;
        var dj = -1;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.moveSingle(i, j, di, dj);
            }
        }
        this.check();
    },


    //向右移
    moveRight: function () {
        this.isMoved = false;
        var di = 0;
        var dj = 1;
        //位移矢量为（0，1）
        for (var i = 0; i <= 3; i++) {
            for (var j = 3; j >= 0; j--) {
                this.moveSingle(i, j, di, dj);
            }
        }
        this.check();
    },
    //向下移
    moveDown: function () {
        this.isMoved = false;
        var di = 1;
        var dj = 0;
        for (var j = 0; j < 4; j++) {
            for (var i = 3; i >= 0; i--) {
                this.moveSingle(i, j, di, dj);
            }
        }
        this.check();
    },
    //向上移
    moveUp: function () {
        this.isMoved = false;
        var di = -1;
        var dj = 0;
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                this.moveSingle(i, j, di, dj);
            }
        }
        this.check();
    },
    //检测是否应当生成随机数，游戏是否结束，是否胜利
    check: function () {
        if (this.isMoved) {
            this.getRandomNumber();
            this.updateView();
            this.save();
        }
        if (this.isWin()) {
            this.isEnd = true;
            var elem = document.getElementById("gameWinContainer");
            elem.style.display = "block";
        } else if (this.isOver()) {
            this.isEnd = true;
            var elem = document.getElementById("gameOverContainer");
            elem.style.display = "block";
        }
    },
    //判断游戏是否失败
    isOver: function () {
        var di = [0, 0, 1, -1];
        var dj = [1, -1, 0, 0];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {
                    if (this.data[i][j] == 0) {
                        return false;
                    }
                    var ti = i + di[k];
                    var tj = j + dj[k];
                    if (0 <= ti && ti < 4 && 0 <= tj && tj < 4) {
                        if (this.data[ti][tj] == this.data[i][j]) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    //判断游戏是否胜利
    isWin: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.data[i][j] == 2048) {
                    return true;
                }
            }
        }
        return false;
    },

    //撤回一步
    goBack: function () {
        //第一步或游戏结束无法撤回
        if (this.copyNum <= 1 || this.isEnd) {
            return;
        }
        //将数组转化为历史记录中的数组
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.data[i][j] = this.dataCopy[this.copyNum - 2][i][j];
            }
        }
        //修改分数
        this.score = this.scoreCopy[this.copyNum - 2];
        //修改备份数量
        this.copyNum--;
        //更新网页显示
        this.updateView();
    }

}
