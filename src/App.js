import React, { Component } from 'react';
import './App.css';
import {
  Navbar,
  Nav,
  NavDropdown,
  FormControl,
  Form,
  Button,
  Jumbotron,
  Row,
  Col,
  DropdownButton,
  ButtonToolbar,
  Dropdown,
  SplitButton,
  Container,
  Card,
} from "react-bootstrap";
let _classes = require('./750.json');


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      levelFilter: '',
      visible: 10,
    }
  }

  loadMore(){
    this.setState((prev) =>{
      return {visible: prev.visible + 10}
    })
  }

  getLevels(lvl){
    let lvls_wanted = lvl.split('.')
    return _classes.filter(cl =>{
      let class_level =/level-(.?)-*(.*)/.exec(cl.level[0]);
      if (!cl.level[0])
      {//empty array is beginner level
        return 'bg' === lvl
      }
      //level information exists
      if ('beginner' === cl.level[0] )
      {//return beginner
        return 'bg' === lvl
      }
      // if only one level
      if (lvls_wanted.length === 1)
      {
        return lvls_wanted[0] === class_level[1] && class_level[2].length === 0
      }
      // a level range
      return lvls_wanted[0] === class_level[1] && lvls_wanted[1] === class_level[2]
    }) 
  }
  changeLevel(e){
    let lvls =this.getLevels(e)
    this.setState({
      data: lvls,
      levelFilter: e,
      visible: 10,
    })
  }

  clearFilter(e){
    this.setState({
      data: _classes,
      levelFilter: '',
      visible: 10,
    })
  }
  
  componentDidMount() {
    this.setState({
      data: _classes
    })
  }
  
  decodeHTML(html) {
    let txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  capitalizeAllWords(str){
    return str.replace(/-/g, ' ').split(' ').map(str => str.charAt(0).toUpperCase() + str.slice(1) + ' ')
  }
  render(){
    if (!this.state.data)
    {
      return (<div>Please wait...</div>)
    }
    return (
      <div className="App">
        <div className='text-center ygi-block-text__title'>
          <h1 >ONLINE YOGA CLASSES</h1>
        </div>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <input type="text" className="input" placeholder="Search..." />
          </Col>
          <Col md="auto">
            <DropdownButton variant="none" id="dropdown-item-teacher" title="Teacher" style={{ maxHeight: "28px" }}  >
            </DropdownButton>
          </Col>
          <Col md="auto">
            <DropdownButton variant="none" id="dropdown-item-duration" title="Duration">
            </DropdownButton>
          </Col>
          <Col md="auto">
            <DropdownButton variant="none"  id="dropdown-item-level" title="Level" onSelect={(e) =>this.changeLevel(e)} >
              <Dropdown.Item as="button"eventKey='bg'>Beginner</Dropdown.Item>
              <Dropdown.Item as="button" eventKey='1'>Level 1</Dropdown.Item>
              <Dropdown.Item as="button" eventKey='1.2'>Level 1/2</Dropdown.Item>
              <Dropdown.Item as="button" eventKey='2'>Level 2</Dropdown.Item>
              <Dropdown.Item as="button" eventKey='2.3'>Level 2/3</Dropdown.Item>
              <Dropdown.Item as="button" eventKey='3'>Level 3</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col md="auto">
            <DropdownButton variant="none" id="dropdown-item-style" title="Style">
            </DropdownButton>
          </Col>
          <Col md="auto">
            <DropdownButton variant="none" id="dropdown-item-anatomy" title="Anatomy">
            </DropdownButton>
          </Col>
        </Row>
        <Row>
          <Col>
          {
            this.state.levelFilter.length ? 
            <div className=" text-left alert alert-dismissible fade show" role="alert" id='myalert'>
              <button type="button" aria-label="Close"  onClick={(e) => this.clearFilter( e)}>
                Remove Filter: {this.state.levelFilter}
              </button>
             </div>
            : 
            <div></div>
          }
          </Col>
        </Row>
        <hr/>
        <div className='text-center'>
          <h3>{this.state.data.length} Results</h3>
          <Container fluid={false}>
          <Row>
          {
            this.state.data.map((cl, i) =>{
              if (i > this.state.visible){
                return <div></div>
              }
              let teacher = this.capitalizeAllWords(cl.teacher[0])
              return <Card className='ygi-course-card'>
                  <Card.Img variant="top" src={cl.thumb} className='ygi-course-card__image'/>
                  <Card.Body>
                    <Card.Title className='ygi-course-card__Title'>{this.decodeHTML(cl.title)}</Card.Title>
                    <Card.Text className='ygi-course-card__content'>
                    {teacher}
                    </Card.Text>
                  </Card.Body>
                </Card>              
            })
          }
        </Row>
        {this.state.visible < this.state.data.length &&
          <Button onClick={()=>this.loadMore()} type='button'>LoadMore</Button>
        }
        </Container>
        </div>

        <Jumbotron id='footer'>
          test
        </Jumbotron>
      </div>
    );
  }
}

export default App;
