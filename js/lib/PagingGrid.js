/**
 * Created by goforu on 2016/8/10.
 */
var PagingGrid = (()=> {

    let _maxPage = Symbol();
    let _currentPage = Symbol();

    let _pageNumEl = Symbol();
    let _preEl = Symbol();
    let _nextEl = Symbol();
    let _toPageEl = Symbol();
    let _goEl = Symbol();

    let template = '<span>1/32</span><a href="javascript:void(0)">上一页</a>' +
        '<a href="javascript:void(0)">下一页</a><input type="text"><button>Go</button>';
    return class PagingGrid extends View {

        constructor() {
            super();
            this[_currentPage] = 1;
            this.init();
        }

        //渲染
        render() {
            //第一次渲染时创建
            if (!this.dom) {
                this._createDoms();
            }

        }


        _createDoms() {
            this.dom = document.createElement('div');
            this.dom.innerHTML = template;
            //缓存doms
            this._cacheDoms();
        }

        //缓存dom避免使用时再找，浪费资源
        _cacheDoms() {
            this[_pageNumEl] = this.dom.getElementsByTagName('span')[0];
            this[_preEl] = this.dom.getElementsByTagName('a')[0];
            this[_nextEl] = this.dom.getElementsByTagName('a')[1];
            this[_toPageEl] = this.dom.getElementsByTagName('input')[0];
            this[_goEl] = this.dom.getElementsByTagName('button')[0];
        }

        bindEvents() {
            this[_goEl].addEventListener('click', ()=>this.currentPage = this[_toPageEl].value);
            this[_preEl].addEventListener('click', ()=>this.previous());
            this[_nextEl].addEventListener('click', ()=>this.next());
        }

        set currentPage(pageNum) {
            if (typeof pageNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (pageNum > this[_maxPage] || pageNum < 0) throw new RangeError("页面值越界！");
            this[_currentPage] = pageNum;
            this._firePageChanged(pageNum);
        }

        get currentPage() {
            return this[_currentPage];
        }

        set maxPage(maxNum){
            if (typeof maxNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (maxNum < 0) throw new RangeError("最大页面数不能小于0！");
            this[_maxPage] = maxNum;
            this.render();
        }

        next() {
            alert('test');
            if (this[_currentPage] < this[_maxPage]) {
                ++this[_currentPage];
                this._firePageChanged();
                return this[_currentPage];
            }
            return -1;
        }

        previous() {
            if (this[_currentPage] > 0) {
                --this[_currentPage];
                this._firePageChanged();
                return this[_currentPage];
            }
            return -1;
        }

        _firePageChanged() {
            Events.emit('pageChange', this[_currentPage]);
        }
    }

})();