/**
 * Created by goforu on 2016/8/10.
 */
var Grid = (()=> {

    'use strict';

    //私有属性key
    let _store = Symbol();//数据仓库
    let _columns = Symbol();//列名
    let _maxRows = Symbol();//最大行数
    let _isMark = Symbol();//是否显示序列号

    //缓存的结点
    let _tableEl = Symbol();
    let _captionEl = Symbol();
    let _theadEl = Symbol();
    let _tbodyEl = Symbol();
    let _pagingEl = Symbol();
    let _thEls = Symbol();
    //排序器
    let _sortSwitcher = Symbol();

    //组件样式
    const cls = 'grid';

    //排序轮换器
    class SortSwitcher {
        constructor() {
            //排序规则信息
            this.sortOpts = [];
        }

        /**
         * 点击任意一列排序触发，轮换排序规则。store拿到它生成的排序规则才能排序
         * @param index 所在列
         */
        switchSort(index) {
            for (var i = 0; i < this.sortOpts.length; i++) {
                //升序排列，则变为降序
                if (this.sortOpts[i][index] === false) {
                    this.sortOpts[i][index] = true;
                    return true;
                } else if (this.sortOpts[i][index] === true) {
                    //若为升序，则去掉排序
                    this.sortOpts.splice(i, 1);
                    return undefined;
                }
            }
            //若未排序，则降序
            if (i == this.sortOpts.length) {
                let opt = {};
                opt[index] = false;
                this.sortOpts.push(opt);
                return false;
            }
        }
    }

    //grid模板
    //let _template = '<table><caption></caption><thead><tr></tr></thead><tbody></tbody></table><div></div>';

    return class Grid extends View {

        /**
         *
         * @param classes 类名
         * @param id
         * @param title 标题
         * @param columns 列名
         * @param store 数据仓库
         * @param maxRows 一页最大行数
         * @param isMark 是否显示列序号
         */
        constructor({classes, id, title, columns, store = new store(), maxRows = 10, isMark = false}) {
            //调用父级构造函数
            super({classes, id, title});
            //校验
            if (!Array.isArray(columns) || columns.length == 0) throw new TypeError('参数类型不正确或列名为空！');
            for (let c of columns) {
                if (typeof c !== 'string') throw new TypeError('列名类型不正确！');
            }
            //模板
            this._template = '<table><caption></caption><thead><tr></tr></thead><tbody></tbody></table><div></div>';
            //添加css类
            this.addClasses(cls);

            this[_columns] = columns;//列名
            this[_maxRows] = maxRows;//分页最大显示行数
            this[_isMark] = isMark;//是否显示列序号
            //数据仓库
            this[_store] = store;
            //分页组件
            this.pagingGrid = new PagingGrid(this);
            //获取数据页数
            this.pagingGrid.pageNum = this[_store].getMaxUnitNum(this[_maxRows]);
            //排序轮换器
            this[_sortSwitcher] = new SortSwitcher();
            //初始化
            this.init();
        }

        /**
         * 渲染
         */
        render() {
            super.render();
            //渲染内容
            let dataArr = this.getPageData(this.pagingGrid.currentPage, this[_maxRows]);
            let contentNodeTemp = '';
            for (let row of dataArr) {
                contentNodeTemp += '<tr>';
                for (let i = 0; i < this[_columns].length; i++) {
                    //添加cell数据，如果没有该列数据，则为""，超出则截断
                    let value = row[i] || "";
                    contentNodeTemp += `<td>${value}</td>`;
                }
                contentNodeTemp += '</tr>';
            }
            this[_tbodyEl].innerHTML = contentNodeTemp;
        }

        /**
         * 事件绑定
         */
        bindEvents() {
            super.bindEvents();
            //将click事件存起来，便于销毁，防止内存泄露
            if (!this.eventsMap.has('click')) {
                this.eventsMap.set('click', new Map());
            }
            let clickMap = this.eventsMap.get('click');
            //点击列名，返回被点列序号
            for (let i = 0; i < this[_thEls].length; i++) {
                clickMap.set(this[_thEls][i], ((()=> {
                    let index = i;
                    return ()=> {
                        //点击后排序状态
                        let state = this[_sortSwitcher].switchSort(index);
                        if (state === false) {
                            this[_thEls][index].className = 'down-sort';
                        } else if (state === true) {
                            this[_thEls][index].className = 'up-sort';
                        } else {
                            this[_thEls][index].className = '';
                        }
                        //把排序规则sortOpts交给store排序
                        this[_store].sortByColumns(this[_sortSwitcher].sortOpts);
                        //排序完成后，重新渲染页面
                        this.render();
                    };
                })()).bind(this));
            }
            this._bindMapEvents();
        }

        /**
         * 创建grid架子
         * @private
         */
        _createDoms() {
            super._createDoms();
            //加上标题
            this[_captionEl].appendChild(document.createTextNode(this.title));
            //加上列名
            let headTeamp = '';
            for (let c of this[_columns]) {
                headTeamp += `<th>${c}</th>`;
            }
            this[_theadEl].innerHTML = headTeamp;
            //列名
            this[_thEls] = Array.from(this[_theadEl].children[0].children);
            //加上分页组件
            this[_pagingEl].appendChild(this.pagingGrid.container);
        }

        /**
         * 缓存dom避免使用时再找，浪费资源
         * @private
         */
        _cacheDoms() {
            super._cacheDoms();
            this[_tableEl] = this.container.getElementsByTagName('table')[0];
            this[_captionEl] = this[_tableEl].getElementsByTagName('caption')[0];
            this[_theadEl] = this[_tableEl].getElementsByTagName('thead')[0];
            this[_tbodyEl] = this[_tableEl].getElementsByTagName('tbody')[0];
            this[_pagingEl] = this.container.getElementsByTagName('div')[0];

        }

        /**
         * 设置数据仓库
         * @param store
         */
        set store(store) {
            this[_store] = store;
            this.render();
        }

        /**
         * 获取相应页面的数据
         * @param pageIndex 页面位置
         * @param rowsNum 加载数据的条数，-1为全部加载
         */
        getPageData(pageIndex = 0, rowsNum = this[_maxRows]) {
            return this[_store].getUnitArray(pageIndex, rowsNum);
        }

        search() {

        }

        //销毁
        destory() {
            super.destory();

            this.pagingGrid.destory();
            this.pagingGrid = null;

            this[_store].destory();
            this[_store] = null;

            this[_columns] = null;
            this[_maxRows] = null;

            this[_isMark] = null;
            this[_tableEl] = null;
            this[_captionEl] = null;
            this[_theadEl] = null;
            this[_tbodyEl] = null;
            this[_pagingEl] = null;
        }
    }
})();