import style from './style.module.css'

export default function Loading() {
  return (
    <div className={style.loaderContainer}>
    <div className={style.spinner}></div>
      <div className={style.loadingText}>Carregando o Sistema...</div>
    </div>
  );
}

