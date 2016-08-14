/**
 * Created by goforu on 2016/8/10.
 */
var View = (()=> {

    'use strict';
    let _cachedDisplay = Symbol();//记录原先的display类型，用于显示隐藏

    return class View {
        /**
         * 构造函数
         * @param classes 类
         * @param id
         * @param title
         * @param style 样式
         */
        constructor({classes = '', id, title = '', style = {}}) {
            if (typeof title !== 'string') throw  new TypeError("参数类型不正确！");

            this.classes = classes;
            this.id = id;
            this.title = title;
            this.style = style;

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
            //应用样式
            Object.assign(this.container.style,this.style);
        }

        /**
         * 缓存结点
         * @protected
         */
        _cacheDoms() {

        }

        /**
         * 添加事件，把事件统一装在eventsMap里方便绑定与解绑。防止内存泄漏
         * @param eventName 事件名称
         * @param target 事件作用对象
         * @param handler 触发事件处理方法
         */
        addEvent(eventName, target, handler) {
            //多个事件用空格隔开
            for (let e of eventName.split(' ')) {
                if (!e.trim()) continue;
                if (!this.eventsMap.has(e)) {
                    //若之前没有该事件，新建
                    this.eventsMap.set(e, new Map());
                }
                let map = this.eventsMap.get(e);
                map.set(target, handler);
            }
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
        _bindMapEvents() {
            for (let map of this.eventsMap) {
                for (let item of map[1]) {
                    item[0].addEventListener(map[0], item[1]);
                }
            }
        }

        /**
         * 清除绑定
         */
        unbindEvents() {
            for (let map of this.eventsMap) {
                for (let item of map[1]) {
                    item[0].removeEventListener(map[0], item[1]);
                }
            }
        }

        /**
         * 显示
         */
        show() {
            this[_cachedDisplay] !== undefined && (this.container.style.display = this[_cachedDisplay]);
        }

        /**
         * 隐藏
         */
        hide() {
            //缓存显示类型
            this.container.style.display !== 'none' && (this[_cachedDisplay] = this.container.style.display);
            this.container.style.display = 'none';
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
            this.eventsMap = null;
            this.container.parentElement.removeChild(this.container);//从dom中去掉
            this.container = null;

            this[_cachedDisplay] = null;
            this.classes = null;
            this.id = null;
            this._template = null;
        }
    }
})();