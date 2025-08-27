import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import style from "../styles/cadastroProduto.module.css";
import { IoMdSave } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import ImageUpload from "../components/ImageUpload"; // Vamos criar este componente a seguir!
import HeaderHome from "../components/Header Home";
import { Footer } from "../components/Footer";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

// 1. Esquema de Validação com Yup
const schema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório."),
  descricao: yup.string().required("A descrição é obrigatória."),
  preco: yup.number().typeError("O preço deve ser um número.").positive("O preço deve ser positivo.").required("O preço é obrigatório."),
  quantidade: yup.number().typeError("A quantidade deve ser um número.").min(0, "A quantidade não pode ser negativa.").required("A quantidade é obrigatória."),
  categoriaId: yup.string().required("Selecione uma categoria."),
  imagemFile: yup.mixed().required("A imagem do produto é obrigatória.")
    .test("fileSize", "O arquivo é muito grande (máx 2MB)", value => value && value.size <= 2000000)
    .test("fileType", "Formato de arquivo não suportado", value => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))
});

export default function CadastroProduto() {
  const [categorias, setCategorias] = useState([]);
  const [erroApi, setErroApi] = useState("");
  const navigate = useNavigate();

  // 2. Integração do React Hook Form
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      quantidade: 0, // Valor padrão
    }
  });

  useEffect(() => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

  // 3. Função de Submissão Simplificada
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.nome);
    formData.append("description", data.descricao);
    formData.append("price", data.preco);
    formData.append("quantity", data.quantidade);
    formData.append("categoryId", data.categoriaId);
    formData.append("image", data.imagemFile); // "image" por causa do backend

    try {
      setErroApi("");
      const res = await api.post("/produtos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/produtos", { state: { novoProduto: res.data } });
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErroApi("Erro ao salvar produto. Tente novamente.");
    }
  };

  return (
    <>
    <HeaderHome />
    <div className={style.main}>
      
      <form className={style.formCadastro} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={style.titleForm}>Cadastro de Produto</h2>
        <div className={style.inputContainer}>
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" {...register("nome")} />
          {errors.nome && <p className={style.errorMessage}>{errors.nome.message}</p>}
        </div>

        <div className={style.inputContainer}>
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" {...register("descricao")} />
          {errors.descricao && <p className={style.errorMessage}>{errors.descricao.message}</p>}
        </div>

        {/* Layout em duas colunas para Preço e Quantidade */}
        <div className={style.formRow}>
          <div className={style.inputContainer}>
            <label htmlFor="preco">Preço</label>
            <input id="preco" type="number" step="0.01" {...register("preco")} />
            {errors.preco && <p className={style.errorMessage}>{errors.preco.message}</p>}
          </div>

          <div className={style.inputContainer}>
            <label htmlFor="quantidade">Quantidade</label>
            <input id="quantidade" type="number" min="0" {...register("quantidade")} />
            {errors.quantidade && <p className={style.errorMessage}>{errors.quantidade.message}</p>}
          </div>
        </div>

        <div className={style.inputContainer}>
            <label>Imagem do Produto</label>
            <Controller
                name="imagemFile"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ImageUpload
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            />
            {errors.imagemFile && <p className={style.errorMessage}>{errors.imagemFile.message}</p>}
        </div>

        <div className={style.inputContainer}>
          <label htmlFor="categoria">Categoria</label>
          <select id="categoria" {...register("categoriaId")}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
          {errors.categoriaId && <p className={style.errorMessage}>{errors.categoriaId.message}</p>}
        </div>

        <div className={style.botoes}>
          <button className={style.save} type="submit" disabled={isSubmitting}>
            <IoMdSave /> {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <button className={style.cancel} type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>

        {erroApi && <p className={style.apiError}>{erroApi}</p>}
      </form>
    </div>
    <Footer />
    </>
  );
}