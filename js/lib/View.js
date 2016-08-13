/**
 * Created by goforu on 2016/8/10.
 */
var View = (()=> {

    'use strict';

    return class View {
        /**
         * 构造函数
         * @param classes 类
         * @param id
         * @param title
         */
        constructor({classes, id, title = ''}) {
            if (typeof title !== 'string') throw  new TypeError("参数类型不正确！");

            this.classes = classes;
            this.id = id;
            this.title = title;

            this.eventsMap = new Map();//记录事件，方便销毁
        }

        /**
         * 初始化
         */
        init() {
            this.render();
            this.bindEvents();
        }

        /**
         * 渲染
         */
        render() {
            //第一次渲染时创建
            !this.container && this._createDoms();
        }

        /**
         * 创建结点
         * @protected
         */
        _createDoms() {
            this.container = document.createElement('div');
            this.container && (this.container.className = this.classes);
            this.id && (this.container.id = this.id);
            this._template && (this.container.innerHTML = this._template);
            //缓存doms
            this._cacheDoms();
        }

        /**
         * 缓存结点
         * @protected
         */
        _cacheDoms() {

        }

        /**
         * 绑定事件
         */
        bindEvents() {

        }

        /**
         * 绑定Map中的事件
         * @protected
         */
        _bindMapEvents(){
            for(let map of this.eventsMap){
                for(let item of map[1]) {
                    item[0].addEventListener(map[0], item[1]);
                }
            }
        }

        /**
         * 清除绑定
         */
        unbindEvents(){
            for(let map of this.eventsMap){
                for(let item of map[1]) {
                    item[0].removeEventListener(map[0], item[1]);
                }
            }
        }

        /**
         * 显示
         */
        show() {
            this.container.style.display = 'none';
        }

        /**
         * 隐藏
         */
        hide() {
            this.container.style.display = '';
        }

        /**
         * 添加css类
         * @param cls
         */
        addClasses(cls) {
            this.classes += ` ${cls}`;
        }

        /**
         * 销毁
         */
        destory() {
            this.unbindEvents();

            this.classes = null;
            this.id = null;
            this._template = null;

            this.container.parentElement.removeChild(this.container);

            this.container = null;
        }
    }
})();