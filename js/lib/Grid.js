/**
 * Created by goforu on 2016/8/10.
 */
var Grid = (()=> {

    //私有属性key
    let _store = Symbol();
    let _columns = Symbol();
    let _maxRows = Symbol();
    let _title = Symbol();
    let _isMark = Symbol();

    let _tableEl = Symbol();
    let _captionEl = Symbol();
    let _theadEl = Symbol();
    let _tbodyEl = Symbol();
    let _pagingEl = Symbol();

    //grid模板
    let _template = '<table><caption></caption><thead></thead><tbody></tbody></table><div></div>';

    return class Grid extends View {
        //构造函数
        constructor({title = "", columns = [], store, maxRows = 10, isMark = false}) {
            super();
            if (typeof title !== 'string' || !Array.isArray(columns) || columns.length == 0) throw new TypeError('参数类型不正确或列名为空！');
            for (let c of columns) {
                if (typeof c !== 'string') throw new TypeError('列名类型不正确！');
            }

            this[_title] = title;//标题
            this[_columns] = columns;//列名
            this[_maxRows] = maxRows;//分页最大显示行数
            this[_isMark] = isMark;//是否显示列序号
            //数据仓库
            this[_store] = store;
            //分页组件
            this.pagingGrid = new PagingGrid(this);
            //获取数据页数
            this.pagingGrid.pageNum = this[_store].getMaxUnitNum(this[_maxRows]);
            this.init();
        }

        //渲染
        render() {
            //第一次渲染时创建
            if (!this.node) {
                this._createDoms();
            }
            //渲染内容
            if (this[_store]) {
                let dataArr = this.getPageData(this.pagingGrid.currentPage, this[_maxRows]);
                let contentNodeTemp = '';
                for (let i = 0; i < dataArr.length; i++) {
                    contentNodeTemp += '<tr>';
                    for (let j = 0; j < this[_columns].length; j++) {
                        //添加cell数据，如果没有该列数据，则为""，超出则截断
                        let value = dataArr[i][j] || "";
                        contentNodeTemp += `<td>${value}</td>`;
                    }
                    contentNodeTemp += '</tr>';
                }
                this[_tbodyEl].innerHTML = contentNodeTemp;
            }
        }
        //事件绑定
        bindEvents(){

        }

        //创建grid架子
        _createDoms() {
            this.node = document.createElement('div');
            this.node.innerHTML = _template;
            //缓存doms
            this._cacheDoms();
            //加上标题
            this[_captionEl].appendChild(document.createTextNode(this[_title]));
            //加上列名
            let headTeamp = '';
            for (let c of this[_columns]) {
                headTeamp += `<th>${c}</th>`;
            }
            this[_theadEl].innerHTML = headTeamp;
            //加上分页组件
            this[_pagingEl].appendChild(this.pagingGrid.node);
        }

        //缓存dom避免使用时再找，浪费资源
        _cacheDoms() {
            this[_tableEl] = this.node.getElementsByTagName('table')[0];
            this[_captionEl] = this[_tableEl].getElementsByTagName('caption')[0];
            this[_theadEl] = this[_tableEl].getElementsByTagName('thead')[0];
            this[_tbodyEl] = this[_tableEl].getElementsByTagName('tbody')[0];
            this[_pagingEl] = this.node.getElementsByTagName('div')[0];
        }

        //设置store
        set store(store) {

            this[_store] = store;
        }

        /**
         * 获取相应页面的数据
         * @param pageIndex 页面位置
         * @param rowsNum 加载数据的条数，-1为全部加载
         */
        getPageData(pageIndex = 0, rowsNum = -1) {
            return this[_store].getUnitArray(pageIndex, rowsNum);
        }

        search() {

        }
    }
})();