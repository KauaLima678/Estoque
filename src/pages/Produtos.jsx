import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderProducts from "../components/HeaderProducts";
import axios from "axios";
import style from "../styles/produtos.module.css";
import { CiSearch } from "react-icons/ci";
import { LuBox } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { FaFilter, FaRegTrashCan } from "react-icons/fa6";
import { Footer } from "../components/Footer";
import { BiSolidAddToQueue } from "react-icons/bi";
import FormularioProduto from "../components/FormProduto"; // IMPORTA O NOVO COMPONENTE

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [busca, setBusca] = useState("");
  const [erroApi, setErroApi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CONTROLE DE VISIBILIDADE DOS MODAIS ---
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  const location = useLocation();

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

 useEffect(() => {
    Promise.all([
      api.get("/categorias"),
      api.get("/produtos")
    ])
    .then(([categoriasRes, produtosRes]) => {
      const listaCategorias = categoriasRes.data;
      const listaProdutos = produtosRes.data;

      setCategorias(listaCategorias);

      const produtosOrdenados = listaProdutos.sort((a, b) => b.id - a.id);

      const novoProduto = location.state?.novoProduto;
      if (novoProduto) {
        const categoriaCompleta = 
          listaCategorias.find(c => String(c.id) === String(novoProduto.categoryId)) || null;

        const produtoEnriquecido = { ...novoProduto, category: categoriaCompleta };
        
        const listaFiltrada = produtosOrdenados.filter(p => p.id !== novoProduto.id);
        setProdutos([produtoEnriquecido, ...listaFiltrada]);
        window.history.replaceState({}, document.title);
      } else {
        setProdutos(produtosOrdenados);
      }
    })
    .catch(err => {
      console.error("Erro ao buscar dados iniciais:", err);
    });

  }, [location.state]);

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
      setErroApi(err.message);
    }
  }

  const handleSalvarProduto = async (data) => {
    setIsSubmitting(true);
    setErroApi("");

    const formData = new FormData();
    formData.append("name", data.nome);
    formData.append("description", data.descricao);
    formData.append("price", data.preco);
    formData.append("quantity", data.quantidade);
    formData.append("categoryId", data.categoriaId);

    // Agora 'data.imagemFile' sempre terá um valor (o novo ou o antigo)
    formData.append("image", data.imagemFile);

    try {
      let res;
      if (produtoParaEditar) {
        // MODO EDIÇÃO
        res = await api.patch(`/produtos/${produtoParaEditar.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const categoriaDoProduto =
          categorias.find(
            (c) => String(c.id) === String(res.data.categoryId)
          ) || null;
        const produtoAtualizado = { ...res.data, category: categoriaDoProduto };
        setProdutos(
          produtos.map((p) =>
            p.id === produtoParaEditar.id ? produtoAtualizado : p
          )
        );
        setProdutoParaEditar(null);
      } else {
        // MODO CADASTRO
        res = await api.post("/produtos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const categoriaDoProduto =
          categorias.find(
            (c) => String(c.id) === String(res.data.categoryId)
          ) || null;
        const novoProduto = { ...res.data, category: categoriaDoProduto };
        setProdutos((prev) => [novoProduto, ...prev]);
        setIsModalCadastroAberto(false);
      }
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErroApi(
        "Erro ao salvar produto. Verifique os dados e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funções para abrir os modais
  const abrirModalEdicao = async (produto) => {
    try {
      // 1. Busca a imagem e converte-a para um objeto File
      const response = await fetch(`http://localhost:3333${produto.imageUrl}`);
      const blob = await response.blob();
      const fileName = produto.imageUrl.split("/").pop();
      const imageFile = new File([blob], fileName, { type: blob.type });

      // 2. Adiciona o objeto File ao produto que será editado
      const produtoComImagem = { ...produto, imageFile };
      setProdutoParaEditar(produtoComImagem);
    } catch (err) {
      console.error("Erro ao carregar a imagem para edição:", err);
      // Se falhar, abre o modal mesmo assim, mas mostra um erro
      setErroApi("Não foi possível carregar a imagem original para edição.");
      setProdutoParaEditar(produto); // Abre sem a imagem pré-carregada
    }
  };

  const abrirModalCadastro = () => {
    setIsModalCadastroAberto(true);
  };

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
          <h1>Produtos ({`${produtosFiltrados.length}`})</h1>
          <div className={style.list}>
            {produtos.length === 0 ? (
              <div className={style.null}>
                <LuBox className={style.svg} /> Nenhum Produto Cadastrado
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className={style.null}>
                <CiSearch className={style.svg} />
                Nenhum produto encontrado com os filtros atuais.
              </div>
            ) : (
              <>
                {produtosFiltrados.map((produto) => (
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
                        <p className={style.descrip}>{produto.description}</p>
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
                ))}
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

      {/* NOVO MODAL UNIFICADO */}
      {(isModalCadastroAberto || produtoParaEditar) && (
        <div
          className={style.overlay}
          onClick={() => {
            setIsModalCadastroAberto(false);
            setProdutoParaEditar(null);
          }}
        >
          <FormularioProduto
            produto={produtoParaEditar}
            onSave={handleSalvarProduto}
            onCancel={() => {
              setIsModalCadastroAberto(false);
              setProdutoParaEditar(null);
            }}
            categorias={categorias}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      {erroApi && (
        <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {erroApi}
        </p>
      )}
      <Footer />
    </>
  );
}
