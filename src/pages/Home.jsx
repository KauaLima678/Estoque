import { Link } from "react-router-dom";
import HeaderHome from "../components/Header Home";
import style from "../styles/home.module.css";
import Hero from "../images/Pinceladas Vibrantes em Tons Quentes.png"
import { FaArrowTrendUp, FaExclamation } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <>
    <HeaderHome />
    <div className={style.container}>
      <div className={style.hero}>
        <div className={style.text}>
        <h1>Bem-vindo ao Sistema de Estoque da ColorMax</h1>
        <p>Sistema completo para controle de estoque de tintas, pincéis, lixas e todos os materiais de pintura. Mantenha seu negócio sempre organizado e nunca perca uma venda por falta de produto.</p>
        </div>

        <div className="button">
            <Link to='/produtos'><button>Comece Agora</button></Link>
        </div>
      </div>

      <section className={style.geral}>
        <h1 className={style.sectionTitle}>Controle total do seu estoque</h1>

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
              <span className={style.number}>12</span>
              <p>5 Produtos precisam de reposição</p>
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
              <p>Total de Produtos cadastrados nos sistema</p>
                </div>
               <div className={style.quantity}>
              <span className={style.number}>4</span>
              <p>Novos produtos deste mês</p>
                </div>   
              </div>
            </div>
            <div className={`${style.card} ${style.cardBlue}`}>
              <div className={style.border}></div>
              <div className={style.info}>
                <div className={style.title}>
                <div className={style.icon}>
                  <div className={style.circle}></div>
                  <span><FaArrowTrendUp className={style.svg} color="rgb(0, 0, 255)" /></span>
                </div>
              <h4>Mais Vendidos</h4>
              <p>Produtos com maior saída</p>
                </div>
               <div className={style.quantity}>
              <span className={style.number}>3</span>
              <p>Produtos em alta demanda</p>
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
