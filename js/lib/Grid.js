/**
 * Created by goforu on 2016/8/10.
 */
var Grid = (()=> {

    //私有属性
    let _store = Symbol();
    let _columns = Symbol();
    let _title = Symbol();

    let _tableEl = Symbol();
    let _captionEl = Symbol();
    let _theadEl = Symbol();
    let _tbodyEl = Symbol();

    //grid模板
    let template = '<table><caption></caption><thead></thead><tbody></tbody></table>';

    return class Grid extends View {
        //构造函数
        constructor(title, columns) {
            super();
            if (typeof title !== 'string' || !Array.isArray(columns) || columns.length == 0) throw new TypeError('参数类型不正确或列名为空！');
            for (let c of columns) {
                if (typeof c !== 'string') throw new TypeError('列名类型不正确！');
            }
            this[_title] = title;
            this[_columns] = columns;
            this.init();
        }
        //渲染
        render() {
            //第一次渲染时创建
            if (!this.dom) {
                this._createDoms();
            }

        }
        //创建grid架子
        _createDoms() {
            this.dom = document.createElement('div');
            this.dom.innerHTML = template;
            //缓存doms
            this._cacheDoms();
            //加上标题
            this[_captionEl].appendChild(document.createTextNode(this[_title]));
            //加上列名
            for (let c of this[_columns]) {
                this[_theadEl].appendChild(document.createTextNode(c));
            }
        }
        //缓存dom避免使用时再找，浪费资源
        _cacheDoms() {
            this[_tableEl] = this.dom.getElementsByTagName('table')[0];
            this[_captionEl] = this[_tableEl].getElementsByTagName('caption')[0];
            this[_theadEl] = this[_tableEl].getElementsByTagName('thead')[0];
            this[_tbodyEl] = this[_tableEl].getElementsByTagName('tbody')[0];
        }
        //设置store
        set store(store) {

            this[_store] = store;
        }

        load() {
            this[_store]
        }

        search() {

        }
    }
})();