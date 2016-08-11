/**
 * Created by goforu on 2016/8/10.
 */
var View = (()=> {
    return class View {

        constructor() {
            //this.init();
        }

        init() {
            this.render();
        }

        show() {
            this.dom.style.display = 'none';
        }

        hide() {
            this.dom.style.display = '';
        }
    }
})();