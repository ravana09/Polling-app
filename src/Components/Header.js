import React, { createContext, useState } from "react";
import "../Components/header.css";
import { Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";

export const SearchContext=createContext()

function Header() {
  const [searchData,setSearchData]=useState('')
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  }

  const user = localStorage.getItem("Users_Name");


  console.log(searchData);
  

  function handleClick() {}
  return (
    <SearchContext.Provider value={{searchData}}>
    <>
      <Row  xs={12} md={12} lg={12} xl={12} className="fixed-top">
        <Col >
          <Navbar expand="lg" className="Header">
            <Container>
              <Navbar.Brand className="Header-Title">GT POLL</Navbar.Brand>

              <Form inline>
                <Row>
                  <Col xs="auto">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className="search-Bar "
                      value={searchData}
                      onChange={(e)=>{
                        setSearchData(e.target.value)
                      }}
                    />
                  </Col>
                </Row>
              </Form>
              <Navbar.Text>
                <Nav.Link
                  onClick={() => handleClick("/home")}
                  style={{ fontSize: 20 }}
                >
                  Hello !! {capitalizeFirstLetter(user)}
                </Nav.Link>
              </Navbar.Text>
              {/* </Navbar.Collapse> */}
            </Container>
          </Navbar>
        </Col>
      </Row>
    </>
    </SearchContext.Provider>
  );
}

export default Header;
