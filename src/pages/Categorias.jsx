import { useEffect, useState } from "react";
// import Header from "../components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import style from "../styles/Categorias.module.css";
import { IoIosAddCircle } from "react-icons/io";
import EditarCategoria from "../components/EditarCategoriaModal";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  useEffect(() => {
    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.log("Erro ao buscar as categorias", err));
  }, [api]);

  const categoriasFilter = busca.trim()
    ? categorias.filter((categoria) =>
        categoria.name.toLowerCase().includes(busca.toLowerCase())
      )
    : categorias;

  return (
    <>
      {/* <Header /> */}
      <div className={style.sectionTitle}>
        <h1>Categorias</h1>
        <input
          type="text"
          placeholder="Buscar categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={style.busca}
        />
      </div>

      <div className={style.container}>
        {categoriasFilter.length === 0 ? (
          <p>Nenhuma categoria foi cadastrada.</p>
        ) : (
          categoriasFilter.map((categoria) => (
            <div className={style.categoria} key={categoria.id}>
              <div className={style.shape}>
                <p>{categoria.name}</p>
              </div>

              <div className={style.description}>
                <p>{categoria.description}</p>

                <div className={style.buttons}>
                  <button onClick={openModal}>Editar Categoria</button>
                  <EditarCategoria
                    isOpen={isModalOpen}
                    onClose={closeModal}
                  />
                  <button>Ver produtos</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={style.addButtonCont}>
        <Link to="/cadastrar-categoria" className={style.buttonAdd}>
          Adicionar uma categoria <IoIosAddCircle />
        </Link>
      </div>
    </>
  );
}
