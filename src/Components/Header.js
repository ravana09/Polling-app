import React, { createContext, useState } from "react";
import "./PollHeader.css";
import { Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";

export const SearchContext = createContext();

function Header() {
  const [searchData, setSearchData] = useState("");

  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  }

  const user = sessionStorage.getItem("Users_Name") || "Guest";

  console.log(searchData);

  function handleClick() {}
  return (
    <SearchContext.Provider value={{ searchData }}>
      <Row xs={12} md={12} lg={12} xl={12} className="fixed-top" id="searchBar">
        <Col className="Header"
        >
          <Navbar expand="lg" >
            <Container>
              <Navbar.Text
                href="/polling"
                className="Header-Title"
                style={{color:"White"}}
                
              >
                Polling Booth
              </Navbar.Text>
              <Form inline>
                <Row>
                  <Col xs="auto" md={12} lg={12} xl={12}>
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className="search-Bar"
                      aria-label="Search Bar"
                      value={searchData}
                      onChange={(e) => {
                        setSearchData(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              </Form>
              <Navbar.Text
                onClick={() => handleClick("/polling")}
                style={{ fontSize: 25,color:"white" }}
                className="Header-Title "
                
              >
                Hello !! {capitalizeFirstLetter(user)}
              </Navbar.Text>
              
            </Container>
          </Navbar>
        </Col>
      </Row>
    </SearchContext.Provider>
  );
}

export default Header;
