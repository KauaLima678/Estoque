import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/cadastroCategoria.module.css"
import { IoMdSave } from "react-icons/io";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

export default function CadastroCategoria() {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [erro, setErro] = useState("")

  const navigate = useNavigate()

  const isValid =
    nome.trim() !== "" && descricao.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("categorias", {
        name: nome,
        description: descricao
      })
      navigate("/categorias")
    } catch (err) {
      setErro(err.message)
      console.log(erro);
    }
  }
  

  return (
    <div className={style.main}>
        <h2>Cadastrar Categoria</h2>
      <form className={style.formCadastro} onSubmit={handleSubmit}>

        <div className={style.inputContainer}>
        <label htmlFor="nome">Nome</label>
        <input type="text"
          id="nome"
          placeholder="Digite um nome de categoria"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        </div>
        <div className={style.inputContainer}>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          name="descricao"
          id="descricao"
          value={descricao}
          placeholder="Digite uma descrição"
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        </div>

        <div className={style.botoes}>
          <button className={style.save} type="submit" disabled={!isValid }>
           <IoMdSave /> Salvar
          </button>
          <button className={style.cancel} type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
    </div>
  );
}

