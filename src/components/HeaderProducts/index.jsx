import { Link } from "react-router-dom";
import Logo from "../../images/att.png"
import style from "./style.module.css"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";
import { IoMdPricetag } from "react-icons/io";
import { MdAdd, MdArrowBack } from "react-icons/md";

export default function HeaderProducts() {
  return (
    <header>

      
    <Link to="/"><img className={style.logo} src={Logo} alt="" /></Link>
    


      <div className={style.buttons}>
      <Link to='/cadastrar-produto'><button className={style.add}><MdAdd /> Novo Produto</button></Link>
      <Link to='/categorias'><button className={style.tag}><IoMdPricetag /> Categorias</button></Link>
      </div>
    </header>
  )
}