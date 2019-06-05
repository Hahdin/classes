import React, { Component } from 'react';
import './App.css';
import {
  Button,
  Jumbotron,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Container,
  Card,
} from "react-bootstrap";
let _classes = require('./750.json');

/**
 * The App
 */
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      searchFilter: '',
      visible: 10,
      levelFilters: []
    }
  }
  /**
   * Load more cards
   */
  loadMore() {
    this.setState((prev) => {
      return { visible: prev.visible + 10 }
    })
  }

  /**
   * Filter by Class Level
   * @param {string} lvl Level search param
   */
  getLevels(lvl) {
    let lvls_wanted = lvl.split('.')
    return _classes.filter(cl => {
      let class_level = /level-(.?)-*(.*)/.exec(cl.level[0]);
      if (!cl.level[0]) 
      {//empty array is beginner level
        return 'beginner' === lvl
      }
      //level information exists
      if ('beginner' === cl.level[0]) 
      {//return beginner
        return 'beginner' === lvl
      }
      // if only one level
      if (1 === lvls_wanted.length ) 
      {
        return lvls_wanted[0] === class_level[1] && class_level[2].length === 0
      }
      // a level range
      return lvls_wanted[0] === class_level[1] && lvls_wanted[1] === class_level[2]
    })
  }
  /**
   * Handle Filter for Level
   * @param {object} e Event
   */
  changeLevel(e) {
    //sanity check, are we already filtering for this one?
    if (this.state.levelFilters.includes(e))
    {
      return
    }
    let lvls = this.getLevels(e)//the class levels of the current request

    //if we already have some filters, get those too
    let currentLvls = []
    this.state.levelFilters.forEach(filter => {
      let tmp = this.getLevels(filter)
      currentLvls = currentLvls.concat(...tmp)
    })
    lvls = lvls.concat(...currentLvls)
    if (this.state.searchFilter.length)
    {//reapply text search if applicable
      lvls = this.textSearch(lvls, this.state.searchFilter)
    }
    this.setState({
      data: lvls,
      levelFilters: this.state.levelFilters.concat(e),
      visible: 10,
    })
  }
  /**
   * Remove the current filter
     * @param {object} e Event
   */
  clearFilter(e) {
    let data = [..._classes]
    //what are our current filters after we remove this one?
    let currentLevelFilters = this.state.levelFilters.filter(fl => e.target.id !== fl)
    if (currentLevelFilters.length > 0)
    {// we have filters in place, use them
      let currentLvls = []
      currentLevelFilters.forEach(lvlFilter =>{
        let tmp = this.getLevels(lvlFilter)
        currentLvls = currentLvls.concat(...tmp)
  
      })
      data = [...currentLvls]
    }
    if (this.state.searchFilter.length)
    {//if we have search text, apply it
      data = this.textSearch(data, this.state.searchFilter)
    }
    this.setState({
      data: data,
      levelFilters: currentLevelFilters,
      visible: 10,
    })
  }

  /**
   * Handle Search Text changes
   * @param {object} e Event
   */
  onChangeSearch(e){
    //filter the classes for the search values
    let data = [..._classes]
    //reset data state if necessary
    if (this.state.levelFilters.length > 0)
    {// we have filters in place, use them
      let currentLvls = []
      this.state.levelFilters.forEach(lvlFilter =>{
        let tmp = this.getLevels(lvlFilter)
        currentLvls = currentLvls.concat(...tmp)
  
      })
      data = [...currentLvls]
    }
    if ('' === e.target.value)//reset
    {
      this.setState({
        data: data,
        searchFilter: ''
      })
      return
    }
    //combine the data to search it all
    let filtered_data = this.textSearch(data, e.target.value)
    this.setState({
      data: filtered_data,
      searchFilter: e.target.value,
    })
  }

  /**
   * Filter by Text
   * @param {array} data Array of class data
   * @param {string} filter Search Filter string
   */
  textSearch(data, filter){
    return data.filter(cl => {
      return `${cl.title} ${this.capitalizeAllWords(cl.teacher[0])}`.search(filter) >= 0
    })
  }

  componentDidMount() {
    this.setState({
      data: _classes
    })
  }

  /**
   * Decode HTML encoding
   * @param {string} html 
   */
  decodeHTML(html) {
    let txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  /**
   * Capitalize all Words
   * @param {string} str String to Capitalize
   */
  capitalizeAllWords(str) {
    return str.replace(/-/g, ' ').split(' ').map(str => str.charAt(0).toUpperCase() + str.slice(1) + ' ')
  }
  render() {
    if (!this.state.data) 
    {
      return (<div>Please wait...</div>)
    }
    return (
      <div className="App">
        <div className='text-center ygi-block-text__title'>
          <h1 >ONLINE YOGA CLASSES</h1>
        </div>
        <Container fluid={false}>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <input type="text" className="input" placeholder="Search..." onChange={(e) =>this.onChangeSearch(e)} />
            </Col>
            <Col md="auto">
              <DropdownButton variant="outline-dark" id="dropdown-item-teacher" title="Teacher"  >
              </DropdownButton>
            </Col>
            <Col md="auto">
              <DropdownButton variant="outline-dark" id="dropdown-item-duration" title="Duration">
              </DropdownButton>
            </Col>
            <Col md="auto">
              <DropdownButton variant="outline-dark" id="dropdown-item-level" title="Level" onSelect={(e) => this.changeLevel(e)} >
                <Dropdown.Item as="button" eventKey='beginner'>Beginner</Dropdown.Item>
                <Dropdown.Item as="button" eventKey='1'>Level 1</Dropdown.Item>
                <Dropdown.Item as="button" eventKey='1.2'>Level 1/2</Dropdown.Item>
                <Dropdown.Item as="button" eventKey='2'>Level 2</Dropdown.Item>
                <Dropdown.Item as="button" eventKey='2.3'>Level 2/3</Dropdown.Item>
                <Dropdown.Item as="button" eventKey='3'>Level 3</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col md="auto">
              <DropdownButton variant="outline-dark" id="dropdown-item-style" title="Style">
              </DropdownButton>
            </Col>
            <Col md="auto">
              <DropdownButton variant="outline-dark" id="dropdown-item-anatomy" title="Anatomy">
              </DropdownButton>
            </Col>
          </Row>
          <Row className="justify-content-md-left">
            <Col md="auto">
              {
                this.state.levelFilters.length ? <div>Filters</div> : null
              }
            </Col>
            <Col md="auto" className="justify-content-md-left">
              <hr/>
              {
                this.state.levelFilters.map((filter, i) =>{
                  return <div className="alert fade show alert-dismissible dismissible " role="alert" key={`flt-${i}`} id='_button' >
                    <Button className="close" variant="none" block="true"
                      type="button" aria-label="Close" onClick={(e) => this.clearFilter(e)} id={`${filter}`}>
                      {filter}
                      <span aria-hidden="true" id={`${filter}`}> &times;</span>
                    </Button>
                  </div>
                })
              }
            </Col>
          </Row>
        </Container>
        <hr />
        <div className='text-center'>
          <h3>{this.state.data.length} Results</h3>
          <Container fluid={false}>
            <Row>
              {
                this.state.data.map((cl, i) => {
                  if (i >= this.state.visible) 
                  {
                    return <div key={`card-${i}`}></div>
                  }
                  let teacher = this.capitalizeAllWords(cl.teacher[0])
                  return <Card className='ygi-course-card' key={`card-${i}`}>
                    <Card.Img as='img' variant="top" src={cl.thumb} className='ygi-course-card__alt_image' />
                    <Card.Body>
                      <Card.Title className='ygi-course-card__title'>{this.decodeHTML(cl.title)}</Card.Title>
                      <Card.Text className='ygi-course-card__content'>
                        {teacher}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                })
              }
            </Row>
            <hr/>
            {this.state.visible < this.state.data.length &&
              <Button onClick={() => this.loadMore()} type='button' variant="outline-dark">LoadMore</Button>
            }
          </Container>
        </div>

        <Jumbotron id='footer' className="text-right">
        Copyright 2019, Blacktoque Software
        </Jumbotron>
      </div>
    );
  }
}

export default App;
