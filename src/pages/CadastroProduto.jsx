import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/cadastroProduto.module.css"
import { IoMdSave } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

  const isValid =
    nome.trim() !== "" &&
    descricao.trim() !== "" &&
    preco !== "" &&
    imagemFile !== null &&
    !isNaN(parseFloat(preco));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imagemFile) {
      setErro("Selecione uma imagem antes de salvar.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imagemFile); // precisa ser "image" por causa do upload.single("image")
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);
    formData.append("categoryId", categoriaId || "");

    try {
      setUploading(true);
      await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/produtos");
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErro("Erro ao salvar produto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={style.main}>
      <div className={style.back}>
        <button onClick={() => navigate (-1)}><IoArrowBack /> Voltar</button>
      </div>
        <h2>Cadastro de Produto</h2>
      <form className={style.formCadastro} onSubmit={handleSubmit}>

        <div className={style.inputContainer}>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        </div>
        <div className={style.inputContainer}>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        </div>

        <div className={style.inputContainer}>
        <label htmlFor="preco">Preço</label>
        <input
          type="number"
          step="0.01"
          id="preco"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        </div>

        <div className={style.inputContainer}>
        <label htmlFor="quantidade">Quantidade</label>
        <input
          type="number"
          id="quantidade"
          min="0"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        </div>

        <div className={`${style.inputContainer} ${style.fileInputContainer}`}>
        <label htmlFor="imagem">Imagem do Produto</label>
        <input
          type="file"
          id="imagem"
          accept="image/*"
          onChange={(e) => setImagemFile(e.target.files[0])}
          required
          className={style.fileInput}
        />
        </div>

        <div className={style.inputContainer}>
        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>

        </div>

        <div className={style.botoes}>
          <button className={style.save} type="submit" disabled={!isValid || uploading}>
           <IoMdSave /> {uploading ? "Salvando..." : "Salvar"}
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
