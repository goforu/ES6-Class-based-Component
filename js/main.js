/**
 * Created by goforu on 2016/8/10.
 */
(()=>{
    var grid = new Grid('你好',['我是','你是']);
    document.body.appendChild(grid.dom);
    var pagingGrid = new PagingGrid();
    document.body.appendChild(pagingGrid.dom);
})();
