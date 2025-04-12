import { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
const Navbar = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <nav>
        <div className="logo">RSKIAA CAFE</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <Link
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                key={element.id}
              >
                {element.title}
              </Link>
            ))}
          </div>
          <Link
            to="reservation"
            spy={true}
            smooth={true}
            duration={500}
            className="menuBtn"
          >
            ORDER NOW
          </Link>
          <Link
            to="menu"
            spy={true}
            smooth={true}
            duration={500}
            className="menuBtn"
          >
            OUR MENU
          </Link>
          {/* <button className="menuBtn">OUR MENU</button> */}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
