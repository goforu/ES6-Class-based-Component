/**
 * Created by goforu on 2016/8/10.
 */
(function () {
    "use strict";

    const template = '';

    //View构造函数
    const View = title => {
        this.title = title;
        this.init();
    };

    View.prototype.init = ()  => {
        this.render();
    };

    View.prototype.render = () => {

    };

    View.prototype.show = () => {

    };

    View.prototype.hide = () => {

    };

    export default View;
})();