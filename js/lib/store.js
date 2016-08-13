/**
 * Created by goforu on 2016/8/11.
 */
var Store = (()=> {

    'use strict';

    let _rawDataArr = Symbol();//原始数据
    let _sortedDataArr = Symbol();//排序后数据

    return class Store {

        constructor(dataArr = []) {
            this[_rawDataArr] = dataArr;
            this[_sortedDataArr] = [];
            this._sortByColumn();
        }

        /**
         * 获取分隔数据，与分页对应，默认每个单位为10
         * @param index 第几个单位
         * @param unit 数据单位数量
         * @returns {Array.<{}>} 相应数据
         */
        getUnitArray(index = 0, unit = 10) {
            return this[_sortedDataArr].slice(index * unit, (index + 1) * unit);
        }

        /**
         * 获取数据页数
         * @param unit 每页最大行数
         * @returns {number} 页数
         */
        getMaxUnitNum(unit = 10/*number*/) {
            return Math.ceil(this[_sortedDataArr].length / unit);
        }

        /**
         * 添加数据
         * @param rows
         */
        addDataArray(...rows) {
            this[_rawDataArr].concat(rows);
        }

        /**
         * 清空数据
         */
        clearDataArray() {
            this[_rawDataArr].splice(0, this[_rawDataArr].length - 1);
            this[_sortedDataArr].splice(0, this[_sortedDataArr].length - 1);
        }

        /**
         * 重新设置数据
         * @param dataArr
         */
        setDataArray(dataArr) {
            this[_rawDataArr] = dataArr;
            this.sortByColumns();
        }

        /**
         * 各列优先级顺序排序
         * @param sortOpts 排序列，优先级从左到右，格式为[{2:true},{1:false},...]
         */
        sortByColumns(sortOpts) {
            //清空数据
            this[_sortedDataArr].splice(0, this[_sortedDataArr].length);
            //将数据替换为排序后数据
            this[_sortedDataArr].push(...this._sortByColumn(sortOpts, 0, this[_rawDataArr]));
        }

        /**
         * 递归，依据优先级排序
         * @param sortOpts 排序列，优先级从左到右，格式为[{2:true},{1:false},...]
         * @param current 当前排序的优先级位
         * @param arrs 待排序数组
         * @returns {*} 排序完成数组
         * @private
         */
        _sortByColumn(sortOpts = [], current = 0, arrs = []) {
            //如果超出排序列，说明不需要排序了，直接返回。
            if (current >= sortOpts.length) return arrs;
            //找到对应排序列
            let colIndex = Object.keys(sortOpts[current])[0];
            //排序规则
            let isDec = sortOpts[current][colIndex];
            //排序结果
            let resultArr = [];

            //将index列对应相同的数值的索引放在一起，map的key为列值，value为列在arrs中的索引值
            let map = {};

            for (let i = 0; i < arrs.length; i++) {
                //第i行colIndex列cell的value值当做key排序
                let key = arrs[i][colIndex] || '';
                if (map[key] === undefined) {
                    //该值首次出现
                    map[key] = [i];
                } else {
                    //再次出现，压入，待下一次排序（规则决定是否再次细排）
                    map[key].push(i);
                }
            }
            //把列值提出来排序，默认为升序
            let keys = Object.keys(map).sort();
            //如果指明降序再翻转
            if (isDec) keys.reverse();

            for (let key of keys) {
                let sortedArrs = [];
                //将本次同等序列数据提取出来
                for (let index of map[key]) {
                    sortedArrs.push(arrs[index]);
                }
                //送往下一级排序
                resultArr.push(...this._sortByColumn(sortOpts, current + 1, sortedArrs));
            }
            return resultArr;
        }

        destory(){
            this[_rawDataArr] = null;
            this[_sortedDataArr] = null;
        }
    }

})();