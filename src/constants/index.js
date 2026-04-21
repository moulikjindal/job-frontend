import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact, FaMicrosoft, FaApple, FaGoogle, FaSuitcase, FaBuilding, FaUsers, FaUserPlus } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4004/api/v1";

export const JOB_CATEGORIES = [
  "Java Development",
  "Python Development",
  "React Development",
  "PHP Development",
  "Software Engineer",
  "Frontend Web Development",
  "Backend Web Development",
  "Full Stack Development",
  "Mobile App Development",
  "Web Development",
  "MEAN Stack Development",
  "Intern Software Developer",
  "Intern Web Developer",
  "Intern App Developer",
  "Data Entry Operator",
];

export const HERO_STATS = [
  { id: 1, title: "1,23,441", subTitle: "Live Job", icon: FaSuitcase },
  { id: 2, title: "91,220", subTitle: "Companies", icon: FaBuilding },
  { id: 3, title: "2,34,200", subTitle: "Job Seekers", icon: FaUsers },
  { id: 4, title: "1,03,761", subTitle: "Employers", icon: FaUserPlus },
];

export const POPULAR_CATEGORIES = [
  { id: 1, title: "Frontend Web Development", subTitle: "200 Open Positions", icon: MdOutlineWebhook },
  { id: 2, title: "MERN STACK Development", subTitle: "1000+ Open Positions", icon: FaReact },
  { id: 3, title: "Game Development", subTitle: "80 Open Positions", icon: IoGameController },
  { id: 4, title: "Mobile App Development", subTitle: "500 Open Positions", icon: TbAppsFilled },
  { id: 5, title: "Artificial Intelligence", subTitle: "867 Open Positions", icon: GiArtificialIntelligence },
  { id: 6, title: "Graphics & Design", subTitle: "305 Open Positions", icon: MdOutlineDesignServices },
  { id: 7, title: "Video Animation", subTitle: "50 Open Positions", icon: MdOutlineAnimation },
  { id: 8, title: "Account & Finance", subTitle: "150 Open Positions", icon: MdAccountBalance },
];

export const TOP_COMPANIES = [
  {
    id: 1,
    title: "Microsoft",
    location: "Microsoft Campus, Gachibowli, Hyderabad, Telangana, India",
    openPositions: 10,
    icon: FaMicrosoft,
  },
  {
    id: 2,
    title: "Google",
    location: "Google India Pvt.Ltd RMZ Infinity – Tower E Bangalore.",
    openPositions: 15,
    icon: FaGoogle,
  },
  {
    id: 3,
    title: "Apple",
    location: "High Tech City Main Road Madhapur, Hyderabad, Telangana, India",
    openPositions: 20,
    icon: FaApple,
  },
];
