import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/navbar";
import Main from "./components/main";

export default function () {
  return (
    <>
      <Nav></Nav>
      <Main></Main>
    </>
  );
}
