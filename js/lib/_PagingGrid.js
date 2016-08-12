/**
 * Created by goforu on 2016/8/10.
 */
var PagingGrid = (()=> {

    let _pageNum = Symbol();
    let _currentPage = Symbol();

    let _pageStateEl = Symbol();//页面当前状态
    let _preEl = Symbol();//上一页
    let _nextEl = Symbol();//下一页
    let _toPageEl = Symbol();//输入框
    let _goEl = Symbol();//go按钮

    let template = '<span></span><a href="javascript:void(0)">上一页</a><a href="javascript:void(0)">下一页</a><input type="text"><button>Go</button>';
    return class PagingGrid extends View {

        constructor(grid) {
            super();
            //传入所属grid
            this.grid = grid;
            this[_currentPage] = 0;
            this[_pageNum] = 1;
            this.init();
        }

        //渲染
        render() {
            //第一次渲染时创建
            if (!this.node) {
                this._createDoms();
            }
            //页数
            this[_pageStateEl].innerText = `${this[_currentPage] + 1}/${this[_pageNum]}`;
            //上一页或下一页是否置灰
            //if(this[_currentPage]==0) this[_preEl]
        }

        //创建doms
        _createDoms() {
            this.node = document.createElement('div');
            this.node.innerHTML = template;
            //缓存doms
            this._cacheDoms();
        }

        //缓存dom避免使用时再找，浪费资源
        _cacheDoms() {
            this[_pageStateEl] = this.node.getElementsByTagName('span')[0];
            this[_preEl] = this.node.getElementsByTagName('a')[0];
            this[_nextEl] = this.node.getElementsByTagName('a')[1];
            this[_toPageEl] = this.node.getElementsByTagName('input')[0];
            this[_goEl] = this.node.getElementsByTagName('button')[0];
        }

        //绑定事件
        bindEvents() {
            this[_goEl].addEventListener('click', ()=>this.currentPage = this[_toPageEl].value);
            this[_preEl].addEventListener('click', ()=>this.previous());
            this[_nextEl].addEventListener('click', ()=>this.next());
            this[_goEl].addEventListener('click', ()=> {
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
            })
        }

        //设置当前页
        set currentPage(pageNum) {
            if (typeof pageNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (pageNum > this[_pageNum] || pageNum < 0) throw new RangeError("页面值越界！");
            this[_currentPage] = pageNum;
            this._firePageChanged(pageNum);
        }

        //获取当前页
        get currentPage() {
            return this[_currentPage];
        }

        //设置最大页数
        set pageNum(maxNum) {
            if (typeof maxNum !== 'number') throw  new TypeError("页码必须为Number！");
            if (maxNum < 0) throw new RangeError("最大页面数不能小于0！");
            this[_pageNum] = maxNum;
            this.render();
        }

        //返回最大页数
        get pageNum() {
            return this[_pageNum];
        }

        //下一页
        next() {
            if (this[_currentPage] + 1 < this[_pageNum]) {
                ++this[_currentPage];
                this._firePageChanged();
                return this[_currentPage];
            }
            return -1;
        }

        //上一页
        previous() {
            if (this[_currentPage] > 0) {
                --this[_currentPage];
                this._firePageChanged();
                return this[_currentPage];
            }
            return -1;
        }
        //当页面改变时触发，提醒grid更新界面
        _firePageChanged() {
            this.grid.render();
            this.render();
        }
    }

})();