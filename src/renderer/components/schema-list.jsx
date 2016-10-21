import React, { Component, PropTypes } from 'react';
import SchemaListItem from './schema-list-item.jsx';


export default class SchemaList extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    database: PropTypes.object.isRequired,
    schemas: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    schemasByDatabase: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
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

  focus(schema) {
    this.refs[schema].focus();
  }

  render() {
    const {
      client,
      database,
      schemas,
      isFetching,
      //schemasByDatabase,
      tables,
      columnsByTable,
      triggersByTable,
      viewsByDatabase,
      functionsByDatabase,
      proceduresByDatabase,
      onExecuteDefaultQuery,
      onSelectTable,
      onGetSQLScript,
//      onRefreshDatabase,
      onMissingMetaData,
  //    onShowDiagramModal,
    } = this.props;

    if (isFetching) {
      return (
        <div className="ui grey item">Loading...</div>
      );
    }

    if (!schemas.length) {
      return (
        <div className="ui grey item">No results found</div>
      );
    }
    return (
      <div className="item" style={{ padding: 0 }}>
      Schema:
      {
        schemas.map(schema => (
          <SchemaListItem
            ref={schema.name}
            key={schema.name}
            client={client}
            database={database}
            schema={schema}
            tables={(tables || {})[schema.name]}
            columnsByTable={(columnsByTable || {})[schema.name]}
            triggersByTable={(triggersByTable || {})[schema.name]}
            views={(viewsByDatabase || {})[schema.name]}
            functions={(functionsByDatabase || {})[schema.name]}
            procedures={(proceduresByDatabase || {})[schema.name]}
            onExecuteDefaultQuery={onExecuteDefaultQuery}
            onSelectTable={onSelectTable}
            onGetSQLScript={onGetSQLScript}
            onMissingMetaData={onMissingMetaData}
           />

        ))
      }
      </div>
    );
  }
}
