import {
  IconChartHistogram,
  IconDog,
  IconHome,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { useState } from "react";
import classes from "./Navbar.module.css";

const data = [
  { link: "", label: "ホーム", icon: IconHome },
  { link: "", label: "履歴", icon: IconChartHistogram },
  { link: "", label: "ペット", icon: IconDog },
  { link: "", label: "設定", icon: IconSettings },
];

export function Navbar() {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <IconLogout className={classes.linkIcon} stroke={1.5} />
        <span>Logout</span>
      </div>
    </nav>
  );
}
