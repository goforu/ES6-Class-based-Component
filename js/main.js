/**
 * Created by goforu on 2016/8/10.
 * Demo Js
 */
/*****初始化******/
let store = new Store();
//随机生成100条数据
store.setDataArray(genRandomData(100));
let grid = new Grid({
    //id: 'grid',//id
    classes: 'widget',//类名，多个用空格隔开
    columns: ["列1", "列2", "列3", "列4", "列5", "列6"],//列名
    store,//数据仓库
    maxRows: 10,//每页最大行数
    isMark: true,//是否显示序列号
    title: 'ES6 UI DEMO',//标题
    style: {//样式
        //color:'blue'
    }
});
//插入到dom
document.getElementById('grid').appendChild(grid.container);

/******刷新******/
function loadGridData() {
    store.setDataArray(genRandomData(100));
    grid.load();
}

/******隐藏&显示******/
toggleShowHide = (()=> {
    let isHide;
    return () => {
        isHide ? grid.show() : grid.hide();
        isHide = !isHide;
    }
})();

/*******销毁*******/
function destroyGrid(){
    grid.destory();
}

/****随机生成数据*****/
function genRandomData(count) {
    let base = ['1', '2', '3'];
    let arr = [];
    for (; count > 0; count--) {
        let row = [];
        for (let j = 0; j < 6; j++) {
            let r = '';
            for (let i = 0; i < 3; i++) {
                r += base[Math.floor(Math.random() * 3)];
            }
            row.push(r);
        }
        arr.push(row);
    }
    return arr;
}