import { Link } from "react-router-dom";
import Logo from "../../images/att.png"
import style from "./style.module.css"
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function HeaderHome() {
  return (
    <header>
      <img className={style.logo} src={Logo} alt="" />


      <nav>
        <Link to="/">Home</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/categorias">Categorias</Link>
      </nav>

      <Link to="/Produtos"><button className={style.button}>Acessar Sistema</button></Link>
    </header>
  )
}