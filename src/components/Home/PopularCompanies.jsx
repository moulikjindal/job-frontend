import React from "react";
import { TOP_COMPANIES } from "../../constants";
import { SectionTitle } from "../../ui";
import "./PopularCompanies.css";

const PopularCompanies = () => (
  <div className="companies">
    <div className="comp-inner">
      <SectionTitle sub="Leading employers hiring now">Top Companies</SectionTitle>
      <div className="comp-grid">
        {TOP_COMPANIES.map(({ id, title, location, openPositions, icon: Icon }) => (
          <div className="comp-card" key={id}>
            <div className="comp-header">
              <div className="comp-icon"><Icon /></div>
              <div className="comp-info">
                <p>{title}</p>
                <p>{location}</p>
              </div>
            </div>
            <button className="comp-positions">Open Positions: {openPositions}</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PopularCompanies;
