import eleTableColumn from './components/table/src/table-column';
import eleTable from './components/table/src/table.vue';

eleTable.install = function(Vue) {
  Vue.component(eleTable.name, eleTable);
};

// export default eleTable;
eleTableColumn.install = function(Vue) {
  Vue.component(eleTableColumn.name, eleTableColumn);
};
console.log(eleTable)
export  {eleTable, eleTableColumn};
