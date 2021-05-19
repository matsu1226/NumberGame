'use strict';
{
    //panelを生成するためのPanelクラス
    class Panel {
        constructor(game) {
            this.game = game;
            this.el = document.createElement('li');     //li要素を生成するための定数を宣言
            this.el.classList.add('pressed');           //li要素にpressedクラスを付与
            this.el.addEventListener('click', () => {
                this.check();
            })
        }


        getEl() {   //Panelクラス外からも、elプロパティ(li.pressed)にアクセスするためのメソッド
            return this.el;
        }

        activate(num) {      //panelインスタンスをactivateするためのメソッドを定義
            this.el.classList.remove('pressed');
            this.el.textContent = num;
        }

        check() {
            //今クリックすべき数字===クリックしたパネルの数字
            if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {        //parseInt() => string型をnum型に変換
                this.el.classList.add('pressed');
                this.game.addCurrentNum();   //次の数字をクリックする

                if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
                    clearTimeout(this.game.getTimeoutId());
                }
            };
        }
    }

    const board = document.getElementById('board');     //board要素を生成するための定数を宣言



    //Boardクラスの生成
    class Board {

        constructor(game) {
            this.game = game;
            this.panels = [];                   //panelを４枚格納するための空配列を用意
            for (let i = 0; i < this.game.getLevel() ** 2; i++) {       //level2の場合、4回ループ
                this.panels.push(new Panel(this.game));  //Panelインスタンスをpanels配列に追加
            }

            this.setup();   //Boardクラスから生成されるインスタンスに、setup()メソッドを追加
        }


        //setup()メソッドを定義
        setup() {
            this.panels.forEach(panel => {
                // board.appendChild( panel.el );           //board要素にpanels配列の各要素内のli(Panelクラスのel)を追加
                board.appendChild(panel.getEl());         //liの追加をgetEl()メソッドで実施
                //<= カプセル化 と言う（クラスのプロパティに外部からアクセスは避けた方が良い）
            });
        }

        activate() {     //boardインスタンスをactivateするためのメソッドを定義
            const nums = [];
            for (let i = 0; i < this.game.getLevel() ** 2; i++) {       //level2の場合、4回ループ
                nums.push(i);
            }
            this.panels.forEach(panel => {
                const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];   //spiceは配列を返すので,"[0]"をつけてひとつの要素を取り出す。
                panel.activate(num);          //panels配列の各要素にactivate()メソッド（Panelクラス内で定義）で処理
            })
        }
    };




    class Game {
        constructor(level) {
            this.level = level;
            this.board = new Board(this);  //Boardインスタンスの生成

            this.currentNum = undefined;     //今、クリックすべき数字を認識するための変数
            this.startTime = undefined;    //開始時間を保持
            this.timeoutId = undefined;

            const btn = document.getElementById('btn');
            btn.addEventListener('click', () => {      //btnをクリックしたら、
                this.start();
            })
            this.setup();
        }



        //containerの大きさをlevelに合わせて動的に制御する
        setup() {
            const container = document.getElementById('container');
            const PANEL_WIDTH = 50;
            const BOARD_PADDING = 10;
            /* 50px *2 + 10px*2 */
            container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
        }

        start() {
            //runTimer()が作動されているならば
            //= runTimer()が作動してclearTimeoutしていない
            //== "timeoutId = setTimeout(runTimer() ,20)" が値を保持している
            if (typeof this.timeoutId !== 'undefined') {       //typeof hoge => hogeのデータ型を返す
                clearTimeout(this.timeoutId);
            }

            this.currentNum = 0;
            this.board.activate();                    //boardにactivate()メソッド（Boardクラス内で定義）で処理 

            this.startTime = Date.now();
            this.runTimer();
        }

        runTimer() {
            const timer = document.getElementById('timer');
            timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);     //timerには、現在時刻-startTimeをs換算して、小数点以下第2位まで表示

            this.timeoutId = setTimeout(() => {        //runTimerは繰り返し処理で表示
                this.runTimer();
            }, 20)
        }

        addCurrentNum() {
            this.currentNum++;
        }

        getCurrentNum() {
            return this.currentNum;
        }

        getTimeoutId() {
            return this.timeoutId;
        }

        getLevel() {
            return this.level;
        }
    }




    let selectedLevel = 2;
    const levelNum = document.getElementById('levelNum');
    const plus = document.getElementById('plus');
    const minus = document.getElementById('minus');


    function levelSet() {
        levelNum.textContent = `Lv.${selectedLevel}`;
        plus.addEventListener('click', () => {
            selectedLevel++;
            levelNum.textContent = `Lv.${selectedLevel}`;
        })
        minus.addEventListener('click', () => {
            selectedLevel--;
            levelNum.textContent = `Lv.${selectedLevel}`;
        })
    }

    levelSet();


    const createGames = document.getElementById('createGames');
    createGames.addEventListener('click', () => {
        board.style.display = 'flex';
        createGames.style.opacity = 0;
        setTimeout(()=>{
            createGames.style.display = 'none';
            btn.style.display = 'block';
            plus.style.display = 'none';
            minus.style.display = 'none';
        },1000)
        new Game(selectedLevel);
    })

    // console.log(new Game(selectedLevel));
    // console.log(new Game());

}