// import axios from "axios";
// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import style from "./style.module.css";
// import { FaArrowLeft } from "react-icons/fa6";
// import Logo from "../../images/att.png";

// const api = axios.create({
//   baseURL: "http://localhost:3333",
// });

// export default function ModalEditarCategoria({ isOpen, onClose }) {
//   const [nome, setNome] = useState("");
//   const [descricao, setDescricao] = useState("");
//   const [erro, setErro] = useState("");

//   const { id } = useParams();
//   const navigate = useNavigate();

//   async function editarCategoria(e) {
//     e.preventDefault();
//     try {
//       await api.put(`/categorias/${id}`, {
//         name: nome,
//         description: descricao,
//       });
//       onClose(); // Fecha o modal após salvar
//       navigate("/categorias");
//     } catch (err) {
//       setErro(err.message);
//     }
//   }

//   async function deletarCategoria(e) {
//     if (!window.confirm("Tem certeza que deseja deletar essa categoria?"))
//       return;
//     try {
//       await api.delete(`/categorias/${id}`);
//       onClose(); // Fecha o modal após deletar
//       navigate("/categorias");
//     } catch (err) {
//       setErro(err.message);
//     }
//   }

//   useEffect(() => {
//     if (isOpen) {
//       (async () => {
//         try {
//           const res = await api.get(`/categorias/${id}`);
//           setNome(res.data.name);
//           setDescricao(res.data.description);
//         } catch (err) {
//           setErro(err);
//         }
//       })();
//     }
//   }, [id, isOpen]);

//   const isValid = nome.trim() !== "" && descricao.trim() !== "";

//   if (erro.response?.status === 404) {
//     return <h1>Categoria não encontrada</h1>;
//   }

//   if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

//   return (
//     <div className={style.modalOverlay}>
//       <div className={style.modalContent}>
//         <button className={style.closeButton} onClick={onClose}>
//           <FaArrowLeft />
//         </button>
//         <form onSubmit={editarCategoria}>
//           <div className={style.sideShape}>
//             <img src={Logo} alt="" />
//           </div>
//           <div className={style.formContainer}>
//             <h2>Editar Categoria</h2>

//             <div className={style.inputCont}>
//               <div className={style.inputBox}>
//                 <label htmlFor="nome">Nome</label>
//                 <div className={style.input}>
//                   <input
//                     type="text"
//                     id="name"
//                     placeholder="Digite o nome da Categoria"
//                     required
//                     value={nome}
//                     onChange={(e) => setNome(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className={style.inputBox}>
//                 <label htmlFor="descricao">Descrição</label>
//                 <div className={style.input}>
//                   <textarea
//                     name="descricao"
//                     id="descricao"
//                     value={descricao}
//                     onChange={(e) => setDescricao(e.target.value)}
//                     placeholder="Descrição da Categoria"
//                   />
//                 </div>
//               </div>

//               <div className={style.botoes}>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className={style.cancel}
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!isValid}
//                   className={style.save}
//                 >
//                   Salvar
//                 </button>
//                 <button type="button" onClick={deletarCategoria}>
//                   Excluir
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
