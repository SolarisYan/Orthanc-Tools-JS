import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor'

import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import { connect } from 'react-redux'
import * as actions from '../actions/TableQuery'
import * as resultActions from '../actions/TableResult'

import CsvLoader from './csv_loader'


class TableQuery extends Component {

  constructor(props) {
    super(props)
    this.removeRow = this.removeRow.bind(this)
    this.query = this.query.bind(this)
    this.aetsObject = []

  }

  removeRow() {
    let selectedKeyRow = this.node.selectionContext.selected
    this.props.removeQuery(selectedKeyRow)
    this.node.selectionContext.selected = []

  }

  selectRow = {
    mode: 'checkbox'
  };

  cellEdit = cellEditFactory({
    mode: 'click',
    blurToSave: true
  });

  columns = [{
    dataField: 'number',
    hidden: true,
    csvExport: false
  }, {
    dataField: 'patientName',
    text: 'Patient Name',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'patientId',
    text: 'Patient ID',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'accessionNumber',
    text: 'Accession Number',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'dateFrom',
    text: 'Date From',
    sort: true,
    filter: dateFilter()
  }, {
    dataField: 'dateTo',
    text: 'Date To',
    sort: true,
    filter: dateFilter()
  }, {
    dataField: 'studyDescription',
    text: 'Study Description',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'modalities',
    text: 'Modality',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'aet',
    text: 'AET',
    sort: true,
    editor: {
      type: Type.SELECT,
      getOptions: (setOptions, { row, column }) =>{
        return this.props.aets
      }
    },
    filter: textFilter()
  }];

  render() {
    console.log(this.props.aets)
    const { ExportCSVButton } = CSVExport
    return (
      <ToolkitProvider
        keyField="key"
        data={this.props.queries.queries}
        columns={this.columns}
        exportCSV={{ onlyExportSelection: true, exportAll: true }}
      >{
          props => (
            <React.Fragment>
              <div className="jumbotron" style={this.props.style}>
                <h2 className="card-title">Auto Query</h2>
                <div>
                  <ExportCSVButton {...props.csvProps} className="btn btn-primary m-2">Export CSV</ExportCSVButton>
                  <input type="button" className="btn btn-success m-2" value="Add" onClick={this.props.addRow} />
                  <input type="button" className="btn btn-danger m-2" value="Delete" onClick={this.removeRow} />
                  <CsvLoader />
                  <BootstrapTable ref={n => this.node = n} {...props.baseProps} striped={true} filter={filterFactory()} selectRow={this.selectRow} pagination={paginationFactory()} cellEdit={this.cellEdit} />
                </div>
                <div className="text-center">
                  <input type="button" className="btn btn-primary" value="Query" onClick={this.query} />
                </div>
              </div>

            </React.Fragment>
          )
        }
      </ToolkitProvider>
    )
  }

  async query() {
    console.log(this.node.props.data)
    let data = this.node.props.data

    for (const query of data) {
      let answeredResults = await this.makeAjaxQuery(query)
      answeredResults.forEach((answer) => {
        this.props.addResult(answer)
      })

    }





  }

  async makeAjaxQuery(queryParams) {

    let dateString = '*';
    if (queryParams.dateFrom !== '' && queryParams.dateTo !== '') {
      dateString = queryParams.dateFrom + '-' + queryParams.dateTo
    } else if (queryParams.dateFrom === '' && queryParams.dateTo !== '') {
      dateString = '*-' + queryParams.dateTo
    } else if (queryParams.dateFrom !== '' && queryParams.dateTo === '') {
      dateString = queryParams.dateFrom + '-*'
    }

    let queryPost = {
      patientName: queryParams.patientName,
      patientID: queryParams.patientId,
      accessionNumber: queryParams.accessionNumber,
      date: dateString,
      studyDescription: queryParams.studyDescription,
      modality: queryParams.modalities,
      aet: queryParams.aet
    }
    let postString = JSON.stringify(queryPost)
    console.log(queryPost)

    let response = await fetch("/query",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: postString
      })

    let queryAnswers = []
    if (response.ok) {
      console.log('request 200')
      queryAnswers = await response.json()
    }

    return queryAnswers


  }

}



const mapStateToProps = (state) => {
  return {
    aets: state.FormInput.aetsObject,
    queries: state.QueryList,
    results: state.resultList
  }
}

const mapActionsToProps = {
  ...actions,
  ...resultActions,
};

export default connect(mapStateToProps, mapActionsToProps)(TableQuery);