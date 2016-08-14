/**
 * Created by goforu on 2016/8/10.
 */
var PagingGrid = (()=> {

    'use strict';

    let _pageNum = Symbol();
    let _currentPage = Symbol();

    let _pageStateEl = Symbol();//页面当前状态
    let _preEl = Symbol();//上一页
    let _nextEl = Symbol();//下一页
    let _toPageEl = Symbol();//输入框
    //let _goEl = Symbol();//go按钮

    const cls = 'paging-grid';

    return class PagingGrid extends View {

        /**
         * 构造函数
         * @param options
         */
        constructor(options) {
            super(options);
            //模板
            this._template = '<span></span><a href="javascript:void(0)" class="paging-up"></a>' +
                '<a href="javascript:void(0)" class="paging-down"></a><input type="number" placeholder="页码">';
            //传入所属grid
            this.addClasses(cls);
            this.grid = options.grid;
            this[_currentPage] = 0;
            this[_pageNum] = 1;
            this.init();
        }

        /**
         * 渲染
         */
        render() {
            super.render();
            //页数
            this[_pageStateEl].innerText = `${this[_currentPage] + 1}/${this[_pageNum]}`;
            //上一页或下一页是否置灰
            this[_currentPage] == 0 ? this[_preEl].classList.add('disable') : this[_preEl].classList.remove('disable');
            this[_currentPage] == this[_pageNum] - 1 ? this[_nextEl].classList.add('disable') : this[_nextEl].classList.remove('disable');
            //页数constraint
            this[_toPageEl].setAttribute('min','1');
            this[_toPageEl].setAttribute('max',this[_pageNum]);
        }

        /**
         * 缓存dom避免使用时再找，浪费资源
         * @private
         */
        _cacheDoms() {
            super._cacheDoms();
            this[_pageStateEl] = this.container.getElementsByTagName('span')[0];
            this[_preEl] = this.container.getElementsByTagName('a')[0];
            this[_nextEl] = this.container.getElementsByTagName('a')[1];
            this[_toPageEl] = this.container.getElementsByTagName('input')[0];
            //this[_goEl] = this.container.getElementsByTagName('button')[0];
        }

        /**
         * 绑定事件
         */
        bindEvents() {
            super.bindEvents();

            this.addEvent('click',this[_preEl],this.previous.bind(this));//上一页
            this.addEvent('click',this[_nextEl],this.next.bind(this));//下一页
            //跳转页
            this.addEvent('focus keyup input', this[_toPageEl], el=> {
                let value = Number(el.target.value);
                if (isNaN(value) || value > this[_pageNum] || value < 1) {
                    el.target.classList.add('error');
                }else {
                    el.target.classList.remove('error');
                    this.currentPage = value - 1;
                }
            });
            this.addEvent('blur', this[_toPageEl], el=>el.target.classList.remove('error'));//失去焦点式恢复
            //绑定map中的所有事件
            this._bindMapEvents();
        }

        /**
         * 设置当前页
         * @param pageNum
         */
        set
        currentPage(pageNum) {
            if (typeof pageNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (pageNum > this[_pageNum] || pageNum < 0) throw new RangeError("页面值越界！");
            this[_currentPage] = pageNum;
            this._firePageChanged(pageNum);
        }

        /**
         * 获取当前页
         * @returns {*}
         */
        get
        currentPage() {
            return this[_currentPage];
        }

        /**
         * 设置最大页数
         * @param maxNum
         */
        set
        pageNum(maxNum) {
            if (typeof maxNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (maxNum < 0) throw new RangeError("最大页面数不能小于0！");
            this[_pageNum] = maxNum;
            this[_currentPage] = 0;
            this.render();
        }

        /**
         * 返回最大页数
         * @returns {*}
         */
        get
        pageNum() {
            return this[_pageNum];
        }

        /**
         * 下一页
         * @returns {number}
         */
        next() {
            if (this[_currentPage] + 1 < this[_pageNum]) {
                return this.currentPage += 1;
            }
            return -1;
        }

        /**
         * 上一页
         * @returns {number}
         */
        previous() {
            if (this[_currentPage] > 0) {
                return this.currentPage -= 1;
            }
            return -1;
        }

        /**
         * 当页面改变时触发，提醒grid更新界面
         * @private
         */
        _firePageChanged() {
            this.grid.render();
            this.render();
        }

        destory() {
            super.destory();

            this.grid = null;
            this[_pageStateEl] = null;
            this[_preEl] = null;
            this[_nextEl] = null;
            this[_toPageEl] = null;
        }
    }

})();