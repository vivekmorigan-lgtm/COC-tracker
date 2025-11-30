import loaderStyle from "../styles/main.module.css";

function Loader() {
  return (
    <div className={loaderStyle.loader}>
      <span></span>
      <span></span>
    </div>
  );
}

export default Loader;