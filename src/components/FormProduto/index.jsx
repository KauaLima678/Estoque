import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUDANÇA 1: Usar apenas um arquivo CSS e chamá-lo de 'style' para consistência.
// Verifique se o caminho '../../styles/cadastroProduto.module.css' está correto para a sua estrutura de pastas.
import style from "./style.module.css";
import { IoMdSave } from "react-icons/io";
import ImageUpload from "../ImageUpload";

// O esquema de validação permanece o mesmo
const schema = (isEditing) =>
  yup.object().shape({
    nome: yup.string().required("O nome é obrigatório."),
    descricao: yup.string().required("A descrição é obrigatória."),
    preco: yup
      .number()
      .typeError("O preço deve ser um número.")
      .positive("O preço deve ser positivo.")
      .required("O preço é obrigatório."),
    quantidade: yup
      .number()
      .typeError("A quantidade deve ser um número.")
      .min(0, "A quantidade não pode ser negativa.")
      .required("A quantidade é obrigatória."),
    categoriaId: yup.string().required("Selecione uma categoria."),
    imagemFile: yup
      .mixed()
      .test(
        "required",
        "A imagem do produto é obrigatória.",
        (value) => isEditing || value
      )
      .test(
        "fileSize",
        "O arquivo é muito grande (máx 2MB)",
        (value) => !value || value.size <= 2000000
      )
      .test(
        "fileType",
        "Formato de arquivo não suportado",
        (value) =>
          !value ||
          ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      ),
  });

export default function FormularioProduto({
  produto,
  onSave,
  onCancel,
  categorias,
  isSubmitting,
}) {
  const isEditing = !!produto;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema(isEditing)),
  });

  // A lógica de preenchimento do formulário permanece a mesma
  useEffect(() => {
    if (isEditing) {
      reset({
        nome: produto.name,
        descricao: produto.description,
        preco: produto.price,
        quantidade: produto.quantity,
        categoriaId: produto.categoryId,
        imagemFile: produto.imageFile || null,
      });
    } else {
      reset({ // A lógica de criação permanece a mesma
        nome: "",
        descricao: "",
        preco: "",
        quantidade: 0,
        categoriaId: "",
        imagemFile: null,
      });
    }
  }, [produto, isEditing, reset]);

  return (
    <form
      className={style.formCadastro} // Já usava 'style', mas agora vem do arquivo certo
      onSubmit={handleSubmit(onSave)}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className={style.formTitle}>
        {isEditing ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h2>

      <div className={style.inputContainer}>
        <label htmlFor="nome">Nome</label>
        <input id="nome" type="text" {...register("nome")} />
        {errors.nome && (
          <p className={style.errorMessage}>{errors.nome.message}</p>
        )}
      </div>

      <div className={style.inputContainer}>
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" {...register("descricao")} />
        {errors.descricao && (
          <p className={style.errorMessage}>{errors.descricao.message}</p>
        )}
      </div>

      <div className={style.formRow}>
        <div className={style.inputContainer}>
          <label htmlFor="preco">Preço</label>
          <input id="preco" type="number" step="0.01" {...register("preco")} />
          {errors.preco && (
            <p className={style.errorMessage}>{errors.preco.message}</p>
          )}
        </div>

        <div className={style.inputContainer}>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="number"
            min="0"
            {...register("quantidade")}
          />
          {errors.quantidade && (
            <p className={style.errorMessage}>{errors.quantidade.message}</p>
          )}
        </div>
      </div>

      <div className={style.inputContainer}>
        <label>Imagem do Produto</label>
        <Controller
          name="imagemFile"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageUpload
              value={value}
              onChange={onChange}
              initialImageUrl={
                isEditing ? `http://localhost:3333${produto.imageUrl}` : null
              }
            />
          )}
        />
        {errors.imagemFile && (
          <p className={style.errorMessage}>{errors.imagemFile.message}</p>
        )}
      </div>

      <div className={style.inputContainer}>
        <label htmlFor="categoria">Categoria</label>
        <select id="categoria" {...register("categoriaId")}>
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
        {errors.categoriaId && (
          <p className={style.errorMessage}>{errors.categoriaId.message}</p>
        )}
      </div>

      <div className={style.botoes}>
        <button className={style.save} type="submit" disabled={isSubmitting}>
          <IoMdSave /> {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
        <button className={style.cancel} type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
