  import { useEffect, useState } from "react";
  import HeaderHome from "../components/Header Home";
  import axios from "axios";
  import { Link, useNavigate, useParams } from "react-router-dom";
  import style from "../styles/Categorias.module.css";
  import { IoIosAddCircle, IoMdSave } from "react-icons/io";
  import { CiFilter, CiSearch } from "react-icons/ci";
  import { FaBox, FaFilter, FaRegTrashCan, FaTag, FaTrash } from "react-icons/fa6";
  import { FaEdit } from "react-icons/fa";
  import { LuBox } from "react-icons/lu";
  import HeaderProducts from "../components/HeaderProducts";
  

  export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState(null);
    const [produtos, setProdutos] = useState([]);

    const [busca, setBusca] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");
    const [cadastroModal, setCadastroModal] = useState(false)
    const [novoNome, setNovoNome] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");
    const { id } = useParams();
    const navigate = useNavigate()

    function abrirCadastro(){
      setCadastroModal(true)
    }
    function fecharCadastro(){
      setCadastroModal(false)
    }

    const openModal = (categoria) => {
  setCategoriaId(categoria.id);
  setNome(categoria.name);
  setDescricao(categoria.description);
  setModalOpen(true);
};
    async function editarCategoria(e) {
  e.preventDefault();
  try {
    await api.put(`/categorias/${categoriaId}`, {
      name: nome, // cuidado com o nome dos campos, deve bater com o backend
      description: descricao
    });
    setCategorias(prev =>
      prev.map(c =>
        c.id === categoriaId ? { ...c, nome, descricao } : c
      )
    );
    setModalOpen(false);
  } catch (err) {
    setErro(err.response?.data?.mensagem || err.message);
  }
} 
    const api = axios.create({
      baseURL: "http://localhost:3333",
    });

    useEffect(() => {
  api
    .get("/categorias")
    .then((res) => {
      setCategorias(res.data);
    })
    .catch((err) => console.log("Erro ao buscar as categorias", err));
}, []);

useEffect(() => {
  api
    .get("/produtos")
    .then((res) => {
      setProdutos(res.data);
    })
    .catch((err) => console.log("Erro ao buscar os produtos", err));
}, []);

    const categoriasFilter = busca.trim()
      ? categorias.filter((categoria) =>
          categoria.name.toLowerCase().includes(busca.toLowerCase())
        )
      : categorias;

    async function deletarCategoria(id) {
      if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
        return;
      try {
        await api.delete(`/categorias/${id}`);
        setCategorias((prev) => prev.filter((categoria) => categoria.id !== id)); // Remove da tela
      } catch (err) {
        setErro(err.message);
      }
    }

    const getContagemDeProdutos = (idDaCategoria) => {
    return produtos.filter((produto) => produto.categoryId === idDaCategoria).length;
    };

     const isValid =
    novoNome.trim() !== "" && novaDescricao.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
     const res = await api.post("categorias", {
        name: novoNome,
        description: novaDescricao
      })

      setCategorias((listaAtual) => [...listaAtual, res.data]);
      navigate("/categorias")

      setNovoNome("");
      setNovaDescricao("");
      setCadastroModal(false);
      setErro("");
    } catch (err) {
      setErro(err.message)
      console.log(erro);
    }
  }


    return (
      <>
        <HeaderProducts />
        <div className={style.body}>
          <div className={style.serchArea}>
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
                      placeholder="Buscar categoria..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={style.categorias}>
            <div className={style.titleTable}>
            <h1>Categorias ({`${categoriasFilter.length}`}) </h1>
            <div className={style.addButtonCont}>
              <button onClick={abrirCadastro} className={style.buttonAdd}>
                Adicionar uma categoria <IoIosAddCircle />
              </button>
            </div>
            </div>

            <div className={style.container}>
              {categoriasFilter.length === 0 ? (
                <div className={style.nullTag}>
                  {" "}
                  <FaTag /> Nenhuma categoria foi cadastrada.
                </div>
              ) : (
                categoriasFilter.map((categoria) => (
                  <div className={style.categoria} key={categoria.id}>
                    <div className={style.headerTag}>
                      <div className={style.titleTag}>
                        <div className={style.circle}></div>
                        <h2>{categoria.name}</h2>
                      </div>
                      <div className={style.badge}>
                        <span>
                          <LuBox color="#1447e6" size={18} /> {getContagemDeProdutos(categoria.id)}
                        </span>
                      </div>
                    </div>

                    <div className={style.description}>
                      <p>{categoria.description}</p>

                      <div className={style.actions}>
                        <span>{getContagemDeProdutos(categoria.id)} produto(s)</span>
                        <div className={style.btn}>
                          <button onClick={() => openModal(categoria)}  className={style.edit}>
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deletarCategoria(categoria.id)}
                            className={style.delete}
                          >
                            <FaRegTrashCan />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div onClick={() => setModalOpen(false)} className={style.overlay}>
            <div className={style.editCard}>
              <form onSubmit={editarCategoria} className={style.form} onClick={(e) => e.stopPropagation()} action="">
                <div className={style.inputContainer}>
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    placeholder="Digite um nome de categoria"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
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
                  <button
                    className={style.save}
                    type="submit"
                    // disabled={!isValid}
                  >
                    <IoMdSave /> Salvar
                  </button>
                  <button
                    className={style.cancel}
                    type="button"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>

                {erro && <p style={{ color: "red" }}>{erro}</p>}
              </form>
            </div>
          </div>
        )}

        {cadastroModal && (
          <div className={style.overlay} onClick={() => setCadastroModal(false)}>
            <form className={style.formCadastro} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
              <div className={style.formTitle}>
              <h1>Cadastrar Categoria</h1>
              </div>

        <div className={style.inputContainer}>
        <label htmlFor="nome">Nome</label>
        <input type="text"
          id="nome"
          placeholder="Digite um nome de categoria"
          required
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        </div>
        <div className={style.inputContainer}>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          name="descricao"
          id="descricao"
          value={novaDescricao}
          placeholder="Digite uma descrição"
          onChange={(e) => setNovaDescricao(e.target.value)}
          required
        />
        </div>

        <div className={style.botoes}>
          <button className={style.save} type="submit" disabled={!isValid }>
           <IoMdSave /> Salvar
          </button>
          <button className={style.cancel} type="button" onClick={fecharCadastro}>
            Cancelar
          </button>
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
          </div>
        )}
      </>
    );
  }
