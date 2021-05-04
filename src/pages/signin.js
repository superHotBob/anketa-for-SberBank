import "../App.css";
import axios from "axios";
import "antd/dist/antd.css";
import { useState } from "react";
import { urltoken } from "../data/data.js";
import { Link, useHistory } from "react-router-dom";
import { Button, Input, Form, message } from "antd";


function Sign() {
  let history = useHistory()
  const [form] = Form.useForm()
  const [phone, setPhone] = useState("")
  const [snils, setSnils] = useState("")
  
  function Authorization() {
    axios({
      method: "post",
      url: urltoken,
      data: { username: 7 + phone.replace("-", ""), password: snils }
    })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        history.push(`/editanketa?member=${phone}`)
      })
      .catch(error => {
        message.warn({ content: "Проверьте корректность введенных данных и попробуйте еще раз." });
        history.push("/sign");
        setPhone("");
        setSnils("");
      })
  }
  const onChange = e => {
    const { value } = e.target;
   
    const reg = /[0-9\s?]/;
    if (reg.test(value)||value ==="") {
       setPhone(value);
    }
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      lg: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      lg: { span: 18 }
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
      lg: {
        span: 16,
        offset: 6,
      }
    },
  };
  return (
    <div className="App">
      <Link to="/" className="App-header" title="на главную">
        <header className="App-header" />
      </Link>
      <p>
        После авторизации вам будет доступно изменение данных, заполненных на
        первом этапе. А также ряд полей которые были изначально недоступны.
      </p>
        <Form layout="horizontal" onFinish={Authorization} form={form} {...formItemLayout}>
          <Form.Item label="* Телефон">
            <Input allowClear             
              placeholder="XXX-XXX-XX-XX"
              title="10 цифр без пробелов"
              addonBefore="+7"
              maxLength={13}
              onChange={onChange}
              required
              value={phone.replace(/(\d\d\d)(\d\d\d)(\d\d)(\d\d)/g, "$1-$2-$3-$4")}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}"
            
            />
          </Form.Item>
          <Form.Item label="* Снилс" >
            <Input.Password  allowClear
              required             
              maxLength={11}
              placeholder="XXX-XXX-XXX XX"
              title="11 цифр без пробелов"
              value={snils.replace(/(\d\d\d)(\d\d\d)(\d\d\d)(\d\d)/g, "$1-$2-$3 $4")}
              type="password"
              pattern="[0-9^\w]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}"
              onChange={(e) => setSnils(e.target.value)}
            />
          </Form.Item>
         
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
     
    </div>
  );
}

export default Sign;