import { Component } from 'react';

import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import { findIndex, without } from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0,
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir,
    });
  }

  updateQuery(text) {
    this.setState({
      queryText: text,
    });
  }

  updateInfo(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id,
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts,
    });
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1,
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments: tempApts,
    });
  }

  toggleForm() {
    let fd = this.state.formDisplay;
    this.setState({
      formDisplay: !fd,
    });
  }

  componentDidMount() {
    fetch('./data.json')
      .then((response) => response.json())
      .then((result) => {
        const appts = result.map((item) => {
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          myAppointments: appts,
        });
      });
  }

  render() {
    let filteredApts = this.state.myAppointments;
    const order = this.state.orderDir === 'asc' ? 1 : -1;
    const queryText = this.state.queryText.toLowerCase();

    filteredApts = filteredApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        } else {
          return 1 * order;
        }
      })
      .filter((eachItem) => {
        return (
          eachItem['petName'].toLowerCase().includes(queryText) ||
          eachItem['ownerName'].toLowerCase().includes(queryText) ||
          eachItem['aptNotes'].toLowerCase().includes(queryText)
        );
      });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  queryText={this.state.queryText}
                  updateQuery={this.updateQuery}
                  changeOrder={this.changeOrder}
                />
                <ListAppointments
                  appts={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
