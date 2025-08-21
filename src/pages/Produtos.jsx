import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import HeaderProducts from "../components/HeaderProducts";
import axios from "axios";
import style from "../styles/produtos.module.css";
import { CiSearch } from "react-icons/ci";
import { MdAdd } from "react-icons/md";
import { IoMdPricetag, IoMdTrash } from "react-icons/io";
import { LuBox } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  

  const { id } = useParams();

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  useEffect(() => {
    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log("Erro ao buscar os produtos", err));
  }, []);

      api.get("/categorias")
        .then(res => setCategorias(res.data))
        .catch(err => console.error("Erro ao buscar categorias:", err));

  const produtosFiltrados = produtos.filter((produto) => {
    const matchBusca = busca.trim()
      ? produto.name.toLowerCase().includes(busca.toLowerCase())
      : true;

    const matchCategoria = categoriaSelecionada
      ? String(produto.categoryId) === String(categoriaSelecionada) // 👈 importante: comparar ID
      : true;

    return matchBusca && matchCategoria;
  });


  async function deletarProduto(id) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((produto) => produto.id !== id)); // Remove da tela
    } catch (err) {
      setErro(err.message);
    }
  }
  
  return (
    <>
      <HeaderProducts />

      <div className={style.container}>
        <div className={style.filter}>
          <div className={style.filterArea}>
            <p>Filtros</p>
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
                        <Link to={`/editar-produto/${produto.id}`}>
                          <span>
                            <FaEdit />
                          </span>
                          Editar
                        </Link>
                        <button onClick={() => deletarProduto(produto.id)}>
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
    </>
  );
}
