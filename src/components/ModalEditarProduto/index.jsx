import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./style.module.css"
import { IoMdSave } from "react-icons/io";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

export default function Modal({isOpen, onClose, produto}) {
   const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [imagemFile, setImagemFile] = useState(null);
    const [imagemUrlAtual, setImagemUrlAtual] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [erro, setErro] = useState("");
    const [uploading, setUploading] = useState(false);
  
    const { id } = useParams();
    const navigate = useNavigate();
  
    const isValid = nome.trim() !== "" &&
      descricao.trim() !== "" &&
      preco !== "" &&
      (imagemFile !== null || imagemUrlAtual !== "") &&
      !isNaN(parseFloat(preco));
  
  
    useEffect(() => {
      (async () => {
        try {
          const res = await api.get(`/produtos/${id}`);
          const produto = res.data;
          setNome(produto.name);
          setDescricao(produto.description);
          setPreco(produto.price);
          setQuantidade(produto.quantity);
          setImagemUrlAtual(produto.imageUrl);
          setCategoriaId(produto.categoryId || "");
        } catch (err) {
          setErro(err);
        }
      })();
  
      api.get("/categorias")
        .then(res => setCategorias(res.data))
        .catch(err => console.error("Erro ao buscar categorias:", err));
    }, [id]);
  
    async function editarProduto(e) {
      e.preventDefault();
  
      let fileToSend = imagemFile;
  
      // Se não selecionou nova imagem, reusa a imagem atual da URL
      if (!imagemFile && imagemUrlAtual) {
        try {
          const response = await fetch(`http://localhost:3333${imagemUrlAtual}`);
          const blob = await response.blob();
          const fileName = imagemUrlAtual.split("/").pop();
          fileToSend = new File([blob], fileName, { type: blob.type });
        } catch (err) {
          console.error("Erro ao obter imagem atual:", err);
          setErro("Erro ao preparar imagem atual para envio.");
          return;
        }
      }
  
      if (!fileToSend) {
        alert("Erro: nenhuma imagem disponível para envio.");
        return;
      }
  
      const formData = new FormData();
      formData.append("image", fileToSend);
      formData.append("name", nome);
      formData.append("description", descricao);
      formData.append("price", preco);
      formData.append("quantity", quantidade);
      formData.append("categoryId", categoriaId || "");
  
      try {
        setUploading(true);
        await api.patch(`/produtos/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        navigate("/produtos");
      } catch (err) {
        console.error("Erro ao editar produto:", err);
        setErro("Erro ao editar produto.");
      } finally {
        setUploading(false);
      }
    }
  
  
    async function deletarProduto() {
      if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
      try {
        await api.delete(`/produtos/${id}`);
        navigate("/produtos");
      } catch (err) {
        setErro(err.message);
      }
    }
  
    if (erro?.response?.status === 404) {
      return <h1>Produto não encontrado</h1>;
    }


  return (
    <div className={style.main}>
        <h2>Editar Produto</h2>
      <form className={style.formCadastro} onSubmit={editarProduto}>

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
