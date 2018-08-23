<template>
  <div class="el-table"
    :class="[{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border || isGroup,
      'el-table--hidden': isHidden,
      'el-table--group': isGroup,
      'el-table--fluid-height': maxHeight,
      'el-table--scrollable-x': layout.scrollX,
      'el-table--scrollable-y': layout.scrollY,
      'el-table--enable-row-hover': !store.states.isComplex,
      'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }, tableSize ? `el-table--${ tableSize }` : '']"
    @mouseleave="handleMouseLeave($event)">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div
      v-if="showHeader"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__header-wrapper"
      ref="headerWrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :border="border"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }">
      </table-header>
    </div>
    <div
      class="el-table__body-wrapper"
      ref="bodyWrapper"
      :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
      :style="[bodyHeight]">
      <table-body
        :context="context"
        :store="store"
        :draggable="draggable"
        :draggablerow="draggablerow"
        :treetable="treetable"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
           width: bodyWidth
        }">
      </table-body>
      <div
      v-show="dragState.showDropIndicator"
      class="el-tree__drop-indicator"
      ref="dropIndicator">
    </div>
      <div
        v-if="!data || data.length === 0"
        class="el-table__empty-block"
        ref="emptyBlock"
        :style="{
          width: bodyWidth
        }">
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
      <div
        v-if="$slots.append"
        class="el-table__append-wrapper"
        ref="appendWrapper">
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="showSummary"
      v-show="data && data.length > 0"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__footer-wrapper"
      ref="footerWrapper">
      <table-footer
        :store="store"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }">
      </table-footer>
    </div>
    <div
      v-if="fixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed"
      ref="fixedWrapper"
      :style="[{
        width: layout.fixedWidth ? layout.fixedWidth + 'px' : ''
      },
      fixedHeight]">
      <div
        v-if="showHeader"
        class="el-table__fixed-header-wrapper"
        ref="fixedHeaderWrapper" >
        <table-header
          ref="fixedTableHeader"
          fixed="left"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-header>
      </div>
      <div
        class="el-table__fixed-body-wrapper"
        ref="fixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body
          fixed="left"
          :draggable="draggable"
          :draggablerow="draggablerow"
          :treetable="treetable"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth
          }">
        </table-body>
        <div
      v-show="dragState.showDropIndicator"
      class="el-tree__drop-indicator"
      ref="dropIndicator">
    </div>
        <div
          v-if="$slots.append"
          class="el-table__append-gutter"
          :style="{
            height: layout.appendHeight + 'px'
          }"></div>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="el-table__fixed-footer-wrapper"
        ref="fixedFooterWrapper">
        <table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed-right"
      ref="rightFixedWrapper"
      :style="[{
        width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
        right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 0)) + 'px' : ''
      },
      fixedHeight]">
      <div v-if="showHeader"
        class="el-table__fixed-header-wrapper"
        ref="rightFixedHeaderWrapper">
        <table-header
          ref="rightFixedTableHeader"
          fixed="right"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-header>
      </div>
      <div
        class="el-table__fixed-body-wrapper"
        ref="rightFixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body
          fixed="right"
          :store="store"
          :draggable="draggable"
          :draggablerow="draggablerow"
          :treetable="treetable"
          :stripe="stripe"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{
            width: bodyWidth
          }">
        </table-body>
        <div
      v-show="dragState.showDropIndicator"
      class="el-tree__drop-indicator"
      ref="dropIndicator">
    </div>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="el-table__fixed-footer-wrapper"
        ref="rightFixedFooterWrapper">
        <table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      class="el-table__fixed-right-patch"
      ref="rightFixedPatch"
      :style="{
        width: layout.scrollY ? layout.gutterWidth + 'px' : '0',
        height: layout.headerHeight + 'px'
      }"></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
  import ElCheckbox from '../../../packages/checkbox';
  import {debounce} from 'throttle-debounce';
  import { addResizeListener, removeResizeListener } from '../../../util/utils/resize-event';
  import Mousewheel from '../../../util/directives/mousewheel';
  import Locale from '../../../util/mixins/locale';
  import Migrating from '../../../util/mixins/migrating';
  import { getStyle, hasClass, addClass, removeClass } from '../../../util/utils/dom';
  import TableStore from './table-store';
  import TableLayout from './table-layout';
  import TableBody from './table-body';
  import TableHeader from './table-header';
  import TableFooter from './table-footer';

  let tableIdSeed = 1;

  export default {
    name: 'eleTable',

    mixins: [Locale, Migrating],

    directives: {
      Mousewheel
    },

    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },

      size: String,

      width: [String, Number],

      height: [String, Number],

      maxHeight: [String, Number],

      fit: {
        type: Boolean,
        default: true
      },

      stripe: Boolean,

      draggable: {
        type: Boolean,
        default: false
      },

      treetable: {
        type: Boolean,
        default: false
      },

      draggablerow: {
        type: Boolean,
        default: false
      },

      allowDrag: Function,
      allowDrop: Function,

      border: Boolean,

      rowKey: [String, Function],

      context: {},

      showHeader: {
        type: Boolean,
        default: true
      },

      showSummary: Boolean,

      sumText: String,

      summaryMethod: Function,

      rowClassName: [String, Function],

      rowStyle: [Object, Function],

      cellClassName: [String, Function],

      cellStyle: [Object, Function],

      headerRowClassName: [String, Function],

      headerRowStyle: [Object, Function],

      headerCellClassName: [String, Function],

      headerCellStyle: [Object, Function],

      highlightCurrentRow: Boolean,

      currentRowKey: [String, Number],

      emptyText: String,

      expandRowKeys: Array,

      defaultExpandAll: Boolean,

      defaultSort: Object,

      tooltipEffect: String,

      spanMethod: Function,

      selectOnIndeterminate: {
        type: Boolean,
        default: true
      }
    },

    components: {
      TableHeader,
      TableFooter,
      TableBody,
      ElCheckbox
    },

    methods: {
      getMigratingConfig() {
        return {
          events: {
            expand: 'expand is renamed to expand-change'
          }
        };
      },

      setCurrentRow(row) {
        this.store.commit('setCurrentRow', row);
      },

      toggleRowSelection(row, selected) {
        this.store.toggleRowSelection(row, selected);
        this.store.updateAllSelected();
      },

      toggleRowExpansion(row, expanded) {
        this.store.toggleRowExpansion(row, expanded);
      },

      clearSelection() {
        this.store.clearSelection();
      },

      clearFilter() {
        this.store.clearFilter();
      },

      clearSort() {
        this.store.clearSort();
      },

      handleMouseLeave() {
        this.store.commit('setHoverRow', null);
        if (this.hoverState) this.hoverState = null;
      },

      updateScrollY() {
        this.layout.updateScrollY();
        this.layout.updateColumnsWidth();
      },

      handleFixedMousewheel(event, data) {
        const bodyWrapper = this.bodyWrapper;
        if (Math.abs(data.spinY) > 0) {
          const currentScrollTop = bodyWrapper.scrollTop;
          if (data.pixelY < 0 && currentScrollTop !== 0) {
            event.preventDefault();
          }
          if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
            event.preventDefault();
          }
          bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
        } else {
          bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
        }
      },

      handleHeaderFooterMousewheel(event, data) {
        const { pixelX, pixelY } = data;
        if (Math.abs(pixelX) >= Math.abs(pixelY)) {
          event.preventDefault();
          this.bodyWrapper.scrollLeft += data.pixelX / 5;
        }
      },

      bindEvents() {
        const { headerWrapper, footerWrapper } = this.$refs;
        const refs = this.$refs;
        let self = this;

        this.bodyWrapper.addEventListener('scroll', function() {
          if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
          if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft;
          if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop;
          if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
          const maxScrollLeftPosition = this.scrollWidth - this.offsetWidth - 1;
          const scrollLeft = this.scrollLeft;
          if (scrollLeft >= maxScrollLeftPosition) {
            self.scrollPosition = 'right';
          } else if (scrollLeft === 0) {
            self.scrollPosition = 'left';
          } else {
            self.scrollPosition = 'middle';
          }
        });

        if (this.fit) {
          addResizeListener(this.$el, this.resizeListener);
        }
      },

      resizeListener() {
        if (!this.$ready) return;
        let shouldUpdateLayout = false;
        const el = this.$el;
        const { width: oldWidth, height: oldHeight } = this.resizeState;

        const width = el.offsetWidth;
        if (oldWidth !== width) {
          shouldUpdateLayout = true;
        }

        const height = el.offsetHeight;
        if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
          shouldUpdateLayout = true;
        }

        if (shouldUpdateLayout) {
          this.resizeState.width = width;
          this.resizeState.height = height;
          this.doLayout();
        }
      },

      doLayout() {
        this.layout.updateColumnsWidth();
        if (this.shouldUpdateHeight) {
          this.layout.updateElsHeight();
        }
      },

      sort(prop, order) {
        this.store.commit('sort', { prop, order });
      },

      toggleAllSelection() {
        this.store.commit('toggleAllSelection');
      }
    },

    created() {
      this.tableId = 'el-table_' + tableIdSeed++;
      this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
      let dragState = this.dragState;
      this.$on('tree-node-drag-start', (row, column, cell, event) => {
        if (typeof this.allowDrag === 'function' && !this.allowDrag(row, column, cell, event)) {
          event.preventDefault();
          return false;
        }
        event.dataTransfer.effectAllowed = 'move';
        // wrap in try catch to address IE's error when first param is 'text/plain'
        try {
          // setData is required for draggable to work in FireFox
          // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
          event.dataTransfer.setData('text/plain', '');
        } catch (e) {}
        dragState.draggingNode = cell;
        dragState.draggingcolumn = column;
        dragState.draggingrow = row;
        this.$emit('node-drag-start', row, column, cell, event);
      });
      this.$on('tree-node-drag-over', (row, column, cell, event) => {
        const dropNode = cell;
        const oldDropNode = dragState.dropNode;
        const olddropcolumn = dragState.dropcolumn;
        const olddroprow = dragState.droprow;
        if (oldDropNode && oldDropNode !== dropNode) {
          removeClass(oldDropNode, 'el-table--dropNode');
        }
        const draggingNode = dragState.draggingNode;
        if (!draggingNode || !dropNode) return;

        let dropPrev = true;
        let dropInner = true;
        let dropNext = true;
        let userAllowDropInner = true;

        event.dataTransfer.dropEffect = dropInner ? 'move' : 'none';
        if (typeof this.allowDrop === 'function') {
          dropPrev = this.allowDrop(row, column, dropNode, event, 'prev');
          userAllowDropInner = dropInner = this.allowDrop(row, column, dropNode, event, 'inner');
          dropNext = this.allowDrop(row, column, dropNode, event, 'next');
        }

        

        if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
          if (oldDropNode) {
            this.$emit('node-drag-leave', olddroprow, olddropcolumn, oldDropNode, event, draggingNode);
          }
          if(this.draggable){
            addClass(dropNode, 'el-table--dropNode');
          }
          this.$emit('node-drag-enter', row, column, dropNode, event, draggingNode);
        }
        // this.$emit('node-drag-over', row, column, cell, event, draggingNode, dropNode);
        
        if (dropPrev || dropInner || dropNext) {
          dragState.dropNode = dropNode;
          dragState.dropcolumn = column;
          dragState.droprow = row;
        }

        if(this.draggablerow){
          
          if (dropNode.nextSibling === draggingNode) {
            dropNext = false;
          }
          if (dropNode.previousSibling === draggingNode) {
            dropPrev = false;
          }
          if (dropNode.contains(draggingNode, false)) {
            dropInner = false;
          }
          if (draggingNode === dropNode || draggingNode.contains(dropNode)) {
            dropPrev = false;
            dropInner = false;
            dropNext = false;
          }

          const targetPosition = dropNode.getBoundingClientRect();
          const treePosition = this.$el.getBoundingClientRect();
          const numberindicatorTop = this.$el.children[1].clientHeight+1
          let dropType;
          const prevPercent = dropPrev ? (dropInner ? 0.25 : (dropNext ? 0.45 : 1)) : -1;
          const nextPercent = dropNext ? (dropInner ? 0.75 : (dropPrev ? 0.55 : 0)) : 1;

          let indicatorTop = -9999;
          const distance = event.clientY - targetPosition.top;
          if (distance < targetPosition.height * prevPercent) {
            dropType = 'before';
          } else if (distance > targetPosition.height * nextPercent) {
            dropType = 'after';
          } else if (dropInner) {
            dropType = 'inner';
          } else {
            dropType = 'none';
          }

          const dropIndicator = this.$refs.dropIndicator;
          if (dropType === 'before') {
            indicatorTop = targetPosition.top -numberindicatorTop - treePosition.top;
          } else if (dropType === 'after') {
            indicatorTop = targetPosition.bottom -numberindicatorTop - treePosition.top;
          }
          dropIndicator.style.top = indicatorTop + 'px';

          if (dropType === 'inner') {
            addClass(dropNode, 'el-table--dropNode');
          } else {
            removeClass(dropNode, 'el-table--dropNode');
          }

          dragState.showDropIndicator = dropType === 'before' || dropType === 'after';
          dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner;
          dragState.dropType = dropType;
        }
        this.$emit('node-drag-over', row, column, dropNode, event, draggingNode);
      });
      this.$on('tree-node-drag-end', (row, column, cell, event) => {
        const { draggingNode, draggingcolumn, draggingrow, dropType, dropNode, dropcolumn, droprow } = dragState;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        let dragging={draggingNode, draggingcolumn, draggingrow}
        let drop={dropNode, dropcolumn, droprow}
        if (draggingNode && dropNode) {
          removeClass(dropNode, 'el-table--dropNode');

          this.$emit('node-drag-end', dragging, drop, dropType, event);
          if (dropType !== 'none') {
            this.$emit('node-drop', dragging, drop, dropType, event);
          }
        }
        dragState.showDropIndicator = false;
        dragState.draggingNode = null;
        dragState.dropNode = null;
        dragState.allowDrop = true;
      });
    },

    computed: {
      tableSize() {
        return this.size || (this.$ELEMENT || {}).size;
      },

      bodyWrapper() {
        return this.$refs.bodyWrapper;
      },

      shouldUpdateHeight() {
        return this.height ||
          this.maxHeight ||
          this.fixedColumns.length > 0 ||
          this.rightFixedColumns.length > 0;
      },

      selection() {
        return this.store.states.selection;
      },

      columns() {
        return this.store.states.columns;
      },

      tableData() {
        return this.store.states.data;
      },

      fixedColumns() {
        return this.store.states.fixedColumns;
      },

      rightFixedColumns() {
        return this.store.states.rightFixedColumns;
      },

      bodyWidth() {
        const { bodyWidth, scrollY, gutterWidth } = this.layout;
        return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
      },

      bodyHeight() {
        if (this.height) {
          return {
            height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          return {
            'max-height': (this.showHeader
              ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
              : this.maxHeight - this.layout.footerHeight) + 'px'
          };
        }
        return {};
      },

      fixedBodyHeight() {
        if (this.height) {
          return {
            height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight;
          }

          maxHeight -= this.layout.footerHeight;

          return {
            'max-height': maxHeight + 'px'
          };
        }

        return {};
      },

      fixedHeight() {
        if (this.maxHeight) {
          if (this.showSummary) {
            return {
              bottom: 0
            };
          }
          return {
            bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
          };
        } else {
          if (this.showSummary) {
            return {
              height: this.layout.tableHeight ? this.layout.tableHeight + 'px' : ''
            };
          }
          return {
            height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
          };
        }
      }
    },

    watch: {
      height: {
        immediate: true,
        handler(value) {
          this.layout.setHeight(value);
        }
      },

      maxHeight: {
        immediate: true,
        handler(value) {
          this.layout.setMaxHeight(value);
        }
      },

      currentRowKey(newVal) {
        this.store.setCurrentRowKey(newVal);
      },

      data: {
        immediate: true,
        handler(value) {
          this.store.commit('setData', value);
          if (this.$ready) {
            this.$nextTick(() => {
              this.doLayout();
            });
          }
        }
      },

      expandRowKeys: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.store.setExpandRowKeys(newVal);
          }
        }
      }
    },

    destroyed() {
      if (this.resizeListener) removeResizeListener(this.$el, this.resizeListener);
    },

    mounted() {
      this.bindEvents();
      this.store.updateColumns();
      this.doLayout();

      this.resizeState = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      };

      // init filters
      this.store.states.columns.forEach(column => {
        if (column.filteredValue && column.filteredValue.length) {
          this.store.commit('filterChange', {
            column,
            values: column.filteredValue,
            silent: true
          });
        }
      });

      this.$ready = true;
    },

    data() {
      const store = new TableStore(this, {
        rowKey: this.rowKey,
        defaultExpandAll: this.defaultExpandAll,
        selectOnIndeterminate: this.selectOnIndeterminate
      });
      const layout = new TableLayout({
        store,
        table: this,
        fit: this.fit,
        showHeader: this.showHeader
      });
      return {
        layout,
        store,
        isHidden: false,
        renderExpanded: null,
        resizeProxyVisible: false,
        resizeState: {
          width: null,
          height: null
        },
        // 是否拥有多级表头
        isGroup: false,
        scrollPosition: 'left',
        dragState: {
          showDropIndicator: false,
          draggingNode: null,
          dropNode: null,
          allowDrop: true
        }
      };
    }
  };
</script>
<style lang="scss" >
@import "../../../theme-chalk/src/checkbox.scss";
@import "../../../theme-chalk/src/table-column.scss";
@import "../../../theme-chalk/src/table.scss";
@import "../../../theme-chalk/src/tag.scss";
@import "../../../theme-chalk/src/tooltip.scss";
</style>
<style scoped>
.el-tree__drop-indicator {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #409eff;
    z-index: 10000;
}
</style>


