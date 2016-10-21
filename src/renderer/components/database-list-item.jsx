import React, { Component, PropTypes } from 'react';
import DatabaseListItemMetatada from './database-list-item-metadata.jsx';
import DatabaseFilter from './database-filter.jsx';
import SchemaList from './schema-list.jsx';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved


const { Menu, MenuItem } = remote;


const STYLE = {
  database: {
    fontSize: '0.85em',
    color: '#636363',
    wordBreak: 'break-all',
    cursor: 'default',
    // force menu item go over the parent padding
    // this way allows the whole line be clickable
    position: 'abosolute',
    margin: '-0.92857143em -1.14285714em',
    padding: '0.92857143em 1.14285714em',
    display: 'block',
  },
};


export default class DatabaseListItem extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    schemas: PropTypes.array,
    tables: PropTypes.object,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    views: PropTypes.array,
    functions: PropTypes.array,
    procedures: PropTypes.array,
    database: PropTypes.object.isRequired,
    onExecuteDefaultQuery: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onGetSQLScript: PropTypes.func.isRequired,
    onRefreshDatabase: PropTypes.func.isRequired,
    onMissingMetaData: PropTypes.func.isRequired,
    onShowDiagramModal: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.contextMenu = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.contextMenu || !this.isMetadataLoaded(nextProps)) {
      return;
    }

    this.contextMenu = new Menu();
    this.contextMenu.append(new MenuItem({
      label: 'Refresh Database',
      click: this.props.onRefreshDatabase.bind(this, nextProps.database),
    }));
    this.contextMenu.append(new MenuItem({
      label: 'Show Database Diagram',
      click: this.props.onShowDiagramModal.bind(this, nextProps.database),
    }));
  }

  onContextMenu(event) {
    event.preventDefault();
    if (this.contextMenu) {
      this.contextMenu.popup(event.clientX, event.clientY);
    }
  }

  onFilterChange(value) {
    this.setState({ filter: value });
  }

  onHeaderDoubleClick(database) {
    if (!this.isMetadataLoaded()) {
      this.props.onSelectDatabase(database);
      return;
    }

    this.toggleCollapse();
  }

  filterItems(filterInput, items) {
    const regex = RegExp(filterInput, 'i');
    return items.filter(item => regex.test(item.name));
  }

  focus() {
    // If search is toggled for certain database that is collapsed then toggle collapse.
    if (this.state.collapsed) {
      this.toggleCollapse();
    }

    this.refs.filter.focus();
  }

  isMetadataLoaded(props) {
    const { tables, views, functions, procedures } = (props || this.props);
    return tables && views && functions && procedures;
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  renderHeader(database) {
    const collapseCssClass = !this.isMetadataLoaded() || this.state.collapsed ? 'right' : 'down';

    return (
      <span
        className="header"
        onDoubleClick={() => this.onHeaderDoubleClick(database)}
        onContextMenu={::this.onContextMenu}
        style={STYLE.database}>
        <i className={`${collapseCssClass} triangle icon`}
          style={{ cursor: 'pointer' }}
          onClick={() => this.onHeaderDoubleClick(database)}></i>
        <i className="database icon"></i>
        {database.name}
      </span>
    );
  }

  render() {
    const { filter } = this.state;
    const {
      client,
      schemas,
      tables,
      columnsByTable,
      triggersByTable,
      views,
      functions,
      procedures,
      database,
      onExecuteDefaultQuery,
      onSelectTable,
      onGetSQLScript,
      onMissingMetaData,
    } = this.props;

    let filteredSchemas;
    //let filteredTables;
    let filteredViews;
    let filteredFunctions;
    let filteredProcedures;

    const cssStyleItems = {};
    const isMetadataLoaded = this.isMetadataLoaded();
    if (this.state.collapsed || !isMetadataLoaded) {
      cssStyleItems.display = 'none';
    } else {
      filteredSchemas = this.filterItems(filter, schemas);
      //filteredTables = this.filterItems(filter, tables);
      filteredViews = this.filterItems(filter, views);
      filteredFunctions = this.filterItems(filter, functions);
      filteredProcedures = this.filterItems(filter, procedures);
    }
    filteredSchemas = filteredSchemas || schemas || [];

    return (
      <div className="item">
        {this.renderHeader(database)}
        <div className="ui list" style={cssStyleItems}>
          <div className="item" style={cssStyleItems}>
            <DatabaseFilter
              ref="filter"
              value={filter}
              isFetching={!isMetadataLoaded}
              onFilterChange={::this.onFilterChange} />
          </div>
          <SchemaList
            database={database}
            schemas={filteredSchemas}
            tables={tables}
            client={client}
            tables={tables}
            columnsByTable={columnsByTable}
            triggersByTable={triggersByTable}
            views={views}
            functions={functions}
            procedures={procedures}
            onExecuteDefaultQuery={onExecuteDefaultQuery}
            onSelectTable={onSelectTable}
            onGetSQLScript={onGetSQLScript}
            onMissingMetaData={onMissingMetaData}
          />
          </div>
        </div>
      );
          {/*
          {filteredSchemas.map((schema) => {
            let filteredTables;
            //if (this.state.collapsed || !isMetadataLoaded) {
            //  cssStyleItems.display = 'none';
            //} else {
            //  filteredTables = this.filterItems(filter, (tables || {})[schema.name]);
            //}
            if( (tables || {})[schema.name] === undefined) {
              onMissingMetaData(database.name, schema.name);
            }
            //onMissingMetaData
            return (<div key={schema.name}>
                <div>{schema.name}</div>
                <DatabaseListItemMetatada
                  title="Tables"
                  client={client}
                  schema={schema.name}
                  items={(filteredTables || tables || {})[schema.name]}
                  columnsByTable={columnsByTable}
                  triggersByTable={triggersByTable}
                  database={database}
                  onExecuteDefaultQuery={onExecuteDefaultQuery}
                  onSelectItem={onSelectTable}
                  onGetSQLScript={onGetSQLScript} />
                {/*<DatabaseListItemMetatada
                  collapsed
                  title="Views"
                  client={client}
                  schema={schema}
                  items={filteredViews || views}
                  database={database}
                  onExecuteDefaultQuery={onExecuteDefaultQuery}
                  onGetSQLScript={onGetSQLScript} />
                <DatabaseListItemMetatada
                  collapsed
                  title="Functions"
                  client={client}
                  schema={schema}
                  items={filteredFunctions || functions}
                  database={database}
                  onGetSQLScript={onGetSQLScript} />
                <DatabaseListItemMetatada
                  collapsed
                  title="Procedures"
                  client={client}
                  schema={schema}
                  items={filteredProcedures || procedures}
                  database={database}
                  onGetSQLScript={onGetSQLScript} />
                  * /}
              </div>);
          })
          */ }
  }
}
