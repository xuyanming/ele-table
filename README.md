# 一个vue-table的组件


### 说明：
#####1.基于element-ui开发的vue表格组件。
####功能:

1.表格支持树形数据的展示

2.行拖拽排序     

3.单元格拖拽排序
### 使用方法：

#####1.下载npm包:

#####你的VUE项目的根目录底下运行：
``` sh
    npm install ele-table
```
#####2.引入本npm包并注册为vue的组件：


> 例如：在需要使用的vue页面中：
``` html
	<template>
    	
    	<!-- 里面写ele-table组件-->
        <ele-table :data="tableData" treetable style="width: 100%">
          <ele-table-column prop="id" label="姓名">
            <template slot-scope="scope">
              <div :style="`padding-left:${20*(scope.row._indent-1)}px`">
                <span  v-if="scope.row.children">
                  <i v-if="scope.row._expand" >-</i><i v-else>+</i>
                </span>
                <span>{{scope.row.id}}</span>
              </div>
            </template>
          </ele-table-column>
          <ele-table-column prop="id" label="年龄" width="180">
          </ele-table-column>
          <ele-table-column
            prop="label"
            label="地址">
          </ele-table-column>
        </ele-table>
        <ele-table
          draggablerow //能否行拖拽
          :allow-drag="allowdrag" //能否被拖拽
          :allow-drop="allowDrop" //能否被放置
          :data="tableData"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          style="width: 100%">
          <ele-table-column prop="id" label="姓名"   width="180">
          </ele-table-column>
          <ele-table-column
            prop="id"
            label="年龄"
            width="180">
          </ele-table-column>
          <ele-table-column
            prop="label"
            label="地址">
          </ele-table-column>
        </ele-table>
	</template>
	
	<script>
    import { eleTable, eleTableColumn } from "ele-table";
    import 'ele-table/dist/ele-table.css'; 
    //项目引入element-ui 不需要引入样式,但需要class类指定拖拽样式
    //<style>
        //.el-table--dropNode{
         // background-color: #409eff !important;
        //}
       // .el-tree__drop-indicator {
       //     position: absolute;
        //    left: 0;
        //    right: 0;
        //    height: 2px !important;
        //    background-color: #409eff;
        //    z-index: 10000;
        //} 
    //</style>
    export default {
        data(){
        	return{
        		tableData: [{
                  id: 1,
                  label: '一级 1',
                  _expand:true,   //设置默认展开节点
                  children: [{
                    id: 4,
                    label: '二级 1-1',
                    _expand:true,
                    children: [{
                      id: 9,
                      label: '三级 1-1-1'
                    }, {
                      id: 10,
                      label: '三级 1-1-2'
                    }]
                 }]
               }, {
                 id: 2,
                 label: '一级 2',
                 children: [{
                    id: 5,
                    label: '二级 2-1'
                 }, {
                    id: 6,
                    label: '二级 2-2'
                 }]
               }]
        	}
        },
        components: {
            eleTable,
            eleTableColumn 
        },
        methods: {
            handleDragEnd(row, column, cell, event) {
              let data = this.tableData[row.draggingcolumn];
              if (cell == "after") {
                this.tableData.splice(column.dropcolumn + 1, 0, data);
                if (row.draggingcolumn > column.dropcolumn) {
                  this.tableData.splice(row.draggingcolumn + 1, 1);
                } else {
                  this.tableData.splice(row.draggingcolumn, 1);
                }
              }
              if (cell == "before") {
                this.tableData.splice(column.dropcolumn, 0, data);
                if (row.draggingcolumn > column.dropcolumn) {
                  this.tableData.splice(row.draggingcolumn + 1, 1);
                } else {
                  this.tableData.splice(row.draggingcolumn, 1);
                }
              }
              if (cell == "inner") {
                this.$set(
                  this.tableData,
                  row.draggingcolumn,
                  this.tableData[column.dropcolumn]
                );
                this.$set(this.tableData, column.dropcolumn, data);
              }
            },
        },
       }
    }
    </script>

```



### Calendar Attributes
| 参数      | 说明           | 类型      | 可选值        | 默认值  |
| -------------------- | ---------------------------------------------- | ---------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| data      | 显示的数据     | array     | —             | —      |
| treetable | 是否树形数据 | boolean |   —             | false |
| _expand| 树形数据默认展开节点（不支持递归关联） | boolean   | —             | false |
| draggablerow      | 是否开启行拖拽     | boolean | —               | false |
| draggable     | 是否开启单元格拖拽     | boolean | —               | false |
| allow-drag     | 能否被拖拽     | Function(row(行数据), column(行拖拽为index,单元格为所在列), cell(节点), event)| — | 要求返回boolean |
| allow-drop | 能否被放置 | Function(row, column, cell, event, type) | — | 要求返回boolean |
### Calendar Events
| 事件名 | 说明 | 参数 |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| node-drag-start | 节点开始拖拽时触发的事件     | Function(row(行数据), column(行拖拽为index,单元格为所在列), cell(节点), event) |
| node-drag-enter | 拖拽进入其他节点时触发的事件 | Function(row(行数据), column(行拖拽为index,单元格为所在列), cell(节点), event, draggingNode(被拖拽节点) |
| node-drag-leave | 拖拽离开某个节点时触发的事件 | Function(row(行数据), column(行拖拽为index,单元格为所在列), cell(节点), event, draggingNode(被拖拽节点) |
| node-drag-over  | 在拖拽节点时触发的事件 | Function(row(行数据), column(行拖拽为index,单元格为所在列), cell(节点), event, draggingNode(被拖拽节点)       |
| node-drag-end   | 拖拽结束时触发的事件 | Function(dragging(被拖拽节点对象), drop(放置节点对象), dropType(放置位置（before、after、inner）), event)      |
| node-drop       | 拖拽完成时触发的事件 | Function(dragging(被拖拽节点对象), drop(放置节点对象), dropType(放置位置（before、after、inner）), event)      |
