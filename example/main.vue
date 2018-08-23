<template>
  <div id="app">
    <ele-table
      :data="tableData"
      treetable
      style="width: 100%">
      <!-- <ele-table-column type="selection"
      width="55">
    </ele-table-column> -->
      <ele-table-column
        prop="label"
        width="180"
        label="姓名">
        <template slot-scope="scope">
          <div :style="`padding-left:${20*(scope.row._indent-1)}px`">
            <span  v-if="scope.row.children">
              <i v-if="scope.row._expand" >-</i><i v-else>+</i>
              </span><span style="display:inline-block;width:8px;" v-else> </span>
              <span>{{scope.row.label}}</span>
          </div>
        </template>
      </ele-table-column>
      <ele-table-column
        prop="id"
        label="年龄"
        width="180">
      </ele-table-column>
      <ele-table-column
        prop="id"
        label="地址">
      </ele-table-column>
    </ele-table>
    <ele-table
      draggablerow
      :allow-drag="allowdrag"
      :allow-drop="allowDrop"
      :data="tableData"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      style="width: 100%">
      <ele-table-column
        prop="id"
        label="姓名"
        width="180">
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
  </div>
</template>

<script>
import { eleTable, eleTableColumn } from "../src/index.js";
// import "../dist/ele-table.css";
export default {
  name: "app",
  data() {
    return {
      tableData:[],
      node: [{
          id: 1,
          label: '一级 1',
          _expand:true,
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
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
             id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        }],
      input: ""
    };
  },
  components: {
    eleTable,
    eleTableColumn
  },
  mounted() {
    this.tableData = this.node
  },
  methods: {
    cellclick(row, column, cell, event){
      console.log(row, column, cell, event)
    },
    allowDrop(row, column, dropNode, event, type) {
      return true
    },
    allowdrag(row, column, cell, event) {
      return true
    },
    handleDragStart(row, column, cell, event) {
      // console.log(row, column, cell, event,"1111111")
    },
    handleDragEnter(row, column, cell, event, draggingNode) {
      // console.log(row, column, cell, event, draggingNode,"2222222")
    },
    handleDragLeave(row, column, cell, event, draggingNode) {
      // console.log(row, column, cell, event, draggingNode,"33333333")
    },
    handleDragOver(row, column, cell, event, draggingNode, dropNode) {
      // console.log(row, column, cell, event, draggingNode,"4444444")
    },
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
      console.log(row, column, cell, event, "5555555");
    },
    handleDrop(row, column, cell, event, draggingNode, dropNode) {
      // console.log(row, column, cell, event,"666666")
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
