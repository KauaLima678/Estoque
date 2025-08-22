import { Link } from "react-router-dom";
import HeaderHome from "../components/Header Home";
import style from "../styles/home.module.css";
import Hero from "../images/Pinceladas Vibrantes em Tons Quentes.png"
import { FaArrowTrendUp, FaExclamation, FaTag } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";

export default function Home() {

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Função para buscar produtos da API
    const fetchProdutos = async () => {
      try {
        const response = await fetch('http://localhost:3333/produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://localhost:3333/categorias');
        const db = await res.json();
        setCategorias(db);
      } catch (error) {
         console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  // Filtrar produtos com quantidade menor que 10
  const produtosBaixoEstoque = produtos.filter(
  produto => Number(produto.quantity) < 10
);
  const quantidadeBaixoEstoque = produtosBaixoEstoque.length;
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
    <HeaderHome />
    <div className={style.container}>
      <div className={style.hero}>
        <div className={style.text}>
        <h1>Bem-vindo ao Sistema de Estoque da <span>ColorMax</span></h1>
        <p>Sistema completo para controle de estoque de tintas, pincéis, lixas e todos os materiais de pintura. Mantenha seu negócio sempre organizado e nunca perca uma venda por falta de produto.</p>
        </div>

        <div className="button">
            <Link to='/produtos'><button>Comece Agora</button></Link>
        </div>
      </div>

      <section className={style.geral}>
        <h1 className={style.sectionTitle}>Controle prévio do seu estoque</h1>

        <div className={style.cardsCont}>
            <div className={`${style.card} ${style.cardRed}`}>
              <div className={style.border}></div>
              <div className={style.info}>
                <div className={style.title}>
                <div className={style.icon}>
                  <div className={style.circle}></div>
                  <span><FaExclamation className={style.svg} color="rgb(250, 41, 41)" /></span>
                </div>
              <h4>Produtos Acabando</h4>
              <p>Monitore Produtos com estoque baixo</p>
                </div>
               <div className={style.quantity}>
              <span className={style.number}>{quantidadeBaixoEstoque}</span>
              <p>Produto(s) precisam de reposição</p>
                </div>   
              </div>
            </div>
            <div className={`${style.card} ${style.cardGreen}`}>
              <div className={style.border}></div>
              <div className={style.info}>
                <div className={style.title}>
                <div className={style.icon}>
                  <div className={style.circle}></div>
                  <span><LuBox className={style.svg} color="green" /></span>
                </div>
              <h4>Total de Produtos</h4>
              <p>Total de Produtos cadastrados</p>
                </div>
               <div className={style.quantity}>
              <span className={style.number}>{produtos.length}</span>
              <p>Produtos no sistema</p>
                </div>   
              </div>
            </div>
            <div className={`${style.card} ${style.cardBlue}`}>
              <div className={style.border}></div>
              <div className={style.info}>
                <div className={style.title}>
                <div className={style.icon}>
                  <div className={style.circle}></div>
                  <span><FaTag className={style.svg} color="rgb(0, 0, 255)" /></span>
                </div>
              <h4>Categorias</h4>
              <p>Total de Categorias</p>
                </div>
               <div className={style.quantity}>
              <span className={style.number}>{categorias.length}</span>
              <p>Categorias Disponíveis</p>
                </div>   
              </div>
            </div>
        </div>
      </section>

      <section className={style.ready}>
          <h1 className={style.titleFinal}>Pronto para organizar seu estoque?</h1>
          <p>Acesse o painel de gerenciamento e tenha controle total sobre seus produtos.</p>

          <Link to='/produtos'><button className={style.buttonFinal}>Acessar Painel de Gerenciamento</button></Link>
          
      </section>

      <Footer />
    </div>
    </>
  );
}
