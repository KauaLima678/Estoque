import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import HeaderProducts from "../components/HeaderProducts";
import axios from "axios";
import style from "../styles/produtos.module.css";
import { CiSearch } from "react-icons/ci";
import { MdAdd } from "react-icons/md";
import { IoMdPricetag, IoMdSave, IoMdTrash } from "react-icons/io";
import { LuBox } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { FaFilter, FaRegTrashCan } from "react-icons/fa6";

export default function Produtos() {
   const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // --- 1. ESTADOS PARA O MODAL DE EDIÇÃO ---
  const [produtoParaEditar, setProdutoParaEditar] = useState(null); // Controla o modal e guarda o produto
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [uploading, setUploading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  useEffect(() => {
    // Busca produtos
    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log("Erro ao buscar os produtos", err));

    // Busca categorias
    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    const matchBusca = busca.trim()
      ? produto.name.toLowerCase().includes(busca.toLowerCase())
      : true;
    const matchCategoria = categoriaSelecionada
      ? String(produto.categoryId) === String(categoriaSelecionada)
      : true;
    return matchBusca && matchCategoria;
  });

  async function deletarProduto(id) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
    } catch (err) {
      setErro(err.message);
    }
  }

  // --- 2. FUNÇÕES PARA CONTROLAR O MODAL ---

  // Abre o modal e preenche os campos com os dados do produto clicado
  const abrirModalEdicao = (produto) => {
    setProdutoParaEditar(produto); // Define qual produto está sendo editado e abre o modal
    setNome(produto.name);
    setDescricao(produto.description);
    setPreco(produto.price);
    setQuantidade(produto.quantity);
    setCategoriaId(produto.categoryId || "");
    setImagemFile(null); // Reseta a imagem para não usar a imagem de uma edição anterior
    setErro(""); // Limpa erros anteriores
  };

  // Fecha o modal e reseta os estados do formulário
  const fecharModalEdicao = () => {
    setProdutoParaEditar(null);
  };

  // --- 3. FUNÇÃO PARA ENVIAR A EDIÇÃO DO PRODUTO ---
  async function editarProduto(e) {
  e.preventDefault();
  if (!produtoParaEditar) return;

  setUploading(true);
  setErro(""); // Limpa erros anteriores

  try {
    let fileToSend = imagemFile; // Começa com a nova imagem, se houver

    // --- LÓGICA PRINCIPAL DA SOLUÇÃO ---
    // Se não há uma nova imagem (imagemFile é null), busca a imagem existente.
    if (!fileToSend && produtoParaEditar.imageUrl) {
      try {
        // 1. Monta a URL completa da imagem existente
        const imageUrl = `http://localhost:3333${produtoParaEditar.imageUrl}`;
        
        // 2. Faz o fetch da imagem como dados binários (blob)
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // 3. Extrai o nome do arquivo da URL
        const fileName = produtoParaEditar.imageUrl.split("/").pop();
        
        // 4. Cria um novo objeto File a partir do blob, para ser enviado no FormData
        fileToSend = new File([blob], fileName, { type: blob.type });

      } catch (fetchError) {
        console.error("Erro ao buscar a imagem existente:", fetchError);
        setErro("Não foi possível manter a imagem original. Tente novamente.");
        setUploading(false);
        return; // Para a execução se não conseguir buscar a imagem
      }
    }

    // Monta o FormData
    const formData = new FormData();
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);
    formData.append("categoryId", categoriaId || "");

    // Anexa o arquivo (ou o novo, ou o antigo reconstruído)
    if (fileToSend) {
      formData.append("image", fileToSend);
    } else {
      // Opcional: se não houver nem imagem nova nem antiga, pode dar um erro.
      // Depende da sua regra de negócio.
      console.warn("Nenhuma imagem para enviar.");
    }

    // Envia a requisição para a API
    const res = await api.patch(`/produtos/${produtoParaEditar.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Atualiza o estado e fecha o modal
    setProdutos(produtos.map(p => (p.id === produtoParaEditar.id ? res.data : p)));
    fecharModalEdicao();

  } catch (apiError) {
    console.error("Erro ao editar produto:", apiError.response?.data || apiError);
    setErro("Erro ao editar produto. Verifique os dados.");
  } finally {
    setUploading(false);
  }
}

  const isValid = nome.trim() !== "" && descricao.trim() !== "" && preco !== "";
  
  return (
    <>
      <HeaderProducts />

      <div className={style.container}>
        <div className={style.filter}>
          <div className={style.filterArea}>
            <div className={style.filterTitle}>
                <p>Filtros </p>
                <FaFilter />
                </div>
            <div className={style.filterCont}>
              <div className={style.searchCont}>
                <CiSearch />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div className={style.select}>
                <select onChange={(e) => setCategoriaSelecionada(e.target.value)}>
                  <option value="">Todas as Categorias</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className={style.produtos}>
          <h1>Produtos ( {`${produtosFiltrados.length}`} )</h1>

          <div className={style.list}>
            {produtosFiltrados.length === 0 ? (
              <div className={style.null}>
                {" "}
                <LuBox className={style.svg} /> Nenhum Produto Cadastrado
              </div>
            ) : (
              produtosFiltrados.map((produto) => {
                return (
                  <div key={produto.id} className={style.table}>
                    <div className={style.image}>
                      <img
                        src={`http://localhost:3333${produto.imageUrl}`}
                        alt={produto.name}
                        width={100}
                      />
                      <p className={style.categoriaBadge}>
                        {produto.category?.name || "Sem categoria"}
                      </p>
                      {produto.quantity < 10 ? (
                        produto.quantity === 0 ? (
                          <span className={`${style.esgotado} ${style.badge}`}>
                            Esgotado
                          </span>
                        ) : (
                          <span className={`${style.acabando} ${style.badge}`}>
                            Acabando
                          </span>
                        )
                      ) : (
                        <span className={`${style.estoque} ${style.badge}`}>
                          Em Estoque
                        </span>
                      )}
                    </div>
                    <div className={style.contentCard}>
                      <div className={style.textsCard}>
                        <p className={style.nome}>{produto.name}</p>
                        <p className={style.descrip}> {produto.description}</p>
                      </div>
                      {/* <div className={style.badgesCont}>
                        
                      </div> */}
                      <div className={style.infoItem}>
                        <div className={style.item}>
                          <span>Quantidade:</span>
                          <p>{produto.quantity}</p>
                        </div>
                        <div className={style.item}>
                          <span>Preço:</span>
                          <p className={style.preco}>
                            {produto.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className={style.buttonsDiv}>
                        <button className={style.edit} onClick={() => abrirModalEdicao(produto)}>
                          <span>
                            <FaEdit />
                          </span>
                          Editar
                        </button>
                        <button onClick={() => deletarProduto(produto.id)} className={style.delete}>
                          <FaRegTrashCan />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {produtoParaEditar &&(
        <div className={style.overlay} onClick={() => fecharModalEdicao()}>
          <form className={style.formCadastro} onSubmit={editarProduto} onClick={(e) => e.stopPropagation()}>
        <h2 className={style.formTitle}>Editar Produto</h2>
        <div className={style.contForm}>
        <div className={style.col1}>
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
        </div>

        <div className={style.col2}>

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

        <div onClick={(e) => e.stopPropagation} className={`${style.inputContainer} ${style.fileInputContainer}`}>
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
          <button className={style.cancel} type="button" onClick={fecharModalEdicao}>
            Cancelar
          </button>
        </div>
        </div>
          </div>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
        </div>
      )}
    </>
  );
}
