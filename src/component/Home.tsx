import React, { Component } from "react";
import Hero from "./Hero";
import Hero2 from "./Hero2";
import Explore from "./Explore";

export class Home extends Component {
  render() {
    return (
      <div>
     
<Hero2/>
        <Hero/>
        <Explore/>
      </div>
    );
  }
}

export default Home;
