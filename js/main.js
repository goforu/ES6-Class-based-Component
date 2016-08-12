/**
 * Created by goforu on 2016/8/10.
 */
(()=>{
    var store = new Store();
    store.setDataArray([
        ["你好啊1","你好啊","你好啊","你好啊","你好啊"],
        ["你好啊2","你好啊","你好啊","你好啊","你好啊"],
        ["你好啊3","你好啊","你好啊","你好啊","你好啊"],
        ["你好啊4","你好啊","你好啊","你好啊","你好啊"],
        ["你好啊5","你好啊","你好啊","你好啊","你好啊"]
    ]);
    var grid = new Grid({
        columns:["header1","header2","header3","header4","header5"],
        store,
        maxRows:2
    });
    document.body.appendChild(grid.node);
    //var pagingGrid = new PagingGrid();
    //document.body.appendChild(pagingGrid.node);
})();
