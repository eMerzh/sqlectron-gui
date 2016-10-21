import React, { Component, PropTypes } from 'react';
import DatabaseListItem from './database-list-item.jsx';


export default class DatabaseList extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    databases: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    schemasByDatabase: PropTypes.object.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    columnsByTable: PropTypes.object.isRequired,
    triggersByTable: PropTypes.object.isRequired,
    viewsByDatabase: PropTypes.object.isRequired,
    functionsByDatabase: PropTypes.object.isRequired,
    proceduresByDatabase: PropTypes.object.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onExecuteDefaultQuery: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
    onGetSQLScript: PropTypes.func.isRequired,
    onRefreshDatabase: PropTypes.func.isRequired,
    onMissingMetaData: PropTypes.func.isRequired,
    onShowDiagramModal: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  focus(database) {
    this.refs[database].focus();
  }

  render() {
    const {
      client,
      databases,
      isFetching,
      schemasByDatabase,
      tablesByDatabase,
      columnsByTable,
      triggersByTable,
      viewsByDatabase,
      functionsByDatabase,
      proceduresByDatabase,
      onExecuteDefaultQuery,
      onSelectTable,
      onSelectDatabase,
      onGetSQLScript,
      onRefreshDatabase,
      onMissingMetaData,
      onShowDiagramModal,
    } = this.props;

    if (isFetching) {
      return (
        <div className="ui grey item">Loading...</div>
      );
    }

    if (!databases.length) {
      return (
        <div className="ui grey item">No results found</div>
      );
    }

    return (
      <div className="item" style={{ padding: 0 }}>
      <div> woo</div>
      {
        databases.map(database => (
          <DatabaseListItem
            ref={database.name}
            key={database.name}
            client={client}
            database={database}
            schemas={schemasByDatabase[database.name]}
            tables={tablesByDatabase[database.name]}
            columnsByTable={columnsByTable[database.name]}
            triggersByTable={triggersByTable[database.name]}
            views={viewsByDatabase[database.name]}
            functions={functionsByDatabase[database.name]}
            procedures={proceduresByDatabase[database.name]}
            onExecuteDefaultQuery={onExecuteDefaultQuery}
            onSelectTable={onSelectTable}
            onSelectDatabase={onSelectDatabase}
            onGetSQLScript={onGetSQLScript}
            onRefreshDatabase={onRefreshDatabase}
            onMissingMetaData={onMissingMetaData}
            onShowDiagramModal={onShowDiagramModal} />
        ))
      }
      </div>
    );
  }
}
