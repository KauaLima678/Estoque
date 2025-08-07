import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderProducts from "../components/HeaderProducts";
import axios from "axios";
import style from "../styles/produtos.module.css";
import { CiSearch } from "react-icons/ci";
import { MdAdd } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  useEffect(() => {
    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log("Erro ao buscar os produtos", err));
  }, [api]);

  const produtosFiltrados = busca.trim()
    ? produtos.filter((produto) =>
        produto.name.toLowerCase().includes(busca.toLowerCase())
      )
    : produtos;

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
          <select>
            <option value="">Todas as categorias</option>
            <option value="name">Nome</option>
            <option value="price">Preço</option>
            <option value="quantity">Quantidade</option>
          </select>
        </div>
      </div>
      </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className={style.card}>Nenhum Produto Cadastrado</div>
      ) : (
        produtosFiltrados.map((produto) => (
          <div key={produto.id} className={style.table}>
            <p>ID: {produto.id}</p>
            <p>Nome: {produto.name}</p>
            <p>Descrição: {produto.description}</p>
            <p>Preço: R$ {produto.price.toFixed(2)}</p>
            <p>Quantidade: {produto.quantity}</p>
            <p>Categoria: {produto.category?.name || "Sem categoria"}</p>
            <img
              src={`http://localhost:3333${produto.imageUrl}`}
              alt={produto.name}
              width={100}
            />

            <Link to={`/editar-produto/${produto.id}`}>Editar</Link>
          </div>
        ))
      )}
      </div>
    </>
  );
}
