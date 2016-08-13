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
    let _goEl = Symbol();//go按钮

    const cls = 'paging-grid';

    return class PagingGrid extends View {

        constructor(grid) {
            super({});
            //模板
            this._template = '<span></span><a href="javascript:void(0)" class="paging-up"></a>' +
                '<a href="javascript:void(0)" class="paging-down"></a><input type="text"><button>Go</button>';
            //传入所属grid
            this.addClasses(cls);
            this.grid = grid;
            this[_currentPage] = 0;
            this[_pageNum] = 1;
            this.init();
        }

        //渲染
        render() {
            super.render();
            //页数
            this[_pageStateEl].innerText = `${this[_currentPage] + 1}/${this[_pageNum]}`;
            //上一页或下一页是否置灰
            this[_currentPage] == 0 ? this[_preEl].classList.add('disable') : this[_preEl].classList.remove('disable');
            this[_currentPage] == this[_pageNum] - 1 ? this[_nextEl].classList.add('disable') : this[_nextEl].classList.remove('disable');
        }

        //缓存dom避免使用时再找，浪费资源
        _cacheDoms() {
            super._cacheDoms();
            this[_pageStateEl] = this.container.getElementsByTagName('span')[0];
            this[_preEl] = this.container.getElementsByTagName('a')[0];
            this[_nextEl] = this.container.getElementsByTagName('a')[1];
            this[_toPageEl] = this.container.getElementsByTagName('input')[0];
            this[_goEl] = this.container.getElementsByTagName('button')[0];
        }

        //绑定事件
        bindEvents() {
            super.bindEvents();
            //将click事件存起来，便于销毁，防止内存泄露
            if (!this.eventsMap.has('click')) {
                this.eventsMap.set('click', new Map());
            }
            let clickMap = this.eventsMap.get('click');
            clickMap.set(this[_preEl], this.previous.bind(this));//上一页
            clickMap.set(this[_nextEl], this.next.bind(this));//下一页
            //跳转页
            clickMap.set(this[_goEl], (()=> {
                let value = Number(this[_toPageEl].value);
                if (isNaN(value)) {
                    alert('输入参数类型错误！');
                }
                else if (value > this[_pageNum] || value < 1) {
                    alert("输入参数不在区间");
                }
                else {
                    this.currentPage = value - 1;
                }
            }).bind(this));
            //绑定set中的所有事件
            this._bindMapEvents();
        }

        //设置当前页
        set
        currentPage(pageNum) {
            if (typeof pageNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (pageNum > this[_pageNum] || pageNum < 0) throw new RangeError("页面值越界！");
            this[_currentPage] = pageNum;
            this._firePageChanged(pageNum);
        }

        //获取当前页
        get
        currentPage() {
            return this[_currentPage];
        }

        //设置最大页数
        set
        pageNum(maxNum) {
            if (typeof maxNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (maxNum < 0) throw new RangeError("最大页面数不能小于0！");
            this[_pageNum] = maxNum;
            this.render();
        }

        //返回最大页数
        get
        pageNum() {
            return this[_pageNum];
        }

        //下一页
        next() {
            if (this[_currentPage] + 1 < this[_pageNum]) {
                return this.currentPage += 1;
            }
            return -1;
        }

        //上一页
        previous() {
            if (this[_currentPage] > 0) {
                return this.currentPage -= 1;
            }
            return -1;
        }

        //当页面改变时触发，提醒grid更新界面
        _firePageChanged() {
            this.grid.render();
            this.render();
        }

        destory() {

        }
    }

})();