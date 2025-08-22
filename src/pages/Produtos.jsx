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
import { Footer } from "../components/Footer";
import { BiSolidAddToQueue } from "react-icons/bi";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // --- ESTADOS UNIFICADOS PARA OS MODAIS ---
  // Usaremos os mesmos estados para o formulário de edição e de cadastro
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [uploading, setUploading] = useState(false);

  // --- CONTROLE DE VISIBILIDADE DOS MODAIS ---
  const [produtoParaEditar, setProdutoParaEditar] = useState(null); // Para o modal de edição
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false); // Para o modal de cadastro

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

  // --- FUNÇÕES PARA O MODAL DE CADASTRO ---

  // Abre o modal e limpa os campos do formulário
  const abrirModalCadastro = () => {
    setNome("");
    setDescricao("");
    setPreco("");
    setQuantidade(0);
    setCategoriaId("");
    setImagemFile(null);
    setErro("");
    setIsModalCadastroAberto(true);
  };

  // Fecha o modal de cadastro
  const fecharModalCadastro = () => {
    setIsModalCadastroAberto(false);
  };

  // Lógica para enviar o novo produto para a API
  async function handleCadastrarProduto(e) {
    e.preventDefault();

    if (!imagemFile) {
      setErro("Por favor, selecione uma imagem para o produto.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imagemFile);
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);
    formData.append("categoryId", categoriaId || "");

    try {
      setUploading(true);
      const res = await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const novoProdutoDaApi = res.data;

      const categoriaCompleta = categorias.find(
        (c) => String(c.id) === String(novoProdutoDaApi.categoryId)
      );

      const produtoFinal = {
        ...novoProdutoDaApi,
        category: categoriaCompleta || null,
      };

      setProdutos((prevProdutos) => [...prevProdutos, produtoFinal]);

      fecharModalCadastro();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErro("Erro ao salvar produto. Verifique os dados e tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  // --- FUNÇÕES PARA O MODAL DE EDIÇÃO ---

  const abrirModalEdicao = (produto) => {
    setProdutoParaEditar(produto);
    setNome(produto.name);
    setDescricao(produto.description);
    setPreco(produto.price);
    setQuantidade(produto.quantity);
    setCategoriaId(produto.categoryId || "");
    setImagemFile(null);
    setErro("");
  };

  const fecharModalEdicao = () => {
    setProdutoParaEditar(null);
  };

  async function editarProduto(e) {
    e.preventDefault();
    if (!produtoParaEditar) return;

    setUploading(true);
    setErro("");

    try {
      let fileToSend = imagemFile;
      if (!fileToSend && produtoParaEditar.imageUrl) {
        try {
          const imageUrl = `http://localhost:3333${produtoParaEditar.imageUrl}`;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const fileName = produtoParaEditar.imageUrl.split("/").pop();
          fileToSend = new File([blob], fileName, { type: blob.type });
        } catch (fetchError) {
          console.error("Erro ao buscar a imagem existente:", fetchError);
          setErro(
            "Não foi possível manter a imagem original. Tente novamente."
          );
          setUploading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", nome);
      formData.append("description", descricao);
      formData.append("price", preco);
      formData.append("quantity", quantidade);
      formData.append("categoryId", categoriaId || "");

      if (fileToSend) {
        formData.append("image", fileToSend);
      }

      const res = await api.patch(
        `/produtos/${produtoParaEditar.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const produtoAtualizadoDaApi = res.data;

      const categoriaCompleta = categorias.find(
        (c) => String(c.id) === String(produtoAtualizadoDaApi.categoryId)
      );

      const produtoFinal = {
        ...produtoAtualizadoDaApi,
        category: categoriaCompleta || null,
      };

      setProdutos(
        produtos.map((p) => (p.id === produtoParaEditar.id ? produtoFinal : p))
      );

      fecharModalEdicao();
    } catch (apiError) {
      console.error(
        "Erro ao editar produto:",
        apiError.response?.data || apiError
      );
      setErro("Erro ao editar produto. Verifique os dados.");
    } finally {
      setUploading(false);
    }
  }

  // Validação para os botões de salvar (funciona para ambos os modais)
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
                <select
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                >
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
                <button
                  onClick={abrirModalCadastro}
                  className={style.addCardNull}
                >
                  <div className={style.icondivNull}>
                    <BiSolidAddToQueue />
                  </div>
                  <h1 className={style.addTitle}>
                    Clique aqui para Adicionar Produto
                  </h1>
                </button>
              </div>
            ) : (
              <>
                {/* Agora, dentro deste bloco, checamos o resultado dos filtros */}
                {produtosFiltrados.length > 0 ? (
                  // Se o filtro encontrou produtos, mapeia e exibe a lista
                  produtosFiltrados.map((produto) => (
                    <div key={produto.id} className={style.table}>
                      {/* ... O conteúdo do seu card de produto vai aqui ... */}
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
                            <span
                              className={`${style.esgotado} ${style.badge}`}
                            >
                              Esgotado
                            </span>
                          ) : (
                            <span
                              className={`${style.acabando} ${style.badge}`}
                            >
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
                          <p className={style.descrip}>
                            {" "}
                            {produto.description}
                          </p>
                        </div>
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
                          <button
                            className={style.edit}
                            onClick={() => abrirModalEdicao(produto)}
                          >
                            <span>
                              <FaEdit />
                            </span>
                            Editar
                          </button>
                          <button
                            onClick={() => deletarProduto(produto.id)}
                            className={style.delete}
                          >
                            <FaRegTrashCan />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Se o filtro não encontrou nada, exibe esta mensagem
                  <div className={style.null}>
                    <CiSearch className={style.svg} />
                    Nenhum produto encontrado com os filtros atuais.
                  </div>
                )}

                {/* O botão de adicionar normal, que só aparece se a lista total não estiver vazia */}
                <button onClick={abrirModalCadastro} className={style.addCard}>
                  <div className={style.icondiv}>
                    <BiSolidAddToQueue />
                  </div>
                  <h1 className={style.addTitle}>Adicionar Produto</h1>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {isModalCadastroAberto && (
        <div className={style.overlay} onClick={fecharModalCadastro}>
          <form
            className={style.formCadastro}
            onSubmit={handleCadastrarProduto}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={style.formTitle}>Cadastrar Novo Produto</h2>

            {/* Inputs do Formulário (copiados do seu código original) */}
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
            <div
              className={`${style.inputContainer} ${style.fileInputContainer}`}
            >
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
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botões do formulário */}
            <div className={style.botoes}>
              <button
                className={style.save}
                type="submit"
                disabled={!isValid || uploading}
              >
                <IoMdSave /> {uploading ? "Salvando..." : "Salvar"}
              </button>
              <button
                className={style.cancel}
                type="button"
                onClick={fecharModalCadastro}
              >
                Cancelar
              </button>
            </div>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
          </form>
        </div>
      )}
      {produtoParaEditar && (
        <div className={style.overlay} onClick={() => fecharModalEdicao()}>
          <form
            className={style.formCadastro}
            onSubmit={editarProduto}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={style.formTitle}>Editar Produto</h2>
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

            <div
              onClick={(e) => e.stopPropagation}
              className={`${style.inputContainer} ${style.fileInputContainer}`}
            >
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
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.botoes}>
              <button
                className={style.save}
                type="submit"
                disabled={!isValid || uploading}
              >
                <IoMdSave /> {uploading ? "Salvando..." : "Salvar"}
              </button>
              <button
                className={style.cancel}
                type="button"
                onClick={fecharModalEdicao}
              >
                Cancelar
              </button>
            </div>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
          </form>
        </div>
      )}
      <Footer />
    </>
  );
}
