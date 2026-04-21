import React from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineWebhook,
  MdOutlineDesignServices,
  MdAccountBalance,
} from "react-icons/md";
import { FaReact, FaCode, FaMobileAlt } from "react-icons/fa";
import { SectionTitle } from "../../ui";
import "./PopularCategories.css";

const categories = [
  { icon: FaReact, title: "MERN Stack", count: "1,000+", color: "#818cf8" },
  { icon: MdOutlineWebhook, title: "Frontend Dev", count: "200+", color: "#06b6d4" },
  { icon: FaCode, title: "Backend Dev", count: "350+", color: "#10b981" },
  { icon: FaMobileAlt, title: "Mobile Dev", count: "500+", color: "#f59e0b" },
  { icon: MdOutlineDesignServices, title: "UI/UX Design", count: "305+", color: "#ec4899" },
  { icon: MdAccountBalance, title: "Finance", count: "150+", color: "#8b5cf6" },
];

const PopularCategories = () => (
  <section className="categories">
    <div className="cat-inner">
      <SectionTitle sub="Explore roles that match your skills">Top Categories</SectionTitle>
      <div className="cat-grid">
        {categories.map(({ icon: Icon, title, count, color }, i) => (
          <Link to="/job/getall" className="cat-card reveal" key={i} style={{ transitionDelay: `${i * 40}ms` }}>
            <div className="cat-icon" style={{ color, background: `${color}15` }}>
              <Icon />
            </div>
            <h4 className="cat-title">{title}</h4>
            <p className="cat-count">{count} jobs</p>
          </Link>
        ))}
      </div>
      <div className="cat-footer">
        <Link to="/job/getall" className="cat-view-all">View All Jobs →</Link>
      </div>
    </div>
  </section>
);

export default PopularCategories;
