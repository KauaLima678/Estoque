import Logo from '../../images/footerLogo.png'
import style from './style.module.css'

export function Footer() {
    return (
        <footer>
            <div className={style.row1}>
                <img className={style.logoFooter} src={Logo} alt="" />
                <div className={style.links}> 
                    <a href="/">Home</a>
                    <a href="/produtos">Produtos</a>    
                    <a href="/categorias">Categorias</a>
                </div>
            </div>
                <span>&copy; 2025 ColorMax Tintas. Todos os direitos reservados.</span>
        </footer>
    )
}