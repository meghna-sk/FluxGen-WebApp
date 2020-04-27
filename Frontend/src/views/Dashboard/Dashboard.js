import React, { Component, lazy } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Badge,
  Button,
  //ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  //CardFooter, 
  CardTitle,
  Col,
  //Dropdown,
  //DropdownItem,
  //DropdownMenu,
  //DropdownToggle,
  Progress,
  Row,
  //Table,
} from 'reactstrap';
import './dashboard.css'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

//const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));

//const brandPrimary = getStyle('--primary')
//const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
//const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')


// Main Chart

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(20000);
}


const mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: 'index',
    position: 'nearest',
    callbacks: {
      labelColor: function (tooltipItem, chart) {
        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
      }
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      }],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(100000 / 5),
          max: 100000,
        },
      }],
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      loadedData: '',
      timeStamp: '',
      thresholdValue: 0,
      totalConsumptionToday: 0,
      totalConsumptionYesterday: 0,
      AM_7_today: 0,
      AM_8_today: 0,
      AM_9_today: 0,
      AM_10_today: 0,
      AM_11_today: 0,
      PM_12_today: 0,
      PM_1_today: 0,
      AM_7_yesterday: 0,
      AM_8_yesterday: 0,
      AM_9_yesterday: 0,
      AM_10_yesterday: 0,
      AM_11_yesterday: 0,
      PM_12_yesterday: 0,
      PM_1_yesterday: 0
      
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  async componentDidMount() {
    try {
      this.getData()
      this.getfromApi()
      //console.log(mainChartOpts)
      this.interval = setInterval(this.getData, 10000);
    } catch (err) {
      console.log(err.message); 
    }
  }

  getData = async () => {
    await fetch(`http://localhost:5000/api/waterlevels/DEMO1SU2`)
      .then(response => response.json())
      .then(apartment => {
        var arr = []
        //console.log(apartment)
        apartment.apartment.forEach(element => {
          //console.log(element.water_level)
          arr.push(element['Process Level'])
        })
        this.setState({ loadedData: arr})
      })
  }

  getfromApi = async () => {
    let myheaders = {
      "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNfaWQiOiI1NWQ0YzliZC01YzdiLTRmZjgtOGU2Yi01NGUzNzBhMGIxMjAiLCJleHAiOjE1ODgwMDM5Njh9.Ft1qcndujhZbA_Gr5v660vCybiwRy_NQ72HkuC598VQ" //Token is added here
    }


    // Total Consumption in a Day Card, Hourly Graph - Today's Values
    try {
      var totalconsumptiontoday=0
      var seven_today=0
      var eight_today=0
      var nine_today=0
      var ten_today=0
      var eleven_today=0
      var twelve_today=0
      await fetch(`http://54.244.196.27/aquagen/v1/industries/DEMO1/consumption/graph?duration=daily&unit_id=DEMO1IU1`, {
        method: 'GET',
        headers: myheaders
      })
        .then(response => response.json())
        .then(water1 => {
          totalconsumptiontoday=water1.data.total_consumption
          seven_today=(water1.data.hours[6]['7.0'].process_consumption/1000)*100
          eight_today=(water1.data.hours[7]['8.0'].process_consumption/1000)*100
          nine_today=(water1.data.hours[8]['9.0'].process_consumption/1000)*100
          ten_today=(water1.data.hours[9]['10.0'].process_consumption/1000)*100
          eleven_today=(water1.data.hours[10]['11.0'].process_consumption/1000)*100
          twelve_today=(water1.data.hours[11]['12.0'].process_consumption/1000)*100
        })
        this.setState({totalConsumptionToday: totalconsumptiontoday, AM_7_today: seven_today.toFixed(2), AM_8_today:eight_today.toFixed(2), AM_9_today: nine_today.toFixed(2), AM_10_today: ten_today.toFixed(2), AM_11_today: eleven_today.toFixed(2), PM_12_today: twelve_today.toFixed(2)})
    } catch (err) {
      console.log(err.message);
    }

    // Hourly Graph - Yesterdays's Values
    try {
      var totalconsumptionyesterday=0
      var seven_yesterday=0
      var eight_yesterday=0
      var nine_yesterday=0
      var ten_yesterday=0
      var eleven_yesterday=0
      var twelve_yesterday=0

      await fetch(`http://54.244.196.27/aquagen/v1/industries/DEMO1/consumption/graph?duration=yesterday&unit_id=DEMO1IU1`, {
        method: 'GET',
        headers: myheaders
      })
        .then(response => response.json())
        .then(water2 => {
          totalconsumptionyesterday=water2.data.total_consumption
          seven_yesterday=(water2.data.hours[7]['7.0'].process_consumption/1000)*100
          eight_yesterday=(water2.data.hours[8]['8.0'].process_consumption/1000)*100
          nine_yesterday=(water2.data.hours[9]['9.0'].process_consumption/1000)*100
          ten_yesterday=(water2.data.hours[10]['10.0'].process_consumption/1000)*100
          eleven_yesterday=(water2.data.hours[11]['11.0'].process_consumption/1000)*100
          twelve_yesterday=(water2.data.hours[12]['12.0'].process_consumption/1000)*100
        })
        this.setState({totalConsumptionYesterday: totalconsumptionyesterday, AM_7_yesterday: seven_yesterday.toFixed(2), AM_8_yesterday:eight_yesterday.toFixed(2), AM_9_yesterday: nine_yesterday.toFixed(2), AM_10_yesterday: ten_yesterday.toFixed(2), AM_11_yesterday: eleven_yesterday.toFixed(2), PM_12_yesterday: twelve_yesterday.toFixed(2)})
    } catch (err) {
      console.log(err.message);
    }

    try {
      var threshold = 0
      await fetch(`http://54.244.196.27/aquagen/v1/industries/DEMO1/consumption/latest?units`, {
        method: 'GET',
        headers: myheaders
      })
        .then(response => response.json())
        .then(water => {

          threshold=water.data.units[0].DEMO1SU1.unit_threshold

        })
      this.setState({thresholdValue: threshold})
    } catch (err) {
      console.log(err.message);
    }

    this.setState({water_consumed:this.state.totalConsumptionToday+this.state.totalConsumptionYesterday, water_left: 60000-(this.state.totalConsumptionToday+this.state.totalConsumptionYesterday) })
  }



  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div> 



  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info text-center">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                </ButtonGroup>
                <div className="text-value">{this.state.totalConsumptionYesterday}</div>
                <div>Water Consumption - Yesterday</div>
                <div>(Gallons)</div>
                <br />
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-primary text-center">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.totalConsumptionToday}</div>
                <div>Water Consumption Today</div>
                <div>(Gallons)</div>
                <br />
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-warning text-center">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.totalConsumptionYesterday*7}</div>
                <div>Water Consumption This Week</div>
                <div>(Gallons)</div>
                <br />
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-success text-center">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.thresholdValue}</div>
                <div>Threshold Value</div>
                <div>(Inches)</div>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                Water Consumption in the Different Hours of the Day and Live Water Level Update
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" md="6" xl="6">
                    <hr className="mt-0" />
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">
                          <b>7 AM</b> <br />
                          {this.state.AM_7_today*10} Gallons <br />
                          {this.state.AM_7_yesterday*10} Gallons
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress className="progress-xs" color="info" value={this.state.AM_7_today} />
                        <Progress className="progress-xs" color="danger" value={this.state.AM_7_yesterday} />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">
                          <b>8 AM</b> <br />
                          {this.state.AM_8_today*10} Gallons <br />
                          {this.state.AM_8_yesterday*10} Gallons
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress className="progress-xs" color="info" value={this.state.AM_8_today} />
                        <Progress className="progress-xs" color="danger" value={this.state.AM_8_yesterday}/>
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">
                          <b>9 AM</b> <br />
                          {this.state.AM_9_today*10} Gallons <br />
                          {this.state.AM_9_yesterday*10} Gallons
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress className="progress-xs" color="info" value={this.state.AM_9_today} />
                        <Progress className="progress-xs" color="danger" value={this.state.AM_9_yesterday} />
                      </div>
                    </div>
                  </Col>
                  <Col xs="12" md="6" xl="6">
                    <hr className="mt-0" />
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">
                          <b>10 AM</b> <br />
                          {this.state.AM_10_today*10} Gallons <br />
                          {this.state.AM_10_yesterday*10} Gallons
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress className="progress-xs" color="info" value={this.state.AM_10_today} />
                        <Progress className="progress-xs" color="danger" value={this.state.AM_10_yesterday} />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">
                          <b>11 AM</b><br />
                          {this.state.AM_11_today*10} Gallons <br />
                          {this.state.AM_11_yesterday*10} Gallons
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress className="progress-xs" color="info" value={this.state.AM_11_today} />
                        <Progress className="progress-xs" color="danger" value={this.state.AM_11_yesterday} />
                      </div>
                    </div>

                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">
                          <b> 12 PM</b> <br />
                          {this.state.PM_12_today*10} Gallons <br />
                          {this.state.PM_12_yesterday*10} Gallons
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress className="progress-xs" color="info" value={this.state.PM_12_today} />
                        <Progress className="progress-xs" color="danger" value={this.state.PM_12_yesterday} />
                      </div>
                    </div>
                    <div className="legend text-center">
                      <small>
                        <sup className="px-1 text-center"><Badge pill color="info">&nbsp;</Badge></sup>
                        Water Consumed Today
                        &nbsp;
                        <sup className="px-1 text-center"><Badge pill color="danger">&nbsp;</Badge></sup>
                        Water Consumed Yesterday
                      </small>
                    </div>
                    <br />
                  </Col>
                </Row>
                <Row>
                <Col xs="12" md="6" xl="6">
                    <hr className="mt-0" />
                    <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                      <Doughnut data={
                        {
                          labels: [
                            'Water Left in Tank',
                            'Water Consumed'
                          ],
                          datasets: [{
                            data: [this.state.water_left,this.state.water_consumed],
                            backgroundColor: [
                              '#36A2EB',
                              '#FF6384'
                            ],
                            hoverBackgroundColor: [
                              '#36A2EB',
                              '#FF6384'
                            ]
                          }],
                        }
                      } />
                    </div>
                  </Col>
                  <Col>
                    <hr className="mt-0" />   
                    <br />       
                    <br />        
                    <Card className="text-white bg-success text-center">
                      <CardBody className="pb-0">
                        <div className="text-value">{this.state.water_left}</div>
                        <div>Water Left in Tank (Gallons)</div>
                        <br />
                      </CardBody>
                    </Card>
                    <Card className="text-white bg-info text-center">
                      <CardBody className="pb-0">
                        <div className="text-value">{this.state.water_consumed}</div>
                        <div>Water Consumed</div>
                        <br />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row> 
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Water Level with Threshold Value</CardTitle>
                    <div className="small text-muted">April 2020</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                  <Line data={{
                    labels: this.state.timeStamp,
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: hexToRgba(brandInfo, 10),
                        borderColor: brandInfo,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: this.state.loadedData,
                      },

                      {
                        label: 'My Third dataset',
                        backgroundColor: 'transparent',
                        borderColor: brandDanger,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 1,
                        borderDash: [8, 5],
                        data: data3,
                      },
                    ],
                  }}
                    options={mainChartOpts} height={300} />
                </div>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>        
      </div>
    );
  }
}

export default Dashboard;
