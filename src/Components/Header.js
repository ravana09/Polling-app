import React, { createContext, useEffect, useState } from "react";
import "./PollHeader.css";
import { Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SearchContext = createContext();

function Header() {
  const [searchData, setSearchData] = useState("");

  let navigate = useNavigate();

  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  }

  const user = sessionStorage.getItem("Users_Name") || "Guest";

  function handleClick(prop) {
    navigate(prop);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (searchData && searchData.length > 0) {
        try {
          const response = await axios.post("http://49.204.232.254:84/polls/search", {
            query: searchData,
          });
          console.log(response.data, "searched data");
        

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [searchData]);

  return (
    <SearchContext.Provider value={{ searchData }}>
      <Row className="fixed-top" id="searchBar">
        <Col className="Header">
          <Navbar expand="lg">
            <Container>
              <Navbar.Text
                className="Header-Title"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => handleClick("/polling")}
              >
                Polling Booth
              </Navbar.Text>
              <Form>
                <Row>
                  <Col>
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
                style={{ fontSize: 25, color: "white", cursor: "pointer" }}
                className="Header-Title"
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
