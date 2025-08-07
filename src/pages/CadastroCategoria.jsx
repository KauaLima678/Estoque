import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
import style from "../styles/cadastroCategoria.module.css";
import Logo from '../images/att.png'
import { FaArrowLeft } from "react-icons/fa6";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export default function CadastroCategoria() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const isValid = nome.trim() !== "" && descricao.trim() !== "";

 //use async sempre que for consumir algo de fora. Ex: API'S

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("categorias", {
        name: nome,
        description: descricao
      })
      navigate("/categorias");
    } catch (err) {
      setErro(err.message)
      console.log(erro);
    }
  }

  return (
    <>
    <div className={style.main}>
      <button className={style.arrow} onClick={() => navigate(-1)}>
      <FaArrowLeft/>
      </button>
      <form action="" onSubmit={handleSubmit}>
        <div className={style.sideShape}>
        <img src={Logo} alt="" />
        {/* <h3>Cadastre uma nova categoria de produtos</h3> */}
        </div>
        <div className={style.formContainer}>
        <h2>Cadastrar Categoria</h2>

        <div className={style.inputCont}>
          <div className={style.inputBox}>
              <label htmlFor="nome">Nome</label>
          <div className={style.input}>
            <input
              type="text"
              id="name"
              placeholder="Digite o nome da Categoria"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          </div>
            
        <div className={style.inputBox}>
              <label htmlFor="descricao">Descrição</label>
          <div className={style.input}>
            <textarea
              name="descricao"
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição da Categoria"
            />
          </div>
          </div>

          <div className={style.botoes}>
            <button type="button" onClick={() => navigate(-1)} className={style.cancel}>
              Cancelar
            </button>
            <button type="submit" disabled={!isValid} className={style.save}>
              Salvar
            </button>
          </div>
        </div>
        </div>
      </form>
    </div>
    </>
  );
}
