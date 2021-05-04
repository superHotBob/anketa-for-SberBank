import "antd/dist/antd.css";
import "./App.css";
import { Select } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import NewAnketa from "./pages/newAnketa";

const { Option } = Select;

function App() {
  const [anketa, set_Anketa] = useState(0);
  const setAnketa = value => set_Anketa(value);
  return (
    <div className="App">
      <header className="App-header" />      
      <br />
      <h1>Анкетирование врачей</h1>
      <br />
      <p>
        <Link to="/sign">Я уже заполнял форму</Link>
      </p>
      <hr />
      <br />
      <p>
        Для начала выберите анкету для заполнения, потом это изменить будет нельзя.
        Есть три варианта анкетирования, все они зависят от типа договора заключаемого с СЗ.
      </p>
      <Select 
        style={{ width: "100%", margin: "24px 0" }} 
        onChange={setAnketa}
        placeholder="Выберите анкету для заполнения"
      >
        <Option  value={1}>Анкета при трудоустройстве в СберЗдоровье</Option>
        <Option  value={2}>Анкета при подключении врача из клиники партнера</Option>
        <Option  value={3}>Анкета при подключении врача из регионального МО (для РГС)</Option>
      </Select>
      {anketa !== 0 && < NewAnketa anketa={anketa} />}
    </div>
  );
}
export default App;