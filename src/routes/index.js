import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CadastroProduto from "../pages/CadastroProduto";
import EditarProduto from "../pages/EditarProduto";
import CadastroCategoria from "../pages/CadastroCategoria";
import Categorias from "../pages/Categorias";
import EditarCategoria from "../pages/EditarCategoria";
import Produtos from "../pages/Produtos";
import ScrollToTop from "../components/ScrollTop/ScrollTop";
export default function RoutesApp() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/cadastrar-produto" element={<CadastroProduto />} />
        <Route path="/cadastrar-categoria" element={<CadastroCategoria />} />
         <Route path="/editar-produto/:id" element={<EditarProduto />} />
         <Route path="/editar-categoria/:id" element={<EditarCategoria />} />
      </Routes>
    </BrowserRouter>
  );
}
